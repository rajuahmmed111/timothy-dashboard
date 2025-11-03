// src/redux/api/termsConditions/termsConditionsApi.js
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const baseURL = import.meta.env.VITE_BASE_URL;

export const termsConditionsApi = createApi({
  reducerPath: 'termsConditionsApi',
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
  tagTypes: ['TermsConditions'],
  endpoints: (builder) => ({
    getTermsConditions: builder.query({
      query: () => '/terms-conditions',
      providesTags: ['TermsConditions'],
    }),
    updateTermsConditions: builder.mutation({
      query: ({ id, data }) => ({
        url: `/terms-conditions/update/${id}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: ['TermsConditions'],
    }),
  }),
});

export const { useGetTermsConditionsQuery, useUpdateTermsConditionsMutation } = termsConditionsApi;
