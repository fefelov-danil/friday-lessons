import axios from 'axios'

export const instance = axios.create({
  baseURL: 'http://localhost:7542/2.0',
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
    return instance.put('auth/me', { name })
  },
}
