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
      placeholderData: (prev) => prev,
    });

  const movies = data?.results ?? [];
  const totalPages = Math.min(data?.total_pages ?? 0, 500);

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
      

      <div className={css.headerBar}>
  <span className={css.brand}>Powered by TMDB</span>
  <SearchBar onSubmit={handleSearch} initialValue={query} />
</div>

      {totalPages > 1 && (
        <PaginationControl totalPages={totalPages} page={page} setPage={setPage} />
      )}

      {!enabled && <div className={css.stateBox}>Type a movie title to start searching.</div>}
      {enabled && (isPending || (isFetching && !data)) && <Loader />}
      {isError && !isPending && !isFetching && (
        <ErrorMessage>{error?.message || 'Something went wrong. Please try again later.'}</ErrorMessage>
      )}
      {!isPending && !isError && enabled && movies.length === 0 && (
        <div className={css.stateBox}>No results found. Try a different query.</div>
      )}

      {!isPending && !isError && movies.length > 0 && (
        <MovieGrid movies={movies} onSelect={setSelected} />
      )}

      {selected && <MovieModal movie={selected} onClose={() => setSelected(null)} />}
      <Toaster position="top-right" />
    </div>
  );
}
