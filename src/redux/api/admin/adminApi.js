import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQuery } from '../../api/baseQuery';

export const adminApi = createApi({
  reducerPath: 'adminApi',
  baseQuery,
  tagTypes: ['Admins'],
  endpoints: (builder) => ({
    updateSuperAdminAccess: builder.mutation({
      query: ({ id, data }) => ({
        url: `/users/update-super-admin-access/${id}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: ['Admins'],
    }),
  }),
});

export const { useUpdateSuperAdminAccessMutation } = adminApi;
