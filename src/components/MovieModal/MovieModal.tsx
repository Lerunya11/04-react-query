import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import type React from 'react'; // для типов событий React.MouseEvent
import type { Movie } from '../../types/movie';
import { buildBackdrop } from '../../services/movieService';
import css from './MovieModal.module.css';

export interface MovieModalProps {
  movie: Movie | null;
  onClose: () => void;
}

const MODAL_ROOT_ID = 'modal-root';

export default function MovieModal({ movie, onClose }: MovieModalProps) {
  if (!movie) return null;

  // гарантируем контейнер для портала
  let root = document.getElementById(MODAL_ROOT_ID);
  if (!root) {
    root = document.createElement('div');
    root.id = MODAL_ROOT_ID;
    document.body.appendChild(root);
  }

  // блокируем скролл и слушаем ESC
  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const onEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onEsc);

    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', onEsc);
    };
  }, [onClose]);

  const handleBackdrop = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.currentTarget === e.target) onClose();
  };

  return createPortal(
    <div className={css.backdrop} role="dialog" aria-modal="true" onClick={handleBackdrop}>
      <div className={css.modal}>
        <button
          className={css.closeButton}
          aria-label="Close modal"
          onClick={onClose}
          type="button"
        >
          &times;
        </button>

        <img
          className={css.image}
          src={buildBackdrop(movie.backdrop_path, 'original')}
          alt={movie.title}
        />

        <div className={css.content}>
          <h2>{movie.title}</h2>
          <p>{movie.overview}</p>
          <p>
            <strong>Release Date:</strong> {movie.release_date}
          </p>
          <p>
            <strong>Rating:</strong> {movie.vote_average}/10
          </p>
        </div>
      </div>
    </div>,
    root
  );
}
