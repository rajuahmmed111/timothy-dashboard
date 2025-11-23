import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQuery } from '../baseQuery';

export const messagesApi = createApi({
  reducerPath: 'messagesApi',
  baseQuery,
  tagTypes: ['Messages'],
  endpoints: (builder) => ({
    getMessagesByChannelName: builder.query({
      query: ({ channelName, page = 1, limit = 20 }) => 
        `/messages/get-message/${channelName}?page=${page}&limit=${limit}`,
      providesTags: (result, error, { channelName }) => [{ type: 'Messages', id: channelName }],
      serializeQueryArgs: ({ queryArgs }) => {
        const { channelName } = queryArgs;
        return { channelName };
      },
      merge: (currentCache, newItems, { arg }) => {
        if (arg.page === 1) {
          return newItems;
        }
        return {
          ...newItems,
          data: [...(currentCache?.data || []), ...(newItems?.data || [])]
        };
      },
      forceRefetch({ currentArg, previousArg }) {
        return currentArg?.page !== previousArg?.page;
      },
    }),
    sendMessageWithImage: builder.mutation({
      query: ({ userId, formData }) => ({
        url: `/messages/send-message/${userId}`,
        method: 'POST',
        body: formData,
      }),
      invalidatesTags: ['Messages'],
    }),
    // here the send message is also working like the sendmessage to user so make the sendmessageWithImage as like the sendmessage to user 
    sendMessageToUser: builder.mutation({
      query: ({ userId, formData }) => ({
        url: `/messages/send-message/${userId}`,
        method: 'POST',
        body: formData,
      }),
      invalidatesTags: ['Messages'],
    }),
  }),
});

export const { 
  useGetMessagesByChannelNameQuery,
  useSendMessageWithImageMutation,
  useSendMessageToUserMutation
} = messagesApi;