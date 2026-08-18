const AUTH_STORAGE_KEY = 'employeeapp-auth'

export function getStoredAuth() {
  const rawValue = localStorage.getItem(AUTH_STORAGE_KEY)
  if (!rawValue) {
    return null
  }

  try {
    return JSON.parse(rawValue)
  } catch {
    localStorage.removeItem(AUTH_STORAGE_KEY)
    return null
  }
}

export function setStoredAuth(authValue) {
  localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(authValue))
}

export function clearStoredAuth() {
  localStorage.removeItem(AUTH_STORAGE_KEY)
}
