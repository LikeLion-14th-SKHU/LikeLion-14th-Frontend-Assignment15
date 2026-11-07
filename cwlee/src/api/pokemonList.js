
import { getPokemon } from "./pokemon";
import { fetchWithCache } from "./fetchWithCache";

const BASE_URL = "https://pokeapi.co/api/v2";

export async function getPokemonList(limit, offset = 0, signal) {
    const data = await fetchWithCache(
        `${BASE_URL}/pokemon?limit=${limit}&offset=${offset}`,
        { signal }
    );

    const requests = data.results.map((item) =>
        getPokemon(item.name, signal)
    );

    const results = await Promise.allSettled(requests);

    const list = [];

    for (const result of results) {
        if (result.status === "fulfilled") {
            list.push(result.value);
        }
    }

    return { list, count: data.count };
}
