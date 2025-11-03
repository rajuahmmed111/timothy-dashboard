// src/redux/api/statistics/cancelRefundApi.js
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const baseURL = import.meta.env.VITE_BASE_URL;

export const cancelRefundApi = createApi({
  reducerPath: 'cancelRefundApi',
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
  tagTypes: ['CancelRefund'],
  endpoints: (builder) => ({
    getCancelRefundStats: builder.query({
      query: (yearRange = '2025') => `/statistics/cancel-refund-contracts?yearRange=${yearRange}`,
      providesTags: ['CancelRefund'],
    }),
  }),
});

export const { useGetCancelRefundStatsQuery } = cancelRefundApi;
