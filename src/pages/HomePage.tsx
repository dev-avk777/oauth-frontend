'use client'

import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { FcGoogle } from 'react-icons/fc'

// Home page component for login and registration
export default function HomePage() {
  const { user, loginWithCredentials, registerUser, loginWithGoogle, isLoading, error } = useAuth()
  const navigate = useNavigate()

  // Mode: "login" or "register"
  const [mode, setMode] = useState<'login' | 'register'>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  // ❶ Переносим редирект в эффект
  useEffect(() => {
    if (user) {
      navigate('/profile')
    }
  }, [user, navigate])

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    const success = await loginWithCredentials({ email, password })
    if (success) {
      await new Promise(resolve => setTimeout(resolve, 100)) // delay for 100ms
      navigate('/profile')
    }
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    const success = await registerUser({ email, password })
    if (success) {
      await new Promise(resolve => setTimeout(resolve, 100)) // delay for 100ms
      navigate('/profile')
    }
  }

  // Убираем редирект из рендеринга
  if (user) {
    return null
  }

  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center space-y-6">
      <h1 className="text-3xl font-bold">Ethereum Key Vault</h1>

      {/* Mode switcher */}
      <div className="flex space-x-4">
        <button
          className={`rounded px-4 py-2 ${mode === 'login' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
          onClick={() => setMode('login')}
        >
          Sign In
        </button>
        <button
          className={`rounded px-4 py-2 ${mode === 'register' ? 'bg-green-600 text-white' : 'bg-gray-200'}`}
          onClick={() => setMode('register')}
        >
          Register
        </button>
      </div>

      {/* Form for login or registration */}
      <form
        className="mx-auto w-80 space-y-4"
        onSubmit={mode === 'login' ? handleEmailLogin : handleRegister}
      >
        <div className="text-left">
          <label className="block text-sm font-medium text-gray-700" htmlFor="email">
            Email
          </label>
          <input
            required
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            id="email"
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
        </div>
        <div className="text-left">
          <label className="block text-sm font-medium text-gray-700" htmlFor="password">
            Password
          </label>
          <input
            required
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            id="password"
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
        </div>
        {error && <div className="text-red-600">{error}</div>}
        <button
          className={`w-full rounded-md px-4 py-2 text-white ${
            mode === 'login' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-green-600 hover:bg-green-700'
          } focus:outline-none focus:ring-2 focus:ring-offset-2 ${
            mode === 'login' ? 'focus:ring-blue-500' : 'focus:ring-green-500'
          } disabled:opacity-50`}
          disabled={isLoading}
          type="submit"
        >
          {isLoading
            ? mode === 'login'
              ? 'Signing in...'
              : 'Registering...'
            : mode === 'login'
              ? 'Sign In'
              : 'Register'}
        </button>
      </form>

      {/* Divider and Google OAuth */}
      <div className="relative my-4 w-80 text-center">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300"></div>
        </div>
        <span className="relative bg-white px-2 text-gray-500">Or continue with</span>
      </div>
      <button
        className="flex items-center gap-2 rounded-md border border-gray-300 bg-white px-4 py-2 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
        disabled={isLoading}
        onClick={loginWithGoogle}
      >
        <FcGoogle className="h-5 w-5" />
        <span>Sign in with Google</span>
      </button>
    </div>
  )
}
