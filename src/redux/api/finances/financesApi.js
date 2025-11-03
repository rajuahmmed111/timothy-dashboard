// src/redux/api/finances/financesApi.js
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const baseURL = import.meta.env.VITE_BASE_URL;

export const financesApi = createApi({
  reducerPath: 'financesApi',
  baseQuery: fetchBaseQuery({
    baseUrl: baseURL,
    prepareHeaders: (headers) => {
      const token = localStorage.getItem("accessToken");
      if (token) {
        headers.set('Authorization', `${token}`);
      }
      headers.set('Content-Type', 'application/json');
      return headers;
    },
  }),
  tagTypes: ['Finances'],
  endpoints: (builder) => ({
    getFinances: builder.query({
      query: ({ searchTerm = '', timeRange = '', limit = 10, page = 1 } = {}) => {
        const params = new URLSearchParams();
        if (searchTerm) params.append('searchTerm', searchTerm);
        if (timeRange) params.append('timeRange', timeRange);
        if (limit) params.append('limit', limit.toString());
        if (page) params.append('page', page.toString());
        
        return `/finances?${params.toString()}`;
      },
      providesTags: ['Finances'],
    }),
    getFinanceDetails: builder.query({
      query: (id) => `/finances/${id}`,
      providesTags: (result, error, id) => [{ type: 'Finances', id }],
    }),
  }),
});

export const { useGetFinancesQuery, useGetFinanceDetailsQuery } = financesApi;
