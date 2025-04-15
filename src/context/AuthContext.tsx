'use client'

import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'

// Updated User type to match ethereum-key-vault API response
type User = {
  id: string
  email: string
  displayName?: string
  publicKey: string
  picture?: string
}

// Add types for login credentials
type LoginCredentials = {
  email: string
  password: string
}

// Обновленный тип контекста без Google авторизации
type AuthContextType = {
  user: User | null
  isLoading: boolean
  loginWithCredentials: (credentials: LoginCredentials) => Promise<boolean>
  logout: () => void
  handleAuthCallback: () => Promise<boolean>
  error: string | null
}

// Создаем контекст без метода для Google авторизации
const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: false,
  loginWithCredentials: async () => false,
  logout: () => {},
  handleAuthCallback: async () => false,
  error: null,
})

export const useAuth = () => useContext(AuthContext)

// Get API URL from environment variables
const API_URL = import.meta.env.VITE_AUTH_API_URL || 'http://localhost:5000'

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem('auth_user')
    return savedUser ? JSON.parse(savedUser) : null
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Login with email and password
  const loginWithCredentials = useCallback(
    async (credentials: LoginCredentials): Promise<boolean> => {
      setIsLoading(true)
      setError(null)

      try {
        const response = await fetch(`${API_URL}/users/login`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(credentials),
          credentials: 'include', // Important for cookies
        })

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}))
          throw new Error(errorData.message || 'Login failed')
        }

        const userData = await response.json()

        // Format user data
        const user: User = {
          id: userData.id,
          email: userData.email,
          displayName: userData.displayName || userData.email.split('@')[0],
          publicKey: userData.publicKey,
          picture: '/placeholder.svg', // Default placeholder
        }

        setUser(user)
        localStorage.setItem('auth_user', JSON.stringify(user))
        setIsLoading(false)
        return true
      } catch (error) {
        console.error('Authentication error:', error)
        setError(error instanceof Error ? error.message : 'Login failed')
        setIsLoading(false)
        return false
      }
    },
    []
  )

  // Handle callback from auth server
  const handleAuthCallback = useCallback(async (): Promise<boolean> => {
    setIsLoading(true)
    setError(null)

    try {
      // Parse URL query for error information
      const params = new URLSearchParams(window.location.search)
      const errorMsg = params.get('message')

      if (errorMsg) {
        throw new Error(decodeURIComponent(errorMsg))
      }

      // Get user info from auth endpoint (uses cookie from redirect)
      const response = await fetch(`${API_URL}/auth/user-info`, {
        credentials: 'include', // Important to include cookies
      })

      if (!response.ok) {
        throw new Error('Failed to fetch user data')
      }

      const userData = await response.json()

      // Format user data
      const user: User = {
        id: userData.id,
        email: userData.email,
        displayName: userData.displayName || userData.email.split('@')[0],
        publicKey: userData.publicKey,
        picture: '/placeholder.svg', // We can use a placeholder image
      }

      setUser(user)
      localStorage.setItem('auth_user', JSON.stringify(user))
      setIsLoading(false)
      return true
    } catch (error) {
      console.error('Authentication error:', error)
      setError(error instanceof Error ? error.message : 'Authentication failed')
      setIsLoading(false)
      return false
    }
  }, [])

  const logout = useCallback(async () => {
    try {
      // Clear cookies on the server
      await fetch(`${API_URL}/auth/logout`, {
        method: 'POST',
        credentials: 'include',
      })
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      // Clear local state regardless of server response
      setUser(null)
      localStorage.removeItem('auth_user')
    }
  }, [])

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        loginWithCredentials,
        logout,
        handleAuthCallback,
        error,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
