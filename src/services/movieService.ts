import { tmdb } from '../api/tmdb';
import type { SearchResponse } from '../types/movie';

export async function fetchMovies(query: string, page = 1): Promise<SearchResponse> {
  const res = await tmdb.get<SearchResponse>('/search/movie', {
    params: { query, page },
  });
  return res.data;
}


export function buildImageUrl(
  path: string,
  size: 'w300'|'w500'|'w780'|'original' = 'w780'
): string {
  if (!path) return '';
  const clean = path.startsWith('/') ? path : `/${path}`;
  return `https://image.tmdb.org/t/p/${size}${clean}`;
}

