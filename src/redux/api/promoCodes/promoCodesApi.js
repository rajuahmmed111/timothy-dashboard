// src/redux/api/promoCodes/promoCodesApi.js
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const baseURL = import.meta.env.VITE_BASE_URL;

export const promoCodesApi = createApi({
  reducerPath: 'promoCodesApi',
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
  tagTypes: ['PromoCodes'],
  endpoints: (builder) => ({
    getPromoCodes: builder.query({
      query: () => '/promo-codes',
      providesTags: ['PromoCodes'],
    }),
    createPromoCode: builder.mutation({
      query: (promoCodeData) => ({
        url: '/promo-codes',
        method: 'POST',
        body: promoCodeData,
      }),
      invalidatesTags: ['PromoCodes'],
    }),
    deletePromoCode: builder.mutation({
      query: (id) => ({
        url: `/promo-codes/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['PromoCodes'],
    }),
  }),
});

export const { useGetPromoCodesQuery, useCreatePromoCodeMutation, useDeletePromoCodeMutation } = promoCodesApi;
