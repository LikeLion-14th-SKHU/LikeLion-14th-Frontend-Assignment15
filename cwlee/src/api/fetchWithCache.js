
const cache = new Map();

const sleep = (ms, signal) =>
    new Promise((resolve, reject) => {
        if (signal?.aborted) {
            reject(signal.reason ?? new DOMException("Aborted", "AbortError"));
            return;
        }

        const timer = setTimeout(() => {
            signal?.removeEventListener("abort", onAbort);
            resolve();
        }, ms);

        function onAbort() {
            clearTimeout(timer);
            reject(signal.reason ?? new DOMException("Aborted", "AbortError"));
        }

        signal?.addEventListener("abort", onAbort, { once: true });
    });

export async function fetchWithCache(url, options = {}) {
    const { signal } = options;

    if (signal?.aborted) {
        throw signal.reason ?? new DOMException("Aborted", "AbortError");
    }

    if (cache.has(url)) {
        return cache.get(url);
    }

    for (let attempt = 0; attempt <= 3; attempt++) {
        try {
            const res = await fetch(url, { ...options, signal });

            if (res.status >= 400 && res.status < 500) {
                throw new Error(`요청 실패: ${res.status}`);
            }

            if (!res.ok) {
                if (attempt === 3) {
                    throw new Error(`서버 오류: ${res.status}`);
                }
            } else {
                const data = await res.json();

                if (signal?.aborted) {
                    throw signal.reason ?? new DOMException("Aborted", "AbortError");
                }

                cache.set(url, data);
                return data;
            }
        } catch (error) {
            if (signal?.aborted || error.name === "AbortError") {
                throw error;
            }

            if (error.message.startsWith("요청 실패:")) {
                throw error;
            }

            if (attempt === 3) {
                throw error;
            }
        }

        await sleep(500 * 2 ** attempt, signal);
    }
}
