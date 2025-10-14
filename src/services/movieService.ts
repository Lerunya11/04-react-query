import { tmdb } from '../api/tmdb';
import type { SearchResponse } from '../types/movie';

export async function fetchMovies(query: string, page = 1): Promise<SearchResponse> {
  const res = await tmdb.get<SearchResponse>('/search/movie', {
    params: { query, page },
  });
  return res.data;
}
