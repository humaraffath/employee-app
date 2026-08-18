import axios from 'axios'
import { clearStoredAuth, getStoredAuth } from '../auth/authStorage.js'

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8080'

export const httpClient = axios.create({
  baseURL: apiBaseUrl,
  headers: {
    'Content-Type': 'application/json',
  },
})

httpClient.interceptors.request.use((config) => {
  const storedAuth = getStoredAuth()
  if (storedAuth?.token) {
    config.headers.Authorization = `Bearer ${storedAuth.token}`
  }
  return config
})

httpClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      clearStoredAuth()
    }
    return Promise.reject(error)
  },
)
