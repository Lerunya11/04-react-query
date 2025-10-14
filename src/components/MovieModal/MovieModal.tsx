import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import type { Movie } from '../../types/movie';
import css from './MovieModal.module.css';

interface MovieModalProps {
  movie: Movie;
  onClose: () => void;
}

// Локальный хелпер: строит ссылку на картинку TMDB или даёт плейсхолдер
const IMG_BASE = 'https://image.tmdb.org/t/p/';
function buildImageUrl(path: string | null, size: 'w780' | 'original' = 'w780') {
  return path ? `${IMG_BASE}${size}${path}` : 'https://via.placeholder.com/780x439?text=No+Image';
}

export default function MovieModal({ movie, onClose }: MovieModalProps) {
  // Закрытие по Esc
  useEffect(() => {
    const onEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onEsc);
    return () => document.removeEventListener('keydown', onEsc);
  }, [onClose]);

  // Клик по подложке закрывает модалку
  const handleBackdrop = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) onClose();
  };

  // Содержимое модалки
  const modal = (
    <div className={css.backdrop} role="dialog" aria-modal="true" onClick={handleBackdrop}>
      <div className={css.modal} onClick={(e) => e.stopPropagation()}>
        <button className={css.closeButton} aria-label="Close modal" onClick={onClose} type="button">
          &times;
        </button>

        <img
          className={css.image}
          src={buildImageUrl(movie.backdrop_path, 'original')}
          alt={movie.title}
        />

        <div className={css.content}>
          <h2>{movie.title}</h2>
          {movie.overview && <p>{movie.overview}</p>}
          <p>
            <strong>Release Date:</strong> {movie.release_date || '—'}
          </p>
          <p>
            <strong>Rating:</strong> {movie.vote_average}/10
          </p>
        </div>
      </div>
    </div>
  );

  // Порталим в body — не нужен отдельный #modal-root
  return createPortal(modal, document.body);
}
