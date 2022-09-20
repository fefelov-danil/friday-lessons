import axios from 'axios'

export const instance = axios.create({
  baseURL: 'http://localhost:7542',
  withCredentials: true,
})

export const authAPI = {}
