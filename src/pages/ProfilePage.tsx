'use client'

import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'

export default function ProfilePage() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (!user) {
      navigate('/')
    }
  }, [user, navigate])

  if (!user) {
    return null
  }

  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center space-y-6">
      <h1 className="text-3xl font-bold">Profile Page</h1>
      <div className="space-y-4 text-center">
        <p className="text-xl">Welcome, {user.name}!</p>
        <p>This is your profile page that only you can see when authenticated.</p>
        <img
          alt={user.name}
          className="mx-auto h-16 w-16 rounded-full"
          src={user.picture || '/placeholder.svg'}
        />
        <div className="mt-6">
          <button
            className="rounded-md bg-red-500 px-6 py-2 text-white transition-colors hover:bg-red-600"
            onClick={logout}
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  )
}
