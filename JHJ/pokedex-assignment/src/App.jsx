// App.jsx

import { useState } from 'react';
import { useDebounce } from './hooks/useDebounce.js';
import { usePokemonSearch } from './hooks/usePokemonSearch.js';
import { usePokemonList } from './hooks/usePokemonList.js';
import PokemonCard from './components/PokemonCard.jsx';
import './App.css';

const LIMIT = 20;

export default function App() {
  const [input, setInput] = useState('');
  const keyword = useDebounce(input.trim().toLowerCase(), 300);
  const { pokemon, status } = usePokemonSearch(keyword);

  // 과제 3. 이전 / 다음 페이지
  const [page, setPage] = useState(0);
  const offset = page * LIMIT;
  const { list, count } = usePokemonList(LIMIT, offset);

  const isFirstPage = page === 0;
  const isLastPage = count > 0 && offset + LIMIT >= count;

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

      <nav className="pagination">
        <button onClick={() => setPage((p) => p - 1)} disabled={isFirstPage}>
          이전
        </button>
        <span>{page + 1} 페이지</span>
        <button onClick={() => setPage((p) => p + 1)} disabled={isLastPage}>
          다음
        </button>
      </nav>
    </main>
  );
}
