import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "../baseQuery";

export const supportApi = createApi({
  reducerPath: "supportApi",
  baseQuery,
  tagTypes: ["Support"],
  endpoints: (builder) => ({
    getSupports: builder.query({
      query: ({ page = 1, limit = 10, supportType = "" }) => ({
        url: `/supports`,
        method: "GET",
        params: {
          page,
          limit,
          supportType,
        },
      }),
      providesTags: ["Support"],
    }),
    updateSupportStatus: builder.mutation({
      query: ({ supportId, status }) => ({
        url: `/supports/update-support-status/${supportId}`,
        method: "PATCH",
        body: { status },
      }),
      invalidatesTags: ["Support"],
    }),
  }),
});

export const { useGetSupportsQuery, useUpdateSupportStatusMutation } = supportApi;
