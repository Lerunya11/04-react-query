import axios from 'axios';
import type { Movie } from '../types/movie';

const TMDB_TOKEN = import.meta.env.VITE_TMDB_TOKEN as string | undefined;

const api = axios.create({
  baseURL: 'https://api.themoviedb.org/3',
  headers: {
    Authorization: `Bearer ${TMDB_TOKEN ?? ''}`,
    'Content-Type': 'application/json;charset=utf-8',
  },
  timeout: 15000,
});

type SearchMoviesResponse = {
  page: number;
  results: Movie[];
  total_pages: number;
  total_results: number;
};

export async function fetchMovies(query: string): Promise<Movie[]> {
  const q = query.trim();
  if (!q) return [];

  const { data } = await api.get<SearchMoviesResponse>('/search/movie', {
    params: { query: q, include_adult: false, language: 'en-US', page: 1 },
  });

  return data.results;
}

const IMG = 'https://image.tmdb.org/t/p';
export const buildPoster = (path: string | null | undefined, size: 'w500' | 'original' = 'w500') =>
  path ? `${IMG}/${size}${path}` : '/assets/no-poster.png';
export const buildBackdrop = (path: string | null | undefined, size: 'original' | 'w780' = 'original') =>
  path ? `${IMG}/${size}${path}` : '/assets/no-backdrop.png';
