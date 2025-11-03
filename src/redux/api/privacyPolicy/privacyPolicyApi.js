// src/redux/api/privacyPolicy/privacyPolicyApi.js
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const baseURL = import.meta.env.VITE_BASE_URL;

export const privacyPolicyApi = createApi({
  reducerPath: 'privacyPolicyApi',
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
  tagTypes: ['PrivacyPolicy'],
  endpoints: (builder) => ({
    getPrivacyPolicy: builder.query({
      query: () => '/policy',
      providesTags: ['PrivacyPolicy'],
    }),
    updatePrivacyPolicy: builder.mutation({
      query: ({ id, data }) => ({
        url: `/policy/update/${id}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: ['PrivacyPolicy'],
    }),
  }),
});

export const { useGetPrivacyPolicyQuery, useUpdatePrivacyPolicyMutation } = privacyPolicyApi;
