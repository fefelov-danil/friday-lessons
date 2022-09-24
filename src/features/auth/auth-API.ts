import axios from 'axios'

import { UserType } from './auth-reducer'

export const instance = axios.create({
  baseURL: 'https://neko-back.herokuapp.com/2.0',
  withCredentials: true,
})

export const authAPI = {
  authMe() {
    return instance.post<ResponseUserType>('/auth/me', {})
  },
  registration(values: registrationValuesType) {
    return instance.post('/auth/register', values)
  },
  login(values: loginValuesType) {
    return instance.post<ResponseUserType>('/auth/login', values)
  },
  forgotPassword(values: forgotPasswordValuesType) {
    return instance.post<ResponseType>('/auth/forgot', values)
  },
  changePassword(values: changePasswordType) {
    return instance.post<ResponseType>('/auth/set-new-password', values)
  },
  logout() {
    return instance.delete('auth/me', {})
  },
  changeUsername(name: string) {
    return instance.put<{ updatedUser: UserType; error?: string }>('auth/me', { name })
  },
}

// types
export type loginValuesType = {
  email: string
  password: string
  rememberMe?: boolean
}
export type registrationValuesType = {
  email: string
  password: string
}
export type forgotPasswordValuesType = {
  email: string
  from: string
  message: string
}
export type changePasswordType = {
  password: string
  resetPasswordToken: string
}
type ResponseType = {
  info: string
  error: string
}
type ResponseUserType = {
  avatar: string
  created: string
  email: string
  isAdmin: boolean
  name: string
  publicCardPacksCount: number
  rememberMe: boolean
  token: string
  tokenDeathTime: number
  updated: string
  verified: boolean
  __v: number
  _id: string
}
