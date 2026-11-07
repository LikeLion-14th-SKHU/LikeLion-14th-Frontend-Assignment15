// 과제 2. 직접 만든 Map 캐시 대신 fetchWithCache 사용
import { fetchWithCache } from './fetchWithCache.js';

const BASE_URL = 'https://pokeapi.co/api/v2';

export function getPokemon(id, signal) {
  return fetchWithCache(`${BASE_URL}/pokemon/${id}`, { signal });
}
