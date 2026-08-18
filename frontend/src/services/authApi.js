import { httpClient } from '../api/httpClient.js'

export const authApi = {
  async login(payload) {
    const response = await httpClient.post('/api/auth/login', payload)
    return response.data
  },

  async register(payload) {
    const response = await httpClient.post('/api/auth/register', payload)
    return response.data
  },
}
