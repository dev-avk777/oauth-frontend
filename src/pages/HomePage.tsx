'use client'

import { useState } from 'react'
import { useAuth } from '@/context/AuthContext'
import { FcGoogle } from 'react-icons/fc'
import { FaEthereum } from 'react-icons/fa'

export default function HomePage() {
  const { user, loginWithGoogle, loginWithCredentials, isLoading, error } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showLoginForm, setShowLoginForm] = useState(false)

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (email && password) {
      await loginWithCredentials({ email, password })
    }
  }

  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center space-y-6">
      <h1 className="text-3xl font-bold">Ethereum Key Vault</h1>

      {user ? (
        <div className="space-y-4 text-center">
          <p className="text-xl">You are logged in as {user.displayName || user.email}</p>
          {user.picture && (
            <img
              alt={user.displayName || user.email}
              className="mx-auto h-16 w-16 rounded-full"
              src={user.picture || '/placeholder.svg'}
            />
          )}
          <div className="mt-2 rounded-md bg-gray-100 p-2 text-sm">
            <p className="text-gray-500">Your Ethereum Address:</p>
            <p className="font-mono text-sm font-semibold">{user.publicKey}</p>
          </div>
        </div>
      ) : (
        <div className="space-y-6 text-center">
          <p className="text-xl">Please sign in to access your Ethereum keys</p>

          {/* Error message */}
          {error && (
            <div className="mx-auto max-w-md rounded-md bg-red-50 p-3 text-red-600">{error}</div>
          )}

          {/* Login Form */}
          {showLoginForm ? (
            <form className="mx-auto w-80 space-y-4" onSubmit={handleEmailLogin}>
              <div className="text-left">
                <label className="block text-sm font-medium text-gray-700" htmlFor="email">
                  Email
                </label>
                <input
                  required
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
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
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  id="password"
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                />
              </div>
              <div className="pt-2">
                <button
                  className="w-full rounded-md bg-blue-600 px-4 py-2 text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
                  disabled={isLoading}
                  type="submit"
                >
                  {isLoading ? 'Signing in...' : 'Sign in'}
                </button>
                <button
                  className="mt-2 text-sm text-blue-600 hover:text-blue-800"
                  type="button"
                  onClick={() => setShowLoginForm(false)}
                >
                  Back to options
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-3">
              <button
                className="flex w-60 items-center justify-center gap-2 rounded-md border border-gray-300 bg-white px-6 py-3 text-gray-800 shadow-md transition-all hover:shadow-lg"
                disabled={isLoading}
                onClick={loginWithGoogle}
              >
                <FcGoogle className="text-xl" />
                <span>Continue with Google</span>
              </button>

              <button
                className="flex w-60 items-center justify-center gap-2 rounded-md border border-gray-300 bg-white px-6 py-3 text-gray-800 shadow-md transition-all hover:shadow-lg"
                disabled={isLoading}
                onClick={() => setShowLoginForm(true)}
              >
                <FaEthereum className="text-xl text-blue-500" />
                <span>Sign in with Email</span>
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
