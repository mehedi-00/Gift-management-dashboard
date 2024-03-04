import { baseApi } from "../../api/baseApi";

const couponApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    allCoupon: builder.query({
      query: () => {
        return {
          url: `/coupons`,
          method: "Get",
        };
      },
      providesTags: ["coupons"],
    }),
    addCoupon: builder.mutation({
      query: (couponData) => ({
        url: "/coupons/create-coupon",
        method: "POST",
        body: couponData,
      }),
      invalidatesTags: ["coupons"],
    }),
  }),
});

export const { useAllCouponQuery, useAddCouponMutation } = couponApi;
