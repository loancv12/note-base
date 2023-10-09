import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { setCredentials } from "../../features/auth/authSlice";

const baseQuery = fetchBaseQuery({
  baseUrl: "https://notebaseapi.onrender.com",
  // baseUrl: "http://localhost:3000",
  credentials: "include",
  prepareHeaders: (headers, { getState, extra }) => {
    const token = getState().auth.token;
    if (token) {
      headers.set("authorization", `Bearer ${token}`);
    }

    return headers;
  },
});

const baseQueryWithReauth = async (args, api, extraOptions) => {
  // console.log("req url, method, body", args);
  // console.log("signal, dispath, getState", api);
  // console.log("custom like {shout:true} ", extraOptions);
  let result = await baseQuery(args, api, extraOptions);
  // console.log("result lan goi api 1", result);
  // if you want, handle other status codes, too
  if (result?.error?.status === 403) {
    console.log("sending refresh token");

    const refreshResult = await baseQuery("/auth/refresh", api, extraOptions);
    // console.log("result lay refresh token", refreshResult);

    if (refreshResult?.data) {
      // store the new token
      api.dispatch(setCredentials({ ...refreshResult.data }));

      // retry original query with new access token
      result = await baseQuery(args, api, extraOptions);
      // console.log("result goi api 2", result);
    } else {
      if (refreshResult?.error?.status === 403) {
        refreshResult.error.data.message = "Your login has expired. ";
      }
      return refreshResult;
    }
  }
  return result;
};
export const apiSlice = createApi({
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Note", "User"],
  endpoints: (builder) => ({}),
});
