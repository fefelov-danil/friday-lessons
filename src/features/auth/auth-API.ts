import axios from 'axios'

export const instance = axios.create({
  baseURL: 'https://neko-back.herokuapp.com/2.0',
  withCredentials: true,
})

export const authAPI = {
  authMe() {
    return instance.post<ResponseUserType>('/auth/me', {})
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
  deleteMe() {
    return instance.delete<ResponseType>('/auth/me', {})
  },
}

// types
export type loginValuesType = {
  email: string
  password: string
  rememberMe?: boolean
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
