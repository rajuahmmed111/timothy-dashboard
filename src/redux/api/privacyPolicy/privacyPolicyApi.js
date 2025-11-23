// src/redux/api/privacyPolicy/privacyPolicyApi.js
import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQuery } from '../baseQuery';

export const privacyPolicyApi = createApi({
  reducerPath: 'privacyPolicyApi',
  baseQuery,
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
