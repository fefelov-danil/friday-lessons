import axios from 'axios'

import { UserType } from './auth-reducer'

export const instance = axios.create({
  baseURL: 'https://neko-back.herokuapp.com/2.0',
  withCredentials: true,
})

export const authAPI = {
  me() {
    return instance.post('auth/me', {})
  },
  login() {
    return instance.post('auth/login', {
      email: 'roman.petrakovskiy@gmail.com',
      password: '123456789',
    })
  },
  logout() {
    return instance.delete('auth/me', {})
  },
  changeUsername(name: string) {
    return instance.put<{ updatedUser: UserType; error?: string }>('auth/me', { name })
  },
}
