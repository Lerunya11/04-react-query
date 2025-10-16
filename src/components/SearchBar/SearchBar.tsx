import { toast } from 'react-hot-toast';
import css from './SearchBar.module.css';

interface SearchBarProps {
  onSubmit: (query: string) => void;
  initialValue?: string;
}

/**
 * Важно: форма использует React Form Actions через prop `action`.
 * Значение берём из FormData по имени поля `query`.
 */
export default function SearchBar({ onSubmit, initialValue = '' }: SearchBarProps) {
  async function handleAction(formData: FormData) {
    const value = (formData.get('query') as string | null)?.trim() ?? '';

    if (!value) {
      toast.error('Please enter your search query.');
      return; // onSubmit НЕ вызываем, если пусто
    }

    onSubmit(value);
  }

  return (
    <form className={css.form} action={handleAction}>
      <input
        className={css.input}
        type="text"
        id="search"
        name="query"                
        placeholder="Search movies..."
        defaultValue={initialValue} 
        autoComplete="off"
        aria-label="Search movies"
      />
      <button className={css.button} type="submit">
        Search
      </button>
    </form>
  );
}
