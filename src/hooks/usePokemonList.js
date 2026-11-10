import { useEffect, useState } from 'react';
import { getPokemonList } from '../api/pokemonList';

export function usePokemonList(limit, offset) {
  const [list, setList] = useState([]);
  const [total, setTotal] = useState(0);
  const [status, setStatus] = useState('loading');
  const [error, setError] = useState(null);

  useEffect(() => {
    const controller = new AbortController();

    setList([]);
    setStatus('loading');
    setError(null);

    async function load() {
      try {
        const data = await getPokemonList(
          limit,
          offset,
          controller.signal
        );

        if (controller.signal.aborted) return;

        setList(data.list);
        setTotal(data.total);
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

    load();

    return () => controller.abort();
  }, [limit, offset]);

  return { list, total, status, error };
}
