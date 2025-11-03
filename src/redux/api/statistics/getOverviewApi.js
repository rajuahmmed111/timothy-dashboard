// src/redux/api/statistics/getOverviewApi.js
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const baseURL = import.meta.env.VITE_BASE_URL;

export const statisticsApi = createApi({
  reducerPath: 'statisticsApi',
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
  tagTypes: ['Statistics'],
  endpoints: (builder) => ({
    getOverview: builder.query({
      query: () => '/statistics/overview',
      providesTags: ['Statistics'],
    }),
    getFinancialMetrics: builder.query({
      query: () => '/statistics/financial-metrics',
      providesTags: ['Statistics'],
    }),
  }),
});

export const { useGetOverviewQuery, useGetFinancialMetricsQuery } = statisticsApi;