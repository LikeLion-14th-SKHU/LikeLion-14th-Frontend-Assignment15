import { getPokemon } from './pokemon.js';
import { fetchWithCache } from './fetchWithCache.js';
const BASE_URL = 'https://pokeapi.co/api/v2';

export async function getPokemonList(limit, signal, offset) {

    const data = await fetchWithCache(`${BASE_URL}/pokemon?limit=${limit}&offset=${offset}`, { signal });

    const requests = data.results.map((item) => getPokemon(item.name, signal));
    const results = await Promise.allSettled(requests);

    const list = [];
    for (const result of results) {
        if (result.status === 'fulfilled') {
            list.push(result.value);
        }
    }
    return { list, hasNext: data.next !== null };
}
