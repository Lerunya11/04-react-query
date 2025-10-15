// src/services/movieService.ts
import axios, { type AxiosResponse } from 'axios';
import type { Movie } from '../types/movie';


const ACCESS_TOKEN = import.meta.env.VITE_TMDB_API_KEY;
if (!ACCESS_TOKEN) {
  throw new Error('Missing VITE_TMDB_API_KEY');
}
// ---- Тип для відповіді API ----
export interface SearchResponse {
  page: number;
  results: Movie[];
  total_pages: number;
  total_results: number;
}

// ---- Запит з дженериком ----
export async function fetchMovies(
  query: string,
  page = 1
): Promise<SearchResponse> {
  const res: AxiosResponse<SearchResponse> = await axios.get(
    'https://api.themoviedb.org/3/search/movie',
    {
      params: {
        query,
        page,
        language: 'en-US',
        include_adult: false,
      },
      headers: {
        Authorization: `Bearer ${ACCESS_TOKEN}`,
        Accept: 'application/json',
      },
    }
  );

  return res.data;
}

// опціонально: хелпер для картинок
export function buildImageUrl(
  path?: string,
  size: 'w300' | 'w500' | 'w780' | 'original' = 'w500'
): string {
  if (!path) return '';
  const clean = path.startsWith('/') ? path : `/${path}`;
  return `https://image.tmdb.org/t/p/${size}${clean}`;
}
