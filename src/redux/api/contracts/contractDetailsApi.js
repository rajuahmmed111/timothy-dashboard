import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "../baseQuery";

export const contractDetailsApi = createApi({
  reducerPath: "contractDetailsApi",
  baseQuery,
  tagTypes: ["ContractDetails"],
  endpoints: (builder) => ({
    getContractDetails: builder.query({
      query: ({ type, contractId }) => ({
        url: `/contracts/${type}/${contractId}`,
        method: "GET",
      }),
      providesTags: (result, error, { contractId }) => [
        { type: "ContractDetails", id: contractId },
      ],
    }),
  }),
});

export const { useGetContractDetailsQuery } = contractDetailsApi;
