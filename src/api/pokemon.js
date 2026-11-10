import { fetchWithCache } from './fetchWithCache';

const BASE_URL = 'https://pokeapi.co/api/v2';

export async function getPokemon(id, signal) {
  const keyword = String(id).trim().toLowerCase();

  const url = `${BASE_URL}/pokemon/${encodeURIComponent(keyword)}`;

  return fetchWithCache(url, { signal });
}
