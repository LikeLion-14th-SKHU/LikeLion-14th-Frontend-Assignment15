export async function fetchWithCache(url, options = {}) {
  if (cache.has(url)) {
    return cache.get(url);
  }

  const retries = 3;
  let delay = 500;

  for (let i = 0; i <= retries; i++) {
    let res;
    try {
      res = await fetch(url, { signal: options.signal });
    } catch (error) {
      if (error.name === 'AbortError') throw error;
    }

    if (res) {
      if (res.ok) {
        const data = await res.json();
        cache.set(url, data);
        return data;
      }
      if (res.status < 500) throw new Error(`요청 실패: ${res.status}`);
    }

    if (i < retries) {
      await new Promise((resolve) => setTimeout(resolve, delay));
      delay = delay * 2;

      if (options.signal?.aborted) {
        throw new DOMException('요청 취소', 'AbortError');
      }
    }
  }
  throw new Error('재시도 횟수 초과');
}

const cache = new Map();
