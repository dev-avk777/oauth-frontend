'use client'

import { useState } from 'react'
import { useAuth } from '@/context/AuthContext'
import { FcGoogle } from 'react-icons/fc'

export default function HomePage() {
  const { user, loginWithCredentials, loginWithGoogle, isLoading, error, registerUser } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isRegistering, setIsRegistering] = useState(false)

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (email && password) {
      await loginWithCredentials({ email, password })
    }
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    if (email && password) {
      await registerUser({ email, password })
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
          <p className="text-xl">Please sign in or register to access your Ethereum keys</p>

          {/* Error message */}
          {error && (
            <div className="mx-auto max-w-md rounded-md bg-red-50 p-3 text-red-600">{error}</div>
          )}

          {isRegistering ? (
            <form className="mx-auto w-80 space-y-4" onSubmit={handleRegister}>
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
              <div className="pt-2">
                <button
                  className="w-full rounded-md bg-green-600 px-4 py-2 text-white shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50"
                  disabled={isLoading}
                  type="submit"
                >
                  {isLoading ? 'Registering...' : 'Register'}
                </button>
                <button
                  className="mt-2 text-sm text-blue-600 hover:underline"
                  type="button"
                  onClick={() => setIsRegistering(false)}
                >
                  Already have an account? Sign in
                </button>
              </div>
            </form>
          ) : (
            <div>
              <form className="mx-auto w-80 space-y-4" onSubmit={handleEmailLogin}>
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
                <div className="pt-2">
                  <button
                    className="w-full rounded-md bg-blue-600 px-4 py-2 text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
                    disabled={isLoading}
                    type="submit"
                  >
                    {isLoading ? 'Signing in...' : 'Sign in'}
                  </button>
                  <button
                    className="mt-2 text-sm text-blue-600 hover:underline"
                    type="button"
                    onClick={() => setIsRegistering(true)}
                  >
                    Do not have an account? Register
                  </button>
                </div>
              </form>

              <div className="mx-auto w-80">
                <div className="relative my-4">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="bg-white px-2 text-gray-500">Or continue with</span>
                  </div>
                </div>

                <button
                  className="flex w-full items-center justify-center gap-2 rounded-md border border-gray-300 bg-white px-4 py-2 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  disabled={isLoading}
                  onClick={loginWithGoogle}
                >
                  <FcGoogle className="h-5 w-5" />
                  <span>Sign in with Google</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
