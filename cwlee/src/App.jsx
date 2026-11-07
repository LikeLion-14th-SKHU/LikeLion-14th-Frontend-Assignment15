// App.jsx

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
  const limit = 20;
  const offset = page * limit;
  const { list, count } = usePokemonList(limit, offset);

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

      <div className="pagination">
        <button
          onClick={() => setPage(page - 1)}
          disabled={page === 0}
        >
          이전
        </button>

        <span>{page + 1} 페이지</span>

        <button
          onClick={() => setPage(page + 1)}
          disabled={(page + 1) * limit >= count}
        >
          다음
        </button>
      </div>
    </main>
  );
}