// src/api/tmdb.ts
import axios from 'axios';


export const tmdb = axios.create({
  baseURL: 'https://api.themoviedb.org/3',
  params: {
    api_key: import.meta.env.VITE_TMDB_API_KEY as string,
    language: 'en-US',
    include_adult: false,
  },
});
