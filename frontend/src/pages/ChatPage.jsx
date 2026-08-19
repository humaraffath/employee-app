import { useState } from 'react'
import { chatApi } from '../services/chatApi.js'
import { getErrorMessage } from '../utils/errorUtils.js'

export function ChatPage() {
  const [messages, setMessages] = useState([])
  const [draft, setDraft] = useState('')
  const [isSending, setIsSending] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  const handleSubmit = async (event) => {
    event.preventDefault()

    const trimmedMessage = draft.trim()
    if (!trimmedMessage) {
      return
    }

    const userMessage = {
      id: Date.now(),
      role: 'user',
      content: trimmedMessage,
    }

    setMessages((current) => [...current, userMessage])
    setDraft('')
    setErrorMessage('')
    setIsSending(true)

    try {
      const data = await chatApi.sendMessage(trimmedMessage)
      setMessages((current) => [
        ...current,
        {
          id: Date.now() + 1,
          role: 'assistant',
          content: data.response,
        },
      ])
    } catch (error) {
      setErrorMessage(getErrorMessage(error, 'Failed to send message.'))
    } finally {
      setIsSending(false)
    }
  }

  return (
    <div className="row justify-content-center">
      <div className="col-lg-10">
        <div className="mb-3">
          <h1 className="h3 page-title mb-1">AI Assistant</h1>
          <p className="text-muted mb-0">Only logged-in users can access this chat.</p>
        </div>

        {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}

        <div className="card mb-3">
          <div className="card-body chat-panel">
            {messages.length === 0 ? (
              <div className="text-center py-5 text-muted">
                Start the conversation by sending your first message.
              </div>
            ) : (
              <div className="d-flex flex-column gap-3">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={message.role === 'user' ? 'chat-bubble chat-bubble-user ms-auto' : 'chat-bubble chat-bubble-assistant'}
                  >
                    <div className="small text-uppercase mb-1 chat-role-label">
                      {message.role === 'user' ? 'You' : 'AI'}
                    </div>
                    <div>{message.content}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="card">
          <div className="card-body">
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label htmlFor="chat-message" className="form-label">
                  Message
                </label>
                <textarea
                  id="chat-message"
                  className="form-control"
                  rows="4"
                  placeholder="Type your message here..."
                  value={draft}
                  onChange={(event) => setDraft(event.target.value)}
                  disabled={isSending}
                />
              </div>
              <div className="d-flex justify-content-end">
                <button type="submit" className="btn btn-primary" disabled={isSending || !draft.trim()}>
                  {isSending ? 'Sending...' : 'Send Message'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
