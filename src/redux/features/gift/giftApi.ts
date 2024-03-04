import { baseApi } from "../../api/baseApi";

const giftApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    allGift: builder.query({
      query: (paramsData) => {
        const { searchTerm, occasion, brand, theme, category, sort } =
          paramsData;
        const params = new URLSearchParams();
        if (searchTerm) {
          params.append("searchTerm", searchTerm);
        }
        if (occasion) {
          params.append("occasion", occasion);
        }
        if (brand) {
          params.append("brand", brand);
        }
        if (theme) {
          params.append("theme", theme);
        }
        if (category) {
          params.append("category", category);
        }
        if (sort) {
          params.append("sort", sort);
        }
        return {
          url: `/gifts`,
          method: "Get",
          params: params,
        };
      },
      providesTags: ["gifts"],
    }),
    addGift: builder.mutation({
      query: (giftData) => ({
        url: "/gifts/create-gift",
        method: "POST",
        body: giftData,
      }),
      invalidatesTags: ["gifts"],
    }),
    updateGift: builder.mutation({
      query: (giftData) => ({
        url: `/gifts/update-gift/${giftData.id}`,
        method: "PUT",
        body: giftData.data,
      }),
      invalidatesTags: ["gifts"],
    }),
    deleteGift: builder.mutation({
      query: (id) => ({
        url: `/gifts/delete-gift/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["gifts"],
    }),
    manyDeleteGift: builder.mutation({
      query: (ids) => ({
        url: `/gifts/many-delete`,
        method: "DELETE",
        body: ids,
      }),
      invalidatesTags: ["gifts"],
    }),
  }),
});

export const {
  useAddGiftMutation,
  useAllGiftQuery,
  useUpdateGiftMutation,
  useDeleteGiftMutation,
  useManyDeleteGiftMutation,
} = giftApi;
