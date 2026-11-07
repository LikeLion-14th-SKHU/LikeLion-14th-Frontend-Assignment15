const cache = new Map();

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function fetchWithCache(url, options = {}) {
  const { signal } = options;
  const retries = 3;

  if (cache.has(url)) return cache.get(url);

  let delay = 500;

  for (let i = 0; i <= retries; i++) {
    let res;
    try {
      res = await fetch(url, { signal });
    } catch (error) {
      if (error.name === 'AbortError') throw error;
      if (i === retries) throw error;
      await sleep(delay);
      delay *= 2;
      continue;
    }

    if (res.ok) {
      const data = await res.json();
      cache.set(url, data);
      return data;
    }
    if (res.status < 500) throw new Error(`요청 실패: ${res.status}`);
    if (i === retries) throw new Error(`요청 실패: ${res.status}`);
    await sleep(delay);
    delay *= 2;
  }
}