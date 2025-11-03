// src/redux/api/userApi.js
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const baseURL = import.meta.env.VITE_BASE_URL;

export const userApi = createApi({
  reducerPath: 'userApi',
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
      query: ({ page = 1, limit = 10, search = '', country = '', time = '' } = {}) => {
        const params = new URLSearchParams({
          page: page.toString(),
          limit: limit.toString(),
          ...(search && { search }),
          ...(country && { country }),
          ...(time && { time }),
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
      query: ({ time = '', country = '', search = '' } = {}) => {
        const params = new URLSearchParams({
          ...(time && { time }),
          ...(country && { country }),
          ...(search && { search }),
        });
        return `/statistics/service-providers${params.toString() ? `?${params}` : ''}`;
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
      query: ({ searchTerm = '', limit = 10, page = 1, timeRange = '' } = {}) => {
        const params = new URLSearchParams({
          ...(searchTerm && { searchTerm }),
          limit: limit.toString(),
          page: page.toString(),
          ...(timeRange && { timeRange }),
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
