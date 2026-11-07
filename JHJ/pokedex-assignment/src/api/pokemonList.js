// 과제 2. 목록 요청도 fetchWithCache 사용
// 과제 3. offset 추가 + 전체 개수(count)도 같이 반환 (마지막 페이지 판단용)
import { getPokemon } from './pokemon.js';
import { fetchWithCache } from './fetchWithCache.js';

const BASE_URL = 'https://pokeapi.co/api/v2';

export async function getPokemonList(limit, offset, signal) {
  const data = await fetchWithCache(
    `${BASE_URL}/pokemon?limit=${limit}&offset=${offset}`,
    { signal },
  );

  const requests = data.results.map((item) => getPokemon(item.name, signal));
  const results = await Promise.allSettled(requests);

  // allSettled는 AbortError도 '실패 1개'로 삼켜버려서,
  // 취소된 경우엔 여기서 직접 AbortError를 던져야 옛날 목록이 화면에 안 그려져요
  signal?.throwIfAborted();

  const list = [];
  for (const result of results) {
    if (result.status === 'fulfilled') {
      list.push(result.value);
    }
  }
  return { list, count: data.count };
}
