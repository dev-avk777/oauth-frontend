import config from '../config.ts'

// Login with email/password, server sets HttpOnly cookie with JWT
export const login = async (credentials: { email: string; password: string }) => {
  const response = await fetch(`${config.apiUrl}/users/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials),
    credentials: 'include', // send cookies
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

// Open OAuth login url (redirects to Google)
export const loginWithGoogle = () => {
  window.location.href = `${config.apiUrl}/auth/google`
}

// Get info about the logged-in user (reads authToken cookie)
export const getUserInfo = async () => {
  const response = await fetch(`${config.apiUrl}/auth/user-info`, {
    credentials: 'include', // necessary to send cookies
    headers: { Accept: 'application/json' },
  })
  if (!response.ok) {
    throw new Error('Failed to fetch user data')
  }
  return response.json()
}

/**
 * Get detailed user information by ID
 * @param userId - The ID of the user to fetch information for
 * @returns Promise with user data
 */
export const getUserById = async (userId: string) => {
  // Get auth token from storage if needed
  const token = localStorage.getItem('authToken')

  const response = await fetch(`${config.apiUrl}/auth/user/${userId}`, {
    method: 'GET',
    credentials: 'include', // For cookies
    headers: {
      Accept: 'application/json',
      Authorization: token ? `Bearer ${token}` : '', // Include token if available
    },
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new Error(errorData.message || `Failed to fetch user with ID: ${userId}`)
  }

  return response.json()
}

// Logout via GET
export const logoutApi = async () => {
  const response = await fetch(`${config.apiUrl}/auth/logout`, {
    method: 'GET',
    credentials: 'include',
  })
  if (!response.ok) {
    throw new Error('Logout failed')
  }
}

//TODO: add logic in backend
// Transaction interface
interface Transaction {
  to: string
  value: string
  data?: string
  nonce?: number
  gasLimit?: string
  maxFeePerGas?: string
  maxPriorityFeePerGas?: string
}

// Create new Ethereum key
export const createEthereumKey = async () => {
  const response = await fetch(`${config.apiUrl}/ethereum/keys/create`, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
  })
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new Error(errorData.message || 'Failed to create key')
  }
  return response.json()
}

// List Ethereum keys
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
