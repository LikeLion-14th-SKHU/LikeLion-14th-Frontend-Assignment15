const cache = new Map();

const RETRY_DELAYS = [500, 1000, 2000];

function createAbortError() {
  return new DOMException('요청이 취소되었습니다.', 'AbortError');
}

function sleep(ms, signal) {
  return new Promise((resolve, reject) => {
    if (signal?.aborted) {
      reject(createAbortError());
      return;
    }

    const timer = setTimeout(() => {
      signal?.removeEventListener('abort', onAbort);
      resolve();
    }, ms);

    function onAbort() {
      clearTimeout(timer);
      signal?.removeEventListener('abort', onAbort);
      reject(createAbortError());
    }

    signal?.addEventListener('abort', onAbort, { once: true });
  });
}

export async function fetchWithCache(url, options = {}) {
  const { signal } = options;

  if (signal?.aborted) {
    throw createAbortError();
  }

  if (cache.has(url)) {
    return cache.get(url);
  }

  for (let attempt = 0; attempt <= RETRY_DELAYS.length; attempt++) {
    if (signal?.aborted) {
      throw createAbortError();
    }

    let response;

    try {
      response = await fetch(url, options);
    } catch (error) {
      if (signal?.aborted || error.name === 'AbortError') {
        throw createAbortError();
      }

      if (attempt === RETRY_DELAYS.length) {
        throw error;
      }

      await sleep(RETRY_DELAYS[attempt], signal);
      continue;
    }

    if (!response.ok) {
      const error = new Error(`HTTP ${response.status}`);
      error.status = response.status;

      if (response.status < 500) {
        throw error;
      }

      if (attempt === RETRY_DELAYS.length) {
        throw error;
      }

      await sleep(RETRY_DELAYS[attempt], signal);
      continue;
    }

    const data = await response.json();

    if (signal?.aborted) {
      throw createAbortError();
    }

    cache.set(url, data);

    return data;
  }
}
