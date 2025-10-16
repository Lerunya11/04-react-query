import { useEffect, MouseEvent } from 'react';
import { createPortal } from 'react-dom';
import type { Movie } from '../../types/movie';
import css from './MovieModal.module.css';

interface MovieModalProps {
  movie: Movie;
  onClose: () => void;
}

const modalRoot = document.getElementById('modal-root') as HTMLElement;

export default function MovieModal({ movie, onClose }: MovieModalProps) {
  // Закрытие по Esc + блокировка/восстановление скролла body
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';              

    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;        
    };
  }, [onClose]);

  // Закрытие по клику на бэкдроп
  function onBackdropClick(e: MouseEvent<HTMLDivElement>) {
    if (e.target === e.currentTarget) onClose();
  }

  const imgPath = movie.backdrop_path ?? movie.poster_path;
  const imgUrl = imgPath ? `https://image.tmdb.org/t/p/w780${imgPath}` : undefined;

  const rating10 = Math.round((movie.vote_average ?? 0) * 10) / 10;

  return createPortal(
    <div className={css.backdrop} onClick={onBackdropClick} role="dialog" aria-modal="true">
      <div className={css.modal}>
        <button
          type="button"
          className={css.close}
          aria-label="Close modal"
          onClick={onClose}
        >
          ×
        </button>

        <div className={css.content}>
          {imgUrl && <img className={css.image} src={imgUrl} alt={movie.title} />}

          <h2 className={css.title}>{movie.title}</h2>
          <p className={css.overview}>{movie.overview || '—'}</p>

          <p className={css.meta}>
            <strong>Release Date:</strong> {movie.release_date || '—'}
          </p>
          <p className={css.meta}>
            <strong>Rating:</strong> {rating10 || 0}/10
          </p>
        </div>
      </div>
    </div>,
    modalRoot
  );
}
