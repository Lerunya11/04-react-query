// src/components/App/App.tsx
import { useEffect, useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import type { AxiosError } from 'axios';

import SearchBar from '../SearchBar/SearchBar';
import MovieGrid from '../MovieGrid/MovieGrid';
import Loader from '../Loader/Loader';
import ErrorMessage from '../ErrorMessage/ErrorMessage';
import MovieModal from '../MovieModal/MovieModal';
import PaginationControl from '../PaginationControl/PaginationControl';

import type { Movie, SearchResponse } from '../../types/movie';
import { fetchMovies } from '../../services/movieService';

import { Toaster, toast } from 'react-hot-toast';
import css from './App.module.css';

export default function App() {
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<Movie | null>(null);

  // При смене запроса — на первую страницу
  useEffect(() => {
    setPage(1);
  }, [query]);

  const enabled = useMemo(() => query.trim().length > 0, [query]);

  const { data, isPending, isFetching, isError, error } =
    useQuery<SearchResponse, AxiosError>({
      queryKey: ['movies', query, page],
      enabled,
      queryFn: () => fetchMovies(query, page),
      staleTime: 60_000,
      retry: 1,
      // Показывать прошлую страницу, пока грузится новая
      placeholderData: (prev) => prev,
    });

  const movies = data?.results ?? [];
  const totalPages = Math.min(data?.total_pages ?? 0, 500);
  const noResults =
    enabled && !isPending && !isError && data && data.total_results === 0;

  // Toast при пустом ответе
  useEffect(() => {
    if (noResults) {
      toast.error('No movies found for your request.', { id: 'no-results' });
    }
  }, [noResults]);

  // Toast при сетевой ошибке
  useEffect(() => {
    if (isError && !isPending && !isFetching) {
      toast.error(
        error?.message || 'Something went wrong. Please try again later.',
        { id: 'rq-error' }
      );
    }
  }, [isError, isPending, isFetching, error]);

  function handleSearch(raw: string) {
    const q = raw.trim();
    if (!q) {
      toast('Please enter your search query.');
      return;
    }
    setQuery(q);
  }

  return (
    <div className={css.app}>
      {/* Один Toaster, по центру сверху — как в демо */}
      <Toaster position="top-center" gutter={8} toastOptions={{ style: { fontSize: '14px' } }} />

      {/* Шапка: слева бренд, справа поиск; снизу тонкая линия из CSS */}
      <div className={css.header}>
        <span className={css.brand}>Powered by TMDB</span>
        <div className={css.headerRight}>
          <SearchBar onSubmit={handleSearch} initialValue={query} />
        </div>
      </div>

      {/* Пагинация СВЕРХУ – только если страниц > 1 */}
      {totalPages > 1 && (
        <div className={css.topBar}>
          <PaginationControl
            totalPages={totalPages}
            page={page}
            setPage={(p) => {
              setPage(p);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        </div>
      )}

      {/* Состояния загрузки/ошибок */}
      {enabled && (isPending || (isFetching && !data)) && <Loader />}

      {isError && !isPending && !isFetching && (
        <ErrorMessage>
          {error?.message || 'Something went wrong. Please try again later.'}
        </ErrorMessage>
      )}

      {/* Успех */}
      {!isPending && !isError && movies.length > 0 && (
        <MovieGrid movies={movies} onSelect={setSelected} />
      )}

      {selected && <MovieModal movie={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}
