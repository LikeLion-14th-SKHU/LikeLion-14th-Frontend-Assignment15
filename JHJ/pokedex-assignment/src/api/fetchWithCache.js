// 과제 1. fetchWithCache
// - 같은 url은 한 번만 요청 (캐시 키 = url)
// - 5xx / 네트워크 에러면 최대 3번 재시도 (0.5초 → 1초 → 2초)
// - 4xx는 재시도 없이 바로 에러
// - options.signal로 취소되면 재시도하지 않음

const cache = new Map();
const MAX_RETRIES = 3;

// 기다리는 도중에 취소되면 바로 AbortError로 끝나는 sleep
function sleep(ms, signal) {
  return new Promise((resolve, reject) => {
    if (signal?.aborted) {
      reject(signal.reason);
      return;
    }
    const timer = setTimeout(resolve, ms);
    signal?.addEventListener(
      'abort',
      () => {
        clearTimeout(timer);
        reject(signal.reason);
      },
      { once: true },
    );
  });
}

export async function fetchWithCache(url, options = {}) {
  const { signal } = options;

  // ① 캐시에 있으면 서버에 묻지 않고 바로 반환
  if (cache.has(url)) {
    return cache.get(url);
  }

  let delay = 500;
  let lastError;

  for (let i = 0; i <= MAX_RETRIES; i++) {
    let res;
    try {
      res = await fetch(url, { signal });
    } catch (error) {
      // ② 취소된 요청은 재시도하지 않고 그대로 던짐
      if (error.name === 'AbortError') throw error;
      // ③ 네트워크 에러(fetch 자체가 실패) → 재시도 대상
      lastError = error;
    }

    if (res) {
      // ④ 성공: 캐시에 저장하고 반환
      if (res.ok) {
        const data = await res.json();
        cache.set(url, data);
        return data;
      }
      // ⑤ 4xx: 다시 해도 똑같으니 바로 에러
      if (res.status < 500) {
        throw new Error(`요청 실패: ${res.status}`);
      }
      // ⑥ 5xx: 재시도 대상
      lastError = new Error(`요청 실패: ${res.status}`);
    }

    // ⑦ 남은 기회가 있으면 기다렸다가 다시 (대기 시간 2배씩)
    if (i < MAX_RETRIES) {
      await sleep(delay, signal);
      delay *= 2;
    }
  }

  throw lastError ?? new Error('재시도 횟수 초과');
}
