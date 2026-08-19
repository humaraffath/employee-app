import { useEffect, useMemo, useState } from 'react'
import { useAuth } from '../auth/useAuth.js'
import { chatApi } from '../services/chatApi.js'
import { getErrorMessage } from '../utils/errorUtils.js'

function createMessage(role, content) {
  return {
    id: `${Date.now()}-${Math.random()}`,
    role,
    content,
  }
}

function createConversationTitle(content) {
  const words = content
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 3)

  return words.length ? words.join(' ') : 'New Conversation'
}

function formatConversationDate(isoString) {
  if (!isoString) {
    return ''
  }

  const dateValue = new Date(isoString)
  if (Number.isNaN(dateValue.getTime())) {
    return ''
  }

  return dateValue.toLocaleString()
}

function readStoredHistory(storageKey) {
  const rawValue = localStorage.getItem(storageKey)
  if (!rawValue) {
    return {}
  }

  try {
    const parsedValue = JSON.parse(rawValue)
    if (parsedValue && typeof parsedValue === 'object') {
      return parsedValue
    }
  } catch (error) {
    console.error('Failed to parse stored chat history.', error)
  }

  localStorage.removeItem(storageKey)
  return {}
}

export function ChatPage() {
  const { user } = useAuth()
  const [conversations, setConversations] = useState([])
  const [selectedConversationId, setSelectedConversationId] = useState(null)
  const [messagesByConversation, setMessagesByConversation] = useState({})
  const [newConversationMessages, setNewConversationMessages] = useState([])
  const [draft, setDraft] = useState('')
  const [isSending, setIsSending] = useState(false)
  const [isLoadingConversations, setIsLoadingConversations] = useState(true)
  const [isLoadingMessages, setIsLoadingMessages] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const historyStorageKey = useMemo(() => `employeeapp-chat-history-${user.id}`, [user.id])

  useEffect(() => {
    setMessagesByConversation(readStoredHistory(historyStorageKey))
    setNewConversationMessages([])
  }, [historyStorageKey])

  useEffect(() => {
    localStorage.setItem(historyStorageKey, JSON.stringify(messagesByConversation))
  }, [historyStorageKey, messagesByConversation])

  useEffect(() => {
    let ignore = false

    const loadConversations = async () => {
      setIsLoadingConversations(true)
      setErrorMessage('')

      try {
        const data = await chatApi.getConversations()
        if (ignore) {
          return
        }

        setConversations(data)
        setSelectedConversationId((current) => {
          if (current && data.some((item) => item.id === current)) {
            return current
          }
          return data[0]?.id ?? null
        })
      } catch (error) {
        if (!ignore) {
          setErrorMessage(getErrorMessage(error, 'Failed to load conversation history.'))
        }
      } finally {
        if (!ignore) {
          setIsLoadingConversations(false)
        }
      }
    }

    loadConversations()

    return () => {
      ignore = true
    }
  }, [])

  const syncConversations = async (fallbackConversation = null) => {
    const data = await chatApi.getConversations()
    const mergedConversations =
      fallbackConversation && !data.some((item) => item.id === fallbackConversation.id)
        ? [fallbackConversation, ...data]
        : data

    setConversations(mergedConversations)
    setSelectedConversationId((current) => {
      if (current && mergedConversations.some((item) => item.id === current)) {
        return current
      }
      return mergedConversations[0]?.id ?? null
    })
  }

  useEffect(() => {
    let ignore = false

    const loadSelectedConversationMessages = async () => {
      if (selectedConversationId === null || messagesByConversation[selectedConversationId]) {
        return
      }

      setIsLoadingMessages(true)
      setErrorMessage('')

      try {
        const data = await chatApi.getConversationMessages(selectedConversationId)
        if (ignore) {
          return
        }

        setMessagesByConversation((current) => ({
          ...current,
          [selectedConversationId]: data.map((message) => ({
            id: `${Date.now()}-${Math.random()}`,
            role: message.role === 'user' ? 'user' : 'assistant',
            content: message.content,
          })),
        }))
      } catch (error) {
        if (!ignore) {
          setErrorMessage(getErrorMessage(error, 'Failed to load conversation messages.'))
        }
      } finally {
        if (!ignore) {
          setIsLoadingMessages(false)
        }
      }
    }

    loadSelectedConversationMessages()

    return () => {
      ignore = true
    }
  }, [messagesByConversation, selectedConversationId])

  const activeMessages =
    selectedConversationId === null
      ? newConversationMessages
      : messagesByConversation[selectedConversationId] ?? []

  const submitMessage = async () => {
    const trimmedMessage = draft.trim()
    if (!trimmedMessage) {
      return
    }

    const currentConversationId = selectedConversationId
    const userMessage = createMessage('user', trimmedMessage)
    const optimisticNewConversationMessages =
      currentConversationId === null ? [...newConversationMessages, userMessage] : null

    if (currentConversationId === null) {
      setNewConversationMessages(optimisticNewConversationMessages)
    } else {
      setMessagesByConversation((current) => ({
        ...current,
        [currentConversationId]: [...(current[currentConversationId] ?? []), userMessage],
      }))
    }

    setDraft('')
    setErrorMessage('')
    setIsSending(true)

    try {
      const data = await chatApi.sendMessage(trimmedMessage, currentConversationId)
      const assistantMessage = createMessage('assistant', data.response)

      if (currentConversationId === null) {
        const timestamp = new Date().toISOString()
        const fallbackConversation = {
          id: data.conversationId,
          title: createConversationTitle(trimmedMessage),
          createdAt: timestamp,
          updatedAt: timestamp,
        }
        const completedConversation = [...optimisticNewConversationMessages, assistantMessage]
        setMessagesByConversation((current) => ({
          ...current,
          [data.conversationId]: completedConversation,
        }))
        setConversations((current) => {
          if (current.some((conversation) => conversation.id === data.conversationId)) {
            return current
          }
          return [fallbackConversation, ...current]
        })
        setSelectedConversationId(data.conversationId)
        setNewConversationMessages([])
        await syncConversations(fallbackConversation)
        return
      } else {
        setMessagesByConversation((current) => ({
          ...current,
          [data.conversationId]: [...(current[data.conversationId] ?? []), assistantMessage],
        }))
      }

      await syncConversations()
    } catch (error) {
      if (currentConversationId === null) {
        setNewConversationMessages((current) => current.filter((message) => message.id !== userMessage.id))
      } else {
        setMessagesByConversation((current) => ({
          ...current,
          [currentConversationId]: (current[currentConversationId] ?? []).filter(
            (message) => message.id !== userMessage.id,
          ),
        }))
      }

      setErrorMessage(getErrorMessage(error, 'Failed to send message.'))
    } finally {
      setIsSending(false)
    }
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    await submitMessage()
  }

  return (
    <div className="row g-3">
      <div className="col-lg-4">
        <div className="card">
          <div className="card-body">
            <div className="d-flex align-items-center justify-content-between mb-3">
              <h2 className="h5 mb-0">Conversations</h2>
              <button
                type="button"
                className="btn btn-outline-light btn-sm"
                onClick={() => {
                  setErrorMessage('')
                  setSelectedConversationId(null)
                  setNewConversationMessages([])
                }}
                disabled={isSending}
              >
                New
              </button>
            </div>
            <div className="chat-history-list">
              {isLoadingConversations ? (
                <div className="small text-muted">Loading conversation history...</div>
              ) : conversations.length === 0 ? (
                <div className="small text-muted">No conversations yet.</div>
              ) : (
                conversations.map((conversation) => {
                  const isActive = conversation.id === selectedConversationId
                  const isDefaultTitle =
                    !conversation.title || conversation.title.trim().toLowerCase() === 'new conversation'
                  const firstUserMessage = (messagesByConversation[conversation.id] ?? []).find(
                    (message) => message.role === 'user' && message.content.trim(),
                  )
                  const displayTitle =
                    isDefaultTitle && firstUserMessage
                      ? createConversationTitle(firstUserMessage.content)
                      : conversation.title || `Conversation ${conversation.id}`
                  return (
                    <button
                      key={conversation.id}
                      type="button"
                      className={`chat-history-item ${isActive ? 'chat-history-item-active' : ''}`}
                      onClick={() => {
                        setSelectedConversationId(conversation.id)
                        setNewConversationMessages([])
                      }}
                      disabled={isSending}
                    >
                      <div className="fw-semibold text-start">{displayTitle}</div>
                      <div className="small text-muted text-start">
                        {formatConversationDate(conversation.updatedAt || conversation.createdAt)}
                      </div>
                    </button>
                  )
                })
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="col-lg-8">
        <div className="mb-3">
          <h1 className="h3 page-title mb-1">AI Assistant</h1>
          <p className="text-muted mb-0">Your chat sessions are grouped by conversation.</p>
        </div>

        {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
        <div className="card mb-3">
          <div className="card-body chat-shell">
            <div className="chat-panel">
              {activeMessages.length === 0 ? (
                <div className="text-center py-5 text-muted">
                  {isLoadingMessages
                    ? 'Loading messages...'
                    : selectedConversationId === null
                    ? 'Start a new conversation by sending your first message.'
                    : 'No messages stored for this conversation yet.'}
                </div>
              ) : (
                <div className="d-flex flex-column gap-3">
                  {activeMessages.map((message) => (
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
            <form onSubmit={handleSubmit} className="chat-composer">
              <label htmlFor="chat-message" className="form-label">
                Message
              </label>
              <div className="d-flex flex-column gap-2">
                <textarea
                  id="chat-message"
                  className="form-control chat-input"
                  rows="3"
                  placeholder="Type your message here..."
                  value={draft}
                  onChange={(event) => setDraft(event.target.value)}
                  onKeyDown={async (event) => {
                    if (event.key === 'Enter' && !event.shiftKey) {
                      event.preventDefault()
                      if (isSending || !draft.trim()) {
                        return
                      }
                      await submitMessage()
                    }
                  }}
                  disabled={isSending}
                />
                <div className="d-flex justify-content-end">
                  <button type="submit" className="btn btn-primary" disabled={isSending || !draft.trim()}>
                    {isSending ? 'Sending...' : 'Send Message'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
