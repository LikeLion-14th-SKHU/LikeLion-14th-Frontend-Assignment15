import { useState } from 'react';
import { useDebounce } from './hooks/useDebounce';
import { usePokemonSearch } from './hooks/usePokemonSearch';
import { usePokemonList } from './hooks/usePokemonList';
import PokemonCard from './components/PokemonCard';

const PAGE_SIZE = 20;

export default function App() {
  const [input, setInput] = useState('');
  const [page, setPage] = useState(0);

  const keyword = useDebounce(input.trim().toLowerCase(), 300);

  const {
    pokemon,
    status: searchStatus,
    error: searchError,
  } = usePokemonSearch(keyword);

  const offset = page * PAGE_SIZE;

  const {
    list,
    total,
    status: listStatus,
  } = usePokemonList(PAGE_SIZE, offset);

  const totalPages = Math.ceil(total / PAGE_SIZE);

  const isFirstPage = page === 0;
  const isLastPage = total === 0 || offset + PAGE_SIZE >= total;
  const isLoading = listStatus === 'loading';

  const isDebouncing = input.trim().toLowerCase() !== keyword;

  function handlePrevious() {
    if (!isFirstPage) {
      setPage((prev) => prev - 1);
    }
  }

  function handleNext() {
    if (!isLastPage) {
      setPage((prev) => prev + 1);
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      <main className="mx-auto max-w-6xl px-4 py-12">
        <header className="mb-10 text-center">
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
            포켓몬 도감
          </h1>
        </header>

        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="mx-auto max-w-xl">
            <label
              htmlFor="pokemon-search"
              className="mb-3 block text-sm font-semibold text-slate-700"
            >
              포켓몬 검색
            </label>

            <div className="relative">
              <input
                id="pokemon-search"
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                autoComplete="off"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-5 py-4 pr-12 text-sm outline-none transition-colors placeholder:text-slate-400 focus:border-red-400 focus:bg-white focus:ring-2 focus:ring-red-100"
              />

              {input && (
                <button
                  type="button"
                  onClick={() => setInput('')}
                  aria-label="검색어 지우기"
                  className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer text-xl text-slate-400 hover:text-slate-700"
                >
                  ×
                </button>
              )}
            </div>
          </div>

          <div className="mt-8 flex min-h-52 items-center justify-center">
            {!input.trim() ? (
              <div className="text-center">
                <p className="text-sm text-slate-400">
                  검색어를 입력하면 결과가 표시됩니다.
                </p>
              </div>
            ) : isDebouncing || searchStatus === 'loading' ? (
              <div className="flex flex-col items-center gap-3">
                <div className="h-9 w-9 animate-spin rounded-full border-4 border-red-100 border-t-red-500" />

                <p className="text-sm text-slate-500">
                  포켓몬을 찾는 중...
                </p>
              </div>
            ) : searchStatus === 'error' ? (
              <div className="text-center">
                <p className="font-semibold text-slate-700">
                  {searchError?.status === 404
                    ? '포켓몬을 찾을 수 없어요.'
                    : '포켓몬 정보를 불러오지 못했어요.'}
                </p>

                <p className="mt-2 text-sm text-slate-400">
                  {searchError?.status === 404
                    ? '이름이나 번호를 다시 확인해주세요.'
                    : '잠시 후 다시 검색해주세요.'}
                </p>
              </div>
            ) : searchStatus === 'success' && pokemon ? (
              <PokemonCard pokemon={pokemon} featured />
            ) : null}
          </div>
        </section>

        <section className="mt-12">
          {isLoading ? (
            <div className="flex min-h-64 flex-col items-center justify-center gap-4">
              <div className="h-10 w-10 animate-spin rounded-full border-4 border-red-100 border-t-red-500" />

              <p className="text-sm text-slate-500">
                포켓몬 목록을 불러오는 중...
              </p>
            </div>
          ) : listStatus === 'error' ? (
            <div className="rounded-2xl border border-red-100 bg-red-50 p-10 text-center text-sm text-red-600">
              목록을 불러오지 못했습니다.
            </div>
          ) : list.length === 0 ? (
            <div className="rounded-2xl bg-white p-10 text-center text-slate-500">
              표시할 포켓몬이 없습니다.
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
              {list.map((item) => (
                <PokemonCard key={item.id} pokemon={item} />
              ))}
            </div>
          )}

          <div className="mt-10 flex items-center justify-center gap-4">
            <button
              type="button"
              onClick={handlePrevious}
              disabled={isFirstPage || isLoading}
              className="cursor-pointer rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 shadow-sm transition-colors hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
            >
              ← 이전
            </button>

            <div className="flex min-w-24 flex-col items-center">
              <span className="text-sm font-bold text-slate-800">
                {page + 1} / {totalPages || 1}
              </span>

              <span className="mt-1 text-xs text-slate-400">
                페이지
              </span>
            </div>

            <button
              type="button"
              onClick={handleNext}
              disabled={isLastPage || isLoading}
              className="cursor-pointer rounded-xl bg-gray-400 px-5 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-gray-700 disabled:cursor-not-allowed disabled:opacity-40"
            >
              다음 →
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}
