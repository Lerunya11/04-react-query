
import axios from 'axios';
import type { SearchResponse } from '../types/movie';


const API_KEY = import.meta.env.VITE_TMDB_API_KEY;


if (!API_KEY) {
  throw new Error(
    'Missing VITE_TMDB_API_KEY. Set it in Vercel → Project → Settings → Environment Variables → Add → VITE_TMDB_API_KEY'
  );
}

/**
 * Основная функция для поиска фильмов по названию
 * @param 
 * @param 
 */
export async function fetchMovies(query: string, page = 1): Promise<SearchResponse> {
  try {
    const res = await axios.get<SearchResponse>(
      'https://api.themoviedb.org/3/search/movie',
      {
        params: {
          query,
          page,
          api_key: API_KEY, // TMDB v3 ключ
        },
      }
    );
    return res.data;
  } catch (err: any) {
    console.error('TMDB API error:', err);
    throw err;
  }
}

/**
 * Вспомогательная функция для построения URL постера
 * @param path — путь постера, полученный из TMDB
 * @param size — размер (по умолчанию "w500")
 */
export function buildImageUrl(path: string, size = 'w500'): string {
  return `https://image.tmdb.org/t/p/${size}${path}`;
}
