import { apiSlice } from "../../app/api/apiSlice";
import { logOut, setCredentials } from "./authSlice";
const authApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (credentials) => ({
        url: "/auth",
        method: "POST",
        // credentials: "include",
        body: { ...credentials },
      }),
    }),

    sendLogout: builder.mutation({
      query: () => ({
        url: "/auth/logout",
        method: "POST",
      }),

      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        console.log("onQueryStarted", arg);
        try {
          const { data } = await queryFulfilled;
          console.log("data");
          dispatch(logOut());
          // 1s for realize that list com unmounted=>then resetApi state and then get rid of subcription
          setTimeout(() => {
            dispatch(apiSlice.util.resetApiState());
          }, 1000);
        } catch (error) {
          console.log("error", error);
        }
      },
    }),
    refresh: builder.mutation({
      query: () => ({
        url: "/auth/refresh",
        method: "GET",
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          // const { accessToken } = data;
          dispatch(setCredentials(data));
        } catch (err) {
          console.log(err);
        }
      },
    }),
  }),
});
// apiSlice.

export const { useLoginMutation, useRefreshMutation, useSendLogoutMutation } =
  authApiSlice;
