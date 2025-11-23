// src/redux/api/statistics/userSupportTicketsApi.js
import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQuery } from '../baseQuery';

export const userSupportTicketsApi = createApi({
  reducerPath: 'userSupportTicketsApi',
  baseQuery,
  tagTypes: ['UserSupportTickets'],
  endpoints: (builder) => ({
    getUserSupportTickets: builder.query({
      query: (timeRange = 'THIS_MONTH') => `/statistics/user-support-tickets?timeRange=${timeRange}`,
      providesTags: ['UserSupportTickets'],
    }),
  }),
});

export const { useGetUserSupportTicketsQuery } = userSupportTicketsApi;
