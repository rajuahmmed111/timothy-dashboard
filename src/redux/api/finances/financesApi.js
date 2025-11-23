// src/redux/api/finances/financesApi.js
import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQuery } from '../baseQuery';

export const financesApi = createApi({
  reducerPath: 'financesApi',
  baseQuery,
  tagTypes: ['Finances'],
  endpoints: (builder) => ({
    getFinances: builder.query({
      query: ({ searchTerm = '', timeRange = '', country = '', limit = 10, page = 1 } = {}) => {
        const params = new URLSearchParams();
        if (searchTerm) params.append('searchTerm', searchTerm);
        if (timeRange) params.append('timeRange', timeRange);
        if (country) params.append('country', country);
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
