import { useMemo, useRef, useState } from 'react';
import SearchBar from './components/SearchBar/SearchBar';
import MovieGrid from './components/MovieGrid/MovieGrid';
import Loader from './components/Loader/Loader';
import ErrorMessage from './components/ErrorMessage/ErrorMessage';
import MovieModal from './components/MovieModal/MovieModal';
import type { Movie } from './types/movie';
import { fetchMovies } from './services/movieService';
import { Toaster } from 'react-hot-toast';
import toast from 'react-hot-toast';
import css from './App.module.css';


export default function App() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [selected, setSelected] = useState<Movie | null>(null);

  // чтобы не дёргать один и тот же запрос много раз подряд
  const lastQueryRef = useRef<string>('');

  async function handleSearch(query: string) {
    const q = query.trim();
    if (!q) {
      toast('Please enter your search query.');
      return;
    }
    if (q === lastQueryRef.current) return;
    lastQueryRef.current = q;

    setHasError(false);
    setMovies([]);
    setLoading(true);

    try {
      const list = await fetchMovies(q);

      if (!list.length) {
        toast('No movies found for your request.');
      }

      setMovies(list);
    } catch {
      setHasError(true);
    } finally {
      setLoading(false);
    }
  }

  const content = useMemo(() => {
    if (loading) return <Loader />;
    if (hasError) return <ErrorMessage />;
    if (movies.length) return <MovieGrid movies={movies} onSelect={setSelected} />;
    return null;
  }, [loading, hasError, movies]);

  return (
    <div className={css.app}>
      <SearchBar onSubmit={handleSearch} />
      {content}
      <MovieModal movie={selected} onClose={() => setSelected(null)} />
      <Toaster position="top-right" />
    </div>
  );
}
