import { fetchWithCache } from './fetchWithCache';
import { getPokemon } from './pokemon';

const BASE_URL = 'https://pokeapi.co/api/v2';

export async function getPokemonList(limit, offset, signal) {
  const url = `${BASE_URL}/pokemon?limit=${limit}&offset=${offset}`;

  const data = await fetchWithCache(url, { signal });

  const requests = data.results.map((item) =>
    getPokemon(item.name, signal)
  );

  const results = await Promise.allSettled(requests);

  if (signal?.aborted) {
    throw new DOMException('요청 취소', 'AbortError');
  }

  const list = results
    .filter((result) => result.status === 'fulfilled')
    .map((result) => result.value);

  return {
    list,
    total: data.count,
  };
}
