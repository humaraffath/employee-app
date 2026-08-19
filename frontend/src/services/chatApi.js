import { httpClient } from '../api/httpClient.js'

export const chatApi = {
  async sendMessage(message) {
    const response = await httpClient.post('/api/chat', { message })
    return response.data
  },
}
