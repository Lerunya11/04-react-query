// src/components/App/App.tsx
import { useRef, useState } from 'react';

import SearchBar from '../SearchBar/SearchBar';
import MovieGrid from '../MovieGrid/MovieGrid';
import Loader from '../Loader/Loader';
import ErrorMessage from '../ErrorMessage/ErrorMessage';
import MovieModal from '../MovieModal/MovieModal';

import type { Movie } from '../../types/movie';
import { fetchMovies } from '../../services/movieService';

import { Toaster, toast } from 'react-hot-toast';
import 'modern-normalize/modern-normalize.css';
import css from './App.module.css';


export default function App() {
  // --- state ---
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [selected, setSelected] = useState<Movie | null>(null);

 
  const lastQueryRef = useRef<string>('');

  // --- handlers ---
  async function handleSearch(rawQuery: string) {
    const q = rawQuery.trim();

    if (!q) {
      toast('Please enter your search query.');
      return;
    }

    if (q === lastQueryRef.current) return;
    lastQueryRef.current = q;

    setHasError(false);
    setLoading(true);
    setMovies([]); 

    try {
      const result = await fetchMovies(q);

      if (!result.length) {
        toast('No movies found for your request.');
      }
      setMovies(result);
    } catch {
      setHasError(true);
    } finally {
      setLoading(false);
    }
  }

  function handleSelect(movie: Movie) {
    setSelected(movie);
  
    document.body.style.overflow = 'hidden';
  }

  function handleCloseModal() {
    setSelected(null);
    document.body.style.overflow = '';
  }

  // --- render ---
  return (
    <>
      <Toaster position="top-right" />

      <div className={css.app}>
        <SearchBar onSubmit={handleSearch} />

        {loading && <Loader />}

        {hasError && !loading && <ErrorMessage />}

        {!loading && !hasError && movies.length > 0 && (
          <MovieGrid movies={movies} onSelect={handleSelect} />
        )}
      </div>

      
      {selected && <MovieModal movie={selected} onClose={handleCloseModal} />}
    </>
  );
}
