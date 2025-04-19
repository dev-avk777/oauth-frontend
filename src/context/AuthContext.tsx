'use client'

import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react'
import {
  login,
  register,
  getUserInfo,
  logoutApi,
  // Ethereum API calls stubbed until backend is implemented:
  // createEthereumKey,
  // getEthereumKeys,
  // signTransaction,
  // getEthereumBalance,
} from '@/api/authApi'

// Тип пользователя, получаемый с бэка
type User = {
  id: string
  email: string
  displayName?: string
  publicKey: string
  picture?: string
}

// Данные для логина/регистрации
type LoginCredentials = { email: string; password: string }

// Контекст аутентификации
interface AuthContextType {
  user: User | null
  isLoading: boolean
  loginWithCredentials: (credentials: LoginCredentials) => Promise<boolean>
  loginWithGoogle: () => void
  registerUser: (credentials: LoginCredentials) => Promise<boolean>
  handleAuthCallback: () => Promise<boolean>
  logout: () => void
  error: string | null
  // Методы работы с Ethereum (заглушки)
  createKey: () => Promise<null>
  getUserKeys: () => Promise<null[]>
  signTx: (...args: any[]) => Promise<null>
  getBalance: (address: string) => Promise<string>
  ethereumKeys: null[]
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: false,
  loginWithCredentials: async () => false,
  loginWithGoogle: () => {},
  registerUser: async () => false,
  handleAuthCallback: async () => false,
  logout: () => {},
  error: null,
  createKey: async () => null,
  getUserKeys: async () => [],
  signTx: async () => null,
  getBalance: async () => '0',
  ethereumKeys: [],
})

export const useAuth = () => useContext(AuthContext)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('auth_user')
    return saved ? JSON.parse(saved) : null
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Логин через email/password
  const loginWithCredentials = useCallback(async (credentials: LoginCredentials) => {
    setIsLoading(true)
    setError(null)
    try {
      const userData = await login(credentials)
      const formatted: User = {
        id: userData.id,
        email: userData.email,
        displayName: userData.displayName,
        publicKey: userData.publicKey,
        picture: userData.picture,
      }
      setUser(formatted)
      localStorage.setItem('auth_user', JSON.stringify(formatted))
      setIsLoading(false)
      return true
    } catch (err: any) {
      setError(err.message || 'Login failed')
      setIsLoading(false)
      return false
    }
  }, [])

  // Google OAuth
  const loginWithGoogle = useCallback(() => {
    setIsLoading(true)
    setError(null)
    try {
      window.location.href = `${import.meta.env.VITE_AUTH_API_URL || 'http://localhost:5000'}/auth/google`
    } catch (err: any) {
      setError(err.message)
      setIsLoading(false)
    }
  }, [])

  // Обработка callback от OAuth
  const handleAuthCallback = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const userData = await getUserInfo()
      const formatted: User = {
        id: userData.id,
        email: userData.email,
        displayName: userData.displayName,
        publicKey: userData.publicKey,
        picture: userData.picture,
      }
      setUser(formatted)
      localStorage.setItem('auth_user', JSON.stringify(formatted))
      setIsLoading(false)
      return true
    } catch (err: any) {
      setError(err.message || 'Authentication failed')
      setIsLoading(false)
      return false
    }
  }, [])

  // Регистрация нового пользователя
  const registerUser = useCallback(async (credentials: LoginCredentials) => {
    setIsLoading(true)
    setError(null)
    try {
      const userData = await register(credentials)
      const formatted: User = {
        id: userData.id,
        email: userData.email,
        displayName: userData.displayName,
        publicKey: userData.publicKey,
        picture: userData.picture,
      }
      setUser(formatted)
      localStorage.setItem('auth_user', JSON.stringify(formatted))
      setIsLoading(false)
      return true
    } catch (err: any) {
      setError(err.message || 'Registration failed')
      setIsLoading(false)
      return false
    }
  }, [])

  // Выход
  const logout = useCallback(async () => {
    try {
      await logoutApi()
    } catch {
      console.error('Logout failed')
    }
    setUser(null)
    localStorage.removeItem('auth_user')
  }, [])

  // Заглушки для Ethereum-операций
  const createKey = useCallback(async () => null, [])
  const getUserKeys = useCallback(async () => [], [])
  const signTx = useCallback(async () => null, [])
  const getBalance = useCallback(async () => '', [])
  const ethereumKeys: null[] = []

  // При монтировании пробуем восстановить сессию через cookie
  useEffect(() => {
    if (!user) {
      handleAuthCallback()
    }
  }, [user, handleAuthCallback])

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        loginWithCredentials,
        loginWithGoogle,
        registerUser,
        handleAuthCallback,
        logout,
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
