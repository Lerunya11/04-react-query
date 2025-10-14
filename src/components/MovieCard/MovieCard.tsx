import type { Movie } from '../../types/movie';
import css from './MovieCard.module.css';

const IMG = 'https://image.tmdb.org/t/p/w500';

interface MovieCardProps {
  movie: Movie;
  onClick?: () => void;
}

export default function MovieCard({ movie, onClick }: MovieCardProps) {
  const { title, poster_path } = movie;

  return (
    <article className={css.card} onClick={onClick}>
      <div className={css.imageWrap}>
        {poster_path ? (
          <img
            className={css.poster}
            src={`${IMG}${poster_path}`}
            alt={title}
            loading="lazy"
          />
        ) : (
          <div className={css.poster} />
        )}
        <div className={css.titleBar}>{title}</div>
      </div>
    </article>
  );
}
