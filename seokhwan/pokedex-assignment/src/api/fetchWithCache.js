const cacheStorage = new Map(); // 캐시 저장소 전역 설정하기
const tries = 3; // 재시도 횟수 전역 설정

export async function fetchWithCache(url, options = {}) {
    if (cacheStorage.has(url)) {
        return cacheStorage.get(url);
    }

    let delay = 500; // 첫 대기 0.5초

    // 첫 요청 하고나서 재시도 3회여서 i = 0,1,2,3 → 최대 4번 요청
    for (let i = 0; i <= tries; i++) {
        let response = null;
        try {
            response = await fetch(url, options);
        } catch (error) {
            // 일부러 끊은 거라 재시도 없이 그대로 error
            if (error.name === 'AbortError') throw error;
            console.error('요청 중 오류 발생:', error);
        }

        // 성공일땐 JSON 변환하기
        if (response && response.ok) {
            const jsonData = await response.json();
            cacheStorage.set(url, jsonData);
            return jsonData;
        }

        if (response && response.status >= 400 && response.status < 500) {
            throw new Error(`요청 실패: ${response.status}`);
        }

        if (i < tries) {
            await wait(delay);
            delay = delay * 2; // 2배씩 대기시간인 늘어남
        }
    }

    throw new Error('재시도 횟수 초과');
}

function wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
