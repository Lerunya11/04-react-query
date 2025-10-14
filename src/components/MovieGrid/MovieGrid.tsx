
import type { Movie } from '../../types/movie';
import MovieCard from '../MovieCard/MovieCard';   
import css from './MovieGrid.module.css';


export interface MovieGridProps {
  movies: Movie[];
  onSelect: (m: Movie) => void;
}

export default function MovieGrid({ movies, onSelect }: MovieGridProps) {
  return (
    <section className={css.grid}>
      {movies.map((m) => (
        <MovieCard key={m.id} movie={m} onClick={() => onSelect(m)} />
      ))}
    </section>
  );
}
