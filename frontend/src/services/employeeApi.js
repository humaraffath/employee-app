import { httpClient } from '../api/httpClient.js'

export const employeeApi = {
  async getAll() {
    const response = await httpClient.get('/api/employees')
    return response.data
  },

  async create(payload) {
    const response = await httpClient.post('/api/employees', payload)
    return response.data
  },
}
