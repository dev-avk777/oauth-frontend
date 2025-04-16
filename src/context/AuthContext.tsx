'use client'

import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'
import {
  login,
  register,
  getUserInfo,
  logoutApi,
  loginWithGoogle as loginWithGoogleApi,
  createEthereumKey,
  getEthereumKeys,
  signTransaction,
  getEthereumBalance,
} from '@/api/authApi'

// Обновлённый тип пользователя согласно ответу сервера Ethereum Key Vault
type User = {
  id: string
  email: string
  displayName?: string
  publicKey: string
  picture?: string
}

// Тип для учётных данных логина/регистрации
type LoginCredentials = {
  email: string
  password: string
}

// Тип для Ethereum ключа
type EthereumKey = {
  id: string
  address: string
  createdAt: string
  balance?: string
}

// Тип для транзакции
type Transaction = {
  to: string
  value: string
  data?: string
  gasLimit?: string
  gasPrice?: string
}

// Обновленный тип контекста без Google авторизации
type AuthContextType = {
  user: User | null
  isLoading: boolean
  loginWithCredentials: (credentials: LoginCredentials) => Promise<boolean>
  loginWithGoogle: () => void
  logout: () => void
  handleAuthCallback: () => Promise<boolean>
  registerUser: (credentials: LoginCredentials) => Promise<boolean>
  error: string | null
  // Методы для работы с Ethereum
  createKey: () => Promise<EthereumKey>
  getUserKeys: () => Promise<EthereumKey[]>
  signTx: (keyId: string, transaction: Transaction) => Promise<Record<string, unknown>>
  getBalance: (address: string) => Promise<string>
  ethereumKeys: EthereumKey[]
}

// Создаем контекст без метода для Google авторизации
const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: false,
  loginWithCredentials: async () => false,
  loginWithGoogle: () => {},
  logout: () => {},
  handleAuthCallback: async () => false,
  registerUser: async () => false,
  error: null,
  // Методы для работы с Ethereum
  createKey: async () => ({ id: '', address: '', createdAt: '' }),
  getUserKeys: async () => [],
  signTx: async () => ({}),
  getBalance: async () => '0',
  ethereumKeys: [],
})

export const useAuth = () => useContext(AuthContext)

