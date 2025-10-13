// src/components/SearchBar/SearchBar.tsx
import { toast } from 'react-hot-toast';
import css from './SearchBar.module.css';

export interface SearchBarProps {
  onSubmit: (query: string) => void;
}

export default function SearchBar({ onSubmit }: SearchBarProps) {
  // ✅ Form Actions вместо onSubmit
  const action = async (formData: FormData) => {
    const raw = String(formData.get('query') ?? '').trim();

    if (!raw) {
      toast('Please enter your search query.');
      return;
    }
    onSubmit(raw);
  };

  return (
    <header className={css.header}>
      <div className={css.container}>
        <a
          className={css.link}
          href="https://www.themoviedb.org/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by TMDB
        </a>

        <form className={css.form} action={action}>
          <input
            className={css.input}
            type="text"
            name="query"
            autoComplete="off"
            placeholder="Search movies..."
            autoFocus
          />
          <button className={css.button} type="submit">
            Search
          </button>
        </form>
      </div>
    </header>
  );
}
