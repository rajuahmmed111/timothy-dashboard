import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const baseURL = import.meta.env.VITE_BASE_URL;

export const paymentUserAnalysisApi = createApi({
  reducerPath: 'paymentUserAnalysisApi',
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
  tagTypes: ['PaymentUserAnalysis'],
  endpoints: (builder) => ({
    getPaymentUserAnalysis: builder.query({
      query: (yearRange = '2025') => `/statistics/payment-user-analysis`,
      providesTags: ['PaymentUserAnalysis'],
    }),
  }),
});

export const { useGetPaymentUserAnalysisQuery } = paymentUserAnalysisApi;