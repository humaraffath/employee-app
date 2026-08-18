import { useMemo, useState } from 'react'
import { authApi } from '../services/authApi.js'
import { AuthContext } from './AuthContext.js'
import { clearStoredAuth, getStoredAuth, setStoredAuth } from './authStorage.js'

export function AuthProvider({ children }) {
  const [authState, setAuthState] = useState(() => getStoredAuth())

  const login = async (credentials) => {
    const loginResponse = await authApi.login(credentials)
    setStoredAuth(loginResponse)
    setAuthState(loginResponse)
    return loginResponse
  }

  const register = async (registerPayload) => {
    await authApi.register(registerPayload)
    return true
  }

  const logout = () => {
    clearStoredAuth()
    setAuthState(null)
  }

  const value = useMemo(
    () => ({
      user: authState
        ? {
            id: authState.id,
            name: authState.name,
            email: authState.email,
            role: authState.role,
          }
        : null,
      token: authState?.token ?? null,
      isAuthenticated: Boolean(authState?.token),
      login,
      register,
      logout,
    }),
    [authState],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
