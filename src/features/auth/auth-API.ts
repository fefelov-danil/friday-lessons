import axios, { AxiosResponse } from 'axios'

export const instance = axios.create({
  baseURL: process.env.REACT_APP_BACK_URL || 'http://localhost:7542/2.0/',
  withCredentials: true,
})

export const authAPI = {
  authMe() {
    return instance.post<ResponseType>('/auth/me', {})
  },
  login(values: loginValues) {
    return instance.post<ResponseType>('/auth/login', values)
  },
}

// types
export type loginValues = {
  email: string
  password: string
  rememberMe?: boolean
}
type ResponseType = {
  _id: string
  email: string
  name: string
  avatar?: string
  publicCardPacksCount: number // количество колод

  created: Date
  updated: Date
  isAdmin: boolean
  verified: boolean // подтвердил ли почту
  rememberMe: boolean

  error?: string
}
