import { useEffect, useState } from 'react';
import css from './SearchBar.module.css';

export interface SearchBarProps {
  onSubmit: (value: string) => void;
  initialValue?: string;
}

export default function SearchBar({ onSubmit, initialValue = '' }: SearchBarProps) {
  const [value, setValue] = useState(initialValue);

  useEffect(() => setValue(initialValue), [initialValue]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit(value);
  };

  return (
    <form className={css.form} onSubmit={handleSubmit} role="search" aria-label="Movie search">
      <input
        className={css.input}
        type="search"
        placeholder="Search movies..."
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
      <button className={css.button} type="submit">
        Search
      </button>
    </form>
  );
}
