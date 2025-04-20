import config from '../config.ts'

// Login with email/password, server sets HttpOnly cookie with JWT
export const login = async (credentials: { email: string; password: string }) => {
  const response = await fetch(`${config.apiUrl}/users/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials),
    credentials: 'include', // передаём куки
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new Error(errorData.message || 'Login failed')
  }
  return response.json()
}

// Register a new user
export const register = async (credentials: { email: string; password: string }) => {
  const response = await fetch(`${config.apiUrl}/users/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials),
    credentials: 'include',
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new Error(errorData.message || 'Registration failed')
  }
  return response.json()
}

// Initiate Google OAuth, removed unnecessary ?redirect_uri
export const loginWithGoogle = () => {
  window.location.href = `${config.apiUrl}/auth/google`
}

// Get info about the logged-in user (reads authToken cookie)
export const getUserInfo = async () => {
  const response = await fetch(`${config.apiUrl}/auth/user-info`, {
    credentials: 'include', // обязательно, чтобы cookie ушли
    headers: { Accept: 'application/json' },
  })
  if (!response.ok) {
    throw new Error('Failed to fetch user data')
  }
  return response.json()
}

// Logout via GET (server has @Get('logout'))
export const logoutApi = async () => {
  const response = await fetch(`${config.apiUrl}/auth/logout`, {
    method: 'GET',
    credentials: 'include',
  })
  if (!response.ok) {
    throw new Error('Logout failed')
  }
}

// Methods for working with Ethereum keys — unchanged
export const createEthereumKey = async () => {
  const response = await fetch(`${config.apiUrl}/ethereum/keys/create`, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
  })
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new Error(errorData.message || 'Failed to create Ethereum key')
  }
  return response.json()
}

export const getEthereumKeys = async () => {
  const response = await fetch(`${config.apiUrl}/ethereum/keys`, {
    credentials: 'include',
    headers: { Accept: 'application/json' },
  })
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new Error(errorData.message || `Failed to fetch keys: ${response.status}`)
  }
  return response.json()
}

type Transaction = {
  to: string
  value: string
  data?: string
  gasLimit?: string
  gasPrice?: string
}

// Sign a transaction
export const signTransaction = async (keyId: string, transaction: Transaction) => {
  const response = await fetch(`${config.apiUrl}/ethereum/keys/${keyId}/sign`, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ transaction }),
  })
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new Error(errorData.message || 'Failed to sign transaction')
  }
  return response.json()
}

// Get Ethereum balance
export const getEthereumBalance = async (address: string) => {
  const response = await fetch(`${config.apiUrl}/ethereum/balance/${address}`, {
    credentials: 'include',
    headers: { Accept: 'application/json' },
  })
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new Error(errorData.message || 'Failed to fetch balance')
  }
  return response.json()
}
