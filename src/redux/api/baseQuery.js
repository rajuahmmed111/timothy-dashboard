import { fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const baseURL = import.meta.env.VITE_BASE_URL;

export const baseQuery = fetchBaseQuery({
  baseUrl: baseURL,
  // If you rely on cookies/sessions, set credentials to 'include'. If using only Authorization header, you can omit this.
  // credentials: 'include',
  prepareHeaders: (headers) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      headers.set('Authorization', `${token}`);
    }
    // Do NOT force Content-Type. Let the browser set it.
    // For JSON requests, fetchBaseQuery will set it automatically.
    // For FormData/multipart requests, the browser will set proper boundaries.
    return headers;
  },
}); 
