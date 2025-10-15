// src/services/movieService.ts
import axios from 'axios';
import type { SearchResponse } from '../types/movie';

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

if (!API_KEY) {
  throw new Error('Missing VITE_TMDB_API_KEY');
}

export async function fetchMovies(query: string, page = 1): Promise<SearchResponse> {
  const res = await axios.get('https://api.themoviedb.org/3/search/movie', {
    params: {
      query,
      page,
      language: 'en-US',
      include_adult: false,
    },
    headers: {
      Authorization: `Bearer ${API_KEY}`, 
      accept: 'application/json',
    },
  });
  return res.data;
}
