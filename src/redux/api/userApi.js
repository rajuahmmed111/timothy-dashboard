// src/redux/api/userApi.js
import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQuery } from './baseQuery';

export const userApi = createApi({
  reducerPath: 'userApi',
  baseQuery,
  tagTypes: ['Partners'],
  endpoints: (builder) => ({
    createUser: builder.mutation({
      query: (data) => ({
        url: '/users',
        method: 'POST',
        body: data,
      }),
    }),
    getApprovedPartners: builder.query({
      query: ({ page = 1, limit = 10, searchTerm = '', country = '', timeRange = '' } = {}) => {
        const params = new URLSearchParams({
          page: page.toString(),
          limit: limit.toString(),
          ...(searchTerm && { searchTerm }),
          ...(country && { country }),
          ...(timeRange && { timeRange }),
        });
        return `/users/approved-partners?${params}`;
      },
      providesTags: ['Partners'],
    }),
    updatePartnerStatusActive: builder.mutation({
      query: (partnerId) => ({
        url: `/users/update-partner-status-active/${partnerId}`,
        method: 'PATCH',
      }),
      invalidatesTags: ['Partners'],
    }),
    updatePartnerStatusReject: builder.mutation({
      query: (partnerId) => ({
        url: `/users/update-partner-status-reject/${partnerId}`,
        method: 'PATCH',
      }),
      invalidatesTags: ['Partners'],
    }),
    getInactivePartner: builder.query({
      query: (partnerId) => `/users/inactive-partner/${partnerId}`,
      providesTags: (result, error, partnerId) => [{ type: 'Partners', id: partnerId }],
    }),
    getServiceProviders: builder.query({
      query: ({ searchTerm = '', country = '', timeRange = '', page = 1, limit = 10 } = {}) => {
        const params = new URLSearchParams({
          ...(searchTerm && { searchTerm }),
          ...(country && { country }),
          ...(timeRange && { timeRange }),
          page: page.toString(),
          limit: limit.toString(),
        });
        return `/statistics/service-providers?${params}`;
      },
      providesTags: ['ServiceProviders'],
    }),
    sendReportServiceProvider: builder.mutation({
      query: (providerId) => ({
        url: `/statistics/send-report-service-provider/${providerId}`,
        method: 'POST',
      }),
    }),
    getContracts: builder.query({
      query: ({ searchTerm = '', limit = 10, page = 1, timeRange = '', country = '' } = {}) => {
        const params = new URLSearchParams({
          ...(searchTerm && { searchTerm }),
          limit: limit.toString(),
          page: page.toString(),
          ...(timeRange && { timeRange }),
          ...(country && { country }),
        });
        return `/contracts?${params}`;
      },
      providesTags: ['Contracts'],
    }),
  }),
});

export const { 
  useCreateUserMutation, 
  useGetApprovedPartnersQuery,
  useUpdatePartnerStatusActiveMutation,
  useUpdatePartnerStatusRejectMutation,
  useGetInactivePartnerQuery,
  useGetServiceProvidersQuery,
  useSendReportServiceProviderMutation,
  useGetContractsQuery
} = userApi;
