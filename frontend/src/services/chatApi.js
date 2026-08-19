import { httpClient } from '../api/httpClient.js'

export const chatApi = {
  async sendMessage(message, conversationId = null) {
    const response = await httpClient.post('/api/chat', { conversationId, message })
    return response.data
  },

  async getConversations() {
    const response = await httpClient.get('/api/conversations')
    return response.data
  },

  async createConversation() {
    const response = await httpClient.post('/api/conversations')
    return response.data
  },

  async getConversationMessages(conversationId) {
    const response = await httpClient.get(`/api/conversations/${conversationId}/messages`)
    return response.data
  },

  async uploadPdf(file) {
    const formData = new FormData()
    formData.append('file', file)
    const response = await httpClient.post('/api/documents/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    return response.data
  },
}
