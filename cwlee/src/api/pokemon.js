
import { fetchWithCache } from "./fetchWithCache";

const BASE_URL = "https://pokeapi.co/api/v2";

export async function getPokemon(id, signal) {
    return fetchWithCache(
        `${BASE_URL}/pokemon/${id}`,
        { signal }
    );
}
