// src/redux/api/statistics/getOverviewApi.js
import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQuery } from '../baseQuery';

export const statisticsApi = createApi({
  reducerPath: 'statisticsApi',
  baseQuery,
  tagTypes: ['Statistics'],
  endpoints: (builder) => ({
    getOverview: builder.query({
      query: (timeRange = 'THIS_MONTH') => `/statistics/overview?timeRange=${timeRange}`,
      providesTags: ['Statistics'],
    }),
    getFinancialMetrics: builder.query({
      query: (timeRange = 'THIS_YEAR') => `/statistics/financial-metrics?timeRange=${timeRange}`,
      providesTags: ['Statistics'],
    }),
  }),
});

export const { useGetOverviewQuery, useGetFinancialMetricsQuery } = statisticsApi;