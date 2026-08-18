import { httpClient } from '../api/httpClient.js'

export const leaveApi = {
  async apply(employeeId, payload) {
    const response = await httpClient.post(`/api/employees/${employeeId}/leaves`, payload)
    return response.data
  },

  async getByEmployee(employeeId) {
    const response = await httpClient.get(`/api/employees/${employeeId}/leaves`)
    return response.data
  },

  async getManagerLeaves(status) {
    const response = await httpClient.get('/api/manager/leaves', {
      params: status ? { status } : {},
    })
    return response.data
  },

  async approve(leaveId) {
    const response = await httpClient.post(`/api/manager/leaves/${leaveId}/approve`)
    return response.data
  },

  async reject(leaveId, rejectionReason) {
    const response = await httpClient.post(`/api/manager/leaves/${leaveId}/reject`, {
      rejectionReason,
    })
    return response.data
  },
}
