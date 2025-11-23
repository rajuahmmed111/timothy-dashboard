import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQuery } from '../baseQuery';

export const channelsApi = createApi({
  reducerPath: 'channelsApi',
  baseQuery,
  tagTypes: ['Channels'],
  endpoints: (builder) => ({
    getChannelsByUserId: builder.query({
      query: (userId) => `/messages/my-channel-by-my-id/${userId}`,
      providesTags: (result, error, userId) => [{ type: 'Channels', id: userId }],
    }),
  }),
});

export const { 
  useGetChannelsByUserIdQuery 
} = channelsApi;