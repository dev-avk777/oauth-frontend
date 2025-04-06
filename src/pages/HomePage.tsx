'use client'

import { useAuth } from '@/context/AuthContext'
import { FcGoogle } from 'react-icons/fc'

export default function HomePage() {
  const { user, login } = useAuth()

  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center space-y-6">
      <h1 className="text-3xl font-bold">Welcome to OAuth Demo</h1>

      {user ? (
        <div className="space-y-4 text-center">
          <p className="text-xl">You are logged in as {user.name}</p>
          <img
            alt={user.name}
            className="mx-auto h-16 w-16 rounded-full"
            src={user.picture || '/placeholder.svg'}
          />
        </div>
      ) : (
        <div className="space-y-4 text-center">
          <p className="text-xl">Please sign in to continue</p>
          <button
            className="flex items-center justify-center gap-2 rounded-md border border-gray-300 bg-white px-6 py-3 text-gray-800 shadow-md transition-all hover:shadow-lg"
            onClick={login}
          >
            <FcGoogle className="text-xl" />
            <span>Sign in with Google</span>
          </button>
        </div>
      )}
    </div>
  )
}
