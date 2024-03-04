import { baseApi } from "../../api/baseApi";

const saleApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    addSale: builder.mutation({
      query: (saleInfo) => ({
        url: `/sales/create-sale/${saleInfo.id}`,
        method: "POST",
        body: saleInfo.data,
      }),
      invalidatesTags: ["gifts", "sales"],
    }),
    saleHistory: builder.query({
      query: (saleParams) => {
        const params = new URLSearchParams();
        if (saleParams.timeRange) {
          params.append("timeRange", saleParams.timeRange);
        }
        return {
          url: `/sales`,
          method: "GET",
          params: params,
        };
      },
      providesTags: ["sales"],
    }),
  }),
});

export const { useAddSaleMutation, useSaleHistoryQuery } = saleApi;
