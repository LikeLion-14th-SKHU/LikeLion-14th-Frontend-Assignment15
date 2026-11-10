import { useEffect, useState } from 'react';
import { getPokemon } from '../api/pokemon';

export function usePokemonSearch(keyword) {
  const [pokemon, setPokemon] = useState(null);
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!keyword) {
      setPokemon(null);
      setError(null);
      setStatus('idle');
      return;
    }

    const controller = new AbortController();

    setPokemon(null);
    setError(null);
    setStatus('loading');

    async function search() {
      try {
        const data = await getPokemon(
          keyword,
          controller.signal
        );

        if (controller.signal.aborted) return;

        setPokemon(data);
        setStatus('success');
      } catch (err) {
        if (
          controller.signal.aborted ||
          err.name === 'AbortError'
        ) {
          return;
        }

        setError(err);
        setStatus('error');
      }
    }

    search();

    return () => controller.abort();
  }, [keyword]);

  return { pokemon, status, error };
}
