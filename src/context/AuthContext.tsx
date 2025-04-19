'use client'

import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react'
import { login, register, getUserInfo, logoutApi } from '@/api/authApi'

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

interface AuthContextType {
  user: User | null
  isLoading: boolean
  loginWithCredentials: (credentials: LoginCredentials) => Promise<boolean>
  loginWithGoogle: () => void
  registerUser: (credentials: LoginCredentials) => Promise<boolean>
  logout: () => void
  error: string | null
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
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const loginWithCredentials = useCallback(async (credentials: LoginCredentials) => {
    setIsLoading(true)
    setError(null)
    try {
      const userData = await login(credentials)
      setUser(userData)
      return true
    } catch (err: any) {
      setError(err.message || 'Login failed')
      return false
    } finally {
      setIsLoading(false)
    }
  }, [])

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

  const registerUser = useCallback(async (credentials: LoginCredentials) => {
    setIsLoading(true)
    setError(null)
    try {
      const userData = await register(credentials)
      setUser(userData)
      return true
    } catch (err: any) {
      setError(err.message || 'Registration failed')
      return false
    } finally {
      setIsLoading(false)
    }
  }, [])

  const logout = useCallback(async () => {
    try {
      await logoutApi()
    } catch {
      console.error('Logout failed')
    }
    setUser(null)
  }, [])

  const createKey = useCallback(async () => null, [])
  const getUserKeys = useCallback(async () => [], [])
  const signTx = useCallback(async () => null, [])
  const getBalance = useCallback(async () => '', [])
  const ethereumKeys: null[] = []

  useEffect(() => {
    getUserInfo()
      .then(setUser)
      .catch(() => setUser(null))
  }, [])

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        loginWithCredentials,
        loginWithGoogle,
        registerUser,
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
