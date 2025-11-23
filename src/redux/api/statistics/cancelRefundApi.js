// src/redux/api/statistics/cancelRefundApi.js
import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQuery } from '../baseQuery';

export const cancelRefundApi = createApi({
  reducerPath: 'cancelRefundApi',
  baseQuery,
  tagTypes: ['CancelRefund'],
  endpoints: (builder) => ({
    getCancelRefundStats: builder.query({
      query: (timeRange = 'THIS_MONTH') => `/statistics/cancel-refund-contracts?timeRange=${timeRange}`,
      providesTags: ['CancelRefund'],
    }),
  }),
});

export const { useGetCancelRefundStatsQuery } = cancelRefundApi;
