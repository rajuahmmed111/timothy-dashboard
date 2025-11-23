import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQuery } from '../baseQuery';

export const notificationManageApi = createApi({
  reducerPath: 'notificationManageApi',
  baseQuery,
  tagTypes: ['Notifications'],
  endpoints: (builder) => ({
    getAllNotifications: builder.query({
      query: ({ page = 1, limit = 10 } = {}) => `/notifications/all-notifications?page=${page}&limit=${limit}`,
      providesTags: (result) => [{ type: 'Notifications', id: 'LIST' }],
      serializeQueryArgs: ({ queryArgs }) => {
        // cache per list irrespective of page to allow merge pagination
        return 'NotificationsList';
      },
      merge: (currentCache, newItems, { arg }) => {
        // API returns: { data: { meta: {...}, data: [] } }
        const incoming = Array.isArray(newItems?.data?.data) ? newItems.data.data : [];
        const lastPageCount = incoming.length;
        if (arg?.page === 1 || !currentCache) {
          return {
            ...newItems,
            data: {
              ...newItems.data,
              data: incoming,
            },
            lastPageCount,
          };
        }
        const existing = Array.isArray(currentCache?.data?.data)
          ? currentCache.data.data
          : [];
        return {
          ...newItems,
          data: {
            ...newItems.data,
            data: [...existing, ...incoming],
          },
          lastPageCount,
        };
      },
      forceRefetch({ currentArg, previousArg }) {
        return currentArg?.page !== previousArg?.page;
      },
    }),
    markNotificationAsRead: builder.mutation({
      query: (notificationId) => ({
        url: `/notifications/mark-as-read/${notificationId}`,
        method: 'PATCH',
      }),
      invalidatesTags: [{ type: 'Notifications', id: 'LIST' }],
    }),
  }),
});

export const {
  useGetAllNotificationsQuery,
  useMarkNotificationAsReadMutation,
} = notificationManageApi;
