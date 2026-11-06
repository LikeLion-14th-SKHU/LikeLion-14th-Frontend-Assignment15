import { useState } from 'react';
import { useDebounce } from './hooks/useDebounce.js';
import { usePokemonSearch } from './hooks/usePokemonSearch.js';
import { usePokemonList } from './hooks/usePokemonList.js';
import PokemonCard from './components/PokemonCard.jsx';
import './App.css';

export default function App() {
  const [input, setInput] = useState('');
  const keyword = useDebounce(input.trim().toLowerCase(), 300);
  const { pokemon, status } = usePokemonSearch(keyword);
  const [page, setPage] = useState(0); 
  const offset = page * 20;
  const { list, hasNext } = usePokemonList(20, offset);

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

       {/* 첫 페이지면 이전 막기, 다음 페이지 없으면 다음 막기  */}
      <div className="page-buttons">
        <button onClick={() => setPage(page - 1)} disabled={page === 0}>이전</button>
        <span>{page + 1} 페이지</span>
        <button onClick={() => setPage(page + 1)} disabled={!hasNext}>다음</button>
      </div>
    </main>
  );
}