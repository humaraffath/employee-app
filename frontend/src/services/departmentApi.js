import { httpClient } from '../api/httpClient.js'

export const departmentApi = {
  async getAll() {
    const response = await httpClient.get('/api/departments')
    return response.data
  },

  async create(payload) {
    const response = await httpClient.post('/api/departments', payload)
    return response.data
  },
}
