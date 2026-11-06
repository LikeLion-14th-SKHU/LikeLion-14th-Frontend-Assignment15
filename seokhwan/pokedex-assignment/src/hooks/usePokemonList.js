import { useEffect, useState } from 'react';
import { getPokemonList } from '../api/pokemonList.js';

export function usePokemonList(limit, offset) {
  const [list, setList] = useState([]);
  const [hasNext, setHasNext] = useState(false); // 목록 받기 전엔 다음 버튼 막기

  useEffect(() => {
    const controller = new AbortController();

    async function load() {
      try {
        const data = await getPokemonList(limit, controller.signal, offset);
        setList(data.list);
        setHasNext(data.hasNext);
      } catch (error) {
        if (error.name !== 'AbortError') console.error(error);
      }
    }

    load();
    return () => controller.abort();
  }, [limit, offset]);

  return { list, hasNext };
}