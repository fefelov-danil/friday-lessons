import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const usersApi = createApi({
  baseQuery: fetchBaseQuery({ baseUrl: 'https://neko-back.herokuapp.com/2.0/social/users', credentials: 'include' }),
  endpoints: (builder) => ({
    getUsers: builder.query<ResponseUsersType, string>({
      query: (payload) => payload,
    }),
  }),
});

export const { useGetUsersQuery } = usersApi;

export type userType = {
  avatar: string
  created: string
  email: string
  isAdmin: boolean
  name: string
  publicCardPacksCount: number
  updated: string
  verified: boolean
  _id: string
}
type ResponseUsersType = {
  users: userType[]
  maxPublicCardPacksCount: number
  minPublicCardPacksCount: number
  page: number
  pageCount: number
  usersTotalCount: number
}

