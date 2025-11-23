import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQuery } from '../baseQuery';

export const adminChannelsApi = createApi({
  reducerPath: 'adminChannelsApi',
  baseQuery,
  tagTypes: ['AdminChannels'],
  endpoints: (builder) => ({
    getAllChannelsForAdmin: builder.query({
      query: ({ searchTerm } = {}) => ({
        url: '/messages/channels',
        params: {
          ...(searchTerm ? { searchTerm } : {}),
        },
      }),
      providesTags: ['AdminChannels'],
    }),
  }),
});

export const { 
  useGetAllChannelsForAdminQuery 
} = adminChannelsApi;