import { useEffect, useState } from 'react';
import { getPokemon } from '../api/pokemon.js';

export function usePokemonSearch(keyword) {
  const [pokemon, setPokemon] = useState(null);
  const [status, setStatus] = useState('idle');

  useEffect(() => {
    if (!keyword) return;
    const controller = new AbortController();

    async function search() {
      setStatus('loading');
      try {
        const data = await getPokemon(keyword, controller.signal);
        setPokemon(data);
        setStatus('success');
      } catch (error) {
        if (error.name === 'AbortError') return;
        setStatus('error');
      }
    }

    search();
    return () => controller.abort();
  }, [keyword]);

  return { pokemon, status };
}
