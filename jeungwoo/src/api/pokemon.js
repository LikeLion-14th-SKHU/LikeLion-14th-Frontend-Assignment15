import { fetchWithCache } from './fetchWithCache.js';

const BASE_URL = 'https://pokeapi.co/api/v2';

export async function getPokemon(id, signal) {
  // 캐시, 재시도, 에러 처리는 fetchWithCache 가 해줘요
  return fetchWithCache(`${BASE_URL}/pokemon/${id}`, { signal });
}
