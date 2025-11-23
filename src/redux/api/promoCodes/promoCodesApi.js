// src/redux/api/promoCodes/promoCodesApi.js
import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQuery } from '../baseQuery';

export const promoCodesApi = createApi({
  reducerPath: 'promoCodesApi',
  baseQuery,
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
