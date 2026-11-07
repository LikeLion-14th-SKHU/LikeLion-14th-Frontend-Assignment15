import { useState } from 'react';
import { useDebounce } from './hooks/useDebounce.js';
import { usePokemonSearch } from './hooks/usePokemonSearch.js';
import { usePokemonList } from './hooks/usePokemonList.js';
import PokemonCard from './components/PokemonCard.jsx';
import './App.css';

export default function App() {
  const [input, setInput] = useState('');
  const [page, setPage] = useState(0);
  const keyword = useDebounce(input.trim().toLowerCase(), 300);
  const { pokemon, status } = usePokemonSearch(keyword);
  const offset = page * 20;
  const { list, count } = usePokemonList(20, offset);
  const lastPage = Math.ceil(count / 20) - 1;

  return (
    <main>
      <h1>포켓몬 도감</h1>
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="이름 또는 번호"
      />

      <section className="result">
        {status === 'loading' && <p>찾는 중...</p>}
        {status === 'error' && <p>포켓몬을 찾을 수 없어요</p>}
        {status === 'success' && <PokemonCard pokemon={pokemon} />}
      </section>

      <section className="list">
        {list.map((item) => (
          <PokemonCard key={item.id} pokemon={item} />
        ))}
      </section>

      <button onClick={() => setPage(page - 1)} disabled={page === 0}>이전</button>
      <button onClick={() => setPage(page + 1)} disabled={page >= lastPage}>다음</button>
    </main>
  );
}