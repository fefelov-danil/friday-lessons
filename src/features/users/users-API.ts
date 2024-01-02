import axios from 'axios'

export const instance = axios.create({
  baseURL: 'https://neko-back.herokuapp.com/2.0/social/users',
  withCredentials: true,
})

export const usersAPI = {
  getUsers(payload: string) {
    return instance.get<ResponseUsersType>(payload)
  },
}

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
