import { useEffect, useState } from 'react';
import { getPokemonList } from '../api/pokemonList.js';

export function usePokemonList(limit, offset) {
  const [list, setList] = useState([]);
  const [count, setCount] = useState(0);

  useEffect(() => {
    const controller = new AbortController();

    async function load() {
      try {
        const data = await getPokemonList(limit, offset, controller.signal);
        setList(data.list);
        setCount(data.count);
      } catch (error) {
        if (error.name !== 'AbortError') console.error(error);
      }
    }

    load();
    return () => controller.abort();
  }, [limit, offset]);

  return { list, count };
}