// Get API URL from environment variables
// const API_URL = import.meta.env.VITE_AUTH_API_URL || 'http://localhost:5000'

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem('auth_user')
    return savedUser ? JSON.parse(savedUser) : null
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [ethereumKeys, setEthereumKeys] = useState<EthereumKey[]>([])

  // Login with email and password
  const loginWithCredentials = useCallback(
    async (credentials: LoginCredentials): Promise<boolean> => {
      setIsLoading(true)
      setError(null)

      try {
        const userData = await login(credentials)
        const formattedUser: User = {
          id: userData.id,
          email: userData.email,
          displayName: userData.displayName || userData.email.split('@')[0],
          publicKey: userData.publicKey,
          picture: '/placeholder.svg', // Default placeholder
        }

        setUser(formattedUser)
        localStorage.setItem('auth_user', JSON.stringify(formattedUser))

        // После успешного логина загружаем ключи пользователя
        try {
          const keys = await getEthereumKeys()
          setEthereumKeys(keys)
        } catch (keyError) {
          console.error('Failed to fetch keys:', keyError)
        }

        setIsLoading(false)
        return true
      } catch (err) {
        console.error('Authentication error:', err)
        setError(err instanceof Error ? err.message : 'Login failed')
        setIsLoading(false)
        return false
      }
    },
    []
  )

  // Login with Google OAuth
  const loginWithGoogle = useCallback(() => {
    setIsLoading(true)
    setError(null)
    try {
      loginWithGoogleApi()
      // Редирект будет выполнен в API, здесь ничего не возвращаем
    } catch (err) {
      console.error('Google auth error:', err)
      setError(err instanceof Error ? err.message : 'Google login failed')
      setIsLoading(false)
    }
  }, [])

  // Register new user
  const registerUser = useCallback(async (credentials: LoginCredentials): Promise<boolean> => {
    setIsLoading(true)
    setError(null)
    try {
      const userData = await register(credentials)
      const formattedUser: User = {
        id: userData.id,
        email: userData.email,
        displayName: userData.email.split('@')[0],
        publicKey: userData.publicKey,
        picture: '/placeholder.svg',
      }
      setUser(formattedUser)
      localStorage.setItem('auth_user', JSON.stringify(formattedUser))
      setIsLoading(false)
      return true
    } catch (err) {
      console.error('Registration error:', err)
      setError(err instanceof Error ? err.message : 'Registration failed')
      setIsLoading(false)
      return false
    }
  }, [])

  // Handle callback from auth server
  const handleAuthCallback = useCallback(async (): Promise<boolean> => {
    setIsLoading(true)
    setError(null)

    try {
      // Check if user data is already in localStorage (set directly by CallbackPage)
      const savedUser = localStorage.getItem('auth_user')
      if (savedUser) {
        try {
          const parsedUser = JSON.parse(savedUser)
          if (parsedUser && parsedUser.id) {
            setUser(parsedUser)

            // Пробуем загрузить ключи пользователя
            try {
              const keys = await getEthereumKeys()
              setEthereumKeys(keys)
            } catch (keyError) {
              console.error('Failed to fetch keys:', keyError)
            }

            setIsLoading(false)
            return true
          }
        } catch (e) {
          console.error('Error parsing saved user:', e)
        }
      }

      // Parse URL query for error information
      const params = new URLSearchParams(window.location.search)
      const errorMsg = params.get('message')

      if (errorMsg) {
        throw new Error(decodeURIComponent(errorMsg))
      }

      // Get user info from auth endpoint (uses cookie from redirect)
      const userData = await getUserInfo()
      const formattedUser: User = {
        id: userData.id,
        email: userData.email,
        displayName: userData.displayName || userData.email.split('@')[0],
        publicKey: userData.publicKey,
        picture: userData.picture || '/placeholder.svg',
      }

      setUser(formattedUser)
      localStorage.setItem('auth_user', JSON.stringify(formattedUser))

      // После успешного логина загружаем ключи пользователя
      try {
        const keys = await getEthereumKeys()
        setEthereumKeys(keys)
      } catch (keyError) {
        console.error('Failed to fetch keys:', keyError)
      }

      setIsLoading(false)
      return true
    } catch (err) {
      console.error('Authentication error:', err)
      setError(err instanceof Error ? err.message : 'Authentication failed')
      setIsLoading(false)
      return false
    }
  }, [])

  const logout = useCallback(async () => {
    try {
      await logoutApi()
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      setUser(null)
      setEthereumKeys([])
      localStorage.removeItem('auth_user')
    }
  }, [])

  // Create new Ethereum key
  const createKey = useCallback(async (): Promise<EthereumKey> => {
    setIsLoading(true)
    try {
      const newKey = await createEthereumKey()
      setEthereumKeys(prev => [...prev, newKey])
      setIsLoading(false)
      return newKey
    } catch (err) {
      console.error('Error creating key:', err)
      setError(err instanceof Error ? err.message : 'Failed to create key')
      setIsLoading(false)
      throw err
    }
  }, [])

  // Get all user keys
  const getUserKeys = useCallback(async (): Promise<EthereumKey[]> => {
    setIsLoading(true)
    try {
      const keys = await getEthereumKeys()
      setEthereumKeys(keys)
      setIsLoading(false)
      return keys
    } catch (err) {
      console.error('Error fetching keys:', err)
      setError(err instanceof Error ? err.message : 'Failed to fetch keys')
      setIsLoading(false)
      throw err
    }
  }, [])

  // Sign transaction
  const signTx = useCallback(async (keyId: string, transaction: Transaction) => {
    setIsLoading(true)
    try {
      const result = await signTransaction(keyId, transaction)
      setIsLoading(false)
      return result
    } catch (err) {
      console.error('Error signing transaction:', err)
      setError(err instanceof Error ? err.message : 'Failed to sign transaction')
      setIsLoading(false)
      throw err
    }
  }, [])

  // Get balance
  const getBalance = useCallback(async (address: string): Promise<string> => {
    try {
      const balance = await getEthereumBalance(address)
      return balance.balance
    } catch (err) {
      console.error('Error fetching balance:', err)
      throw err
    }
  }, [])

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        loginWithCredentials,
        loginWithGoogle,
        logout,
        handleAuthCallback,
        registerUser,
        error,
        createKey,
        getUserKeys,
        signTx,
        getBalance,
        ethereumKeys,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
