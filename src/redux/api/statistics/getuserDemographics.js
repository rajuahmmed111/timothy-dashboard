// src/redux/api/statistics/getuserDemographics.js
import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQuery } from '../baseQuery';

export const userDemographicsApi = createApi({
  reducerPath: 'userDemographicsApi',
  baseQuery,
  tagTypes: ['UserDemographics'],
  endpoints: (builder) => ({
    getUserDemographics: builder.query({
      // Default to THIS_YEAR and allow overriding with filters
      query: (args = {}) => {
        const {
          timeRange = 'THIS_YEAR',
          country,
          age,
          gender,
          profession,
        } = args || {};
        const params = new URLSearchParams();
        params.set('timeRange', timeRange);
        if (country) params.set('country', country);
        if (age) params.set('age', String(age));
        if (gender) params.set('gender', gender);
        if (profession) params.set('profession', profession);
        return `/statistics/user-demographics?${params.toString()}`;
      },
      providesTags: ['UserDemographics'],
    }),
  }),
});

export const { useGetUserDemographicsQuery } = userDemographicsApi;