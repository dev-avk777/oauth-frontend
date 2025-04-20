'use client'

import { useEffect } from 'react'
import { useAuth } from '@/context/AuthContext'
import { useNavigate } from 'react-router-dom'
import { getUserInfo } from '@/api/authApi'

/**
 * Callback page for handling authentication
 * Redirects user based on authentication status
 */
export const CallbackPage = () => {
  const { isLoading, error, logout } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    const run = async () => {
      try {
        const userData = await getUserInfo()
        // If everything is okay — redirect
        if (userData) {
          navigate('/profile')
        } else {
          navigate('/')
        }
      } catch {
        // If there's an error — for example, cookie is invalid
        await logout()
        navigate('/')
      }
    }
    run()
  }, [navigate, logout])

  return (
    <div className="flex min-h-[70vh] items-center justify-center">
      {error ? (
        <div className="bg-red-100 p-4 text-red-700">{error}</div>
      ) : (
        <p>{isLoading ? 'Processing authentication...' : 'Redirecting...'}</p>
      )}
    </div>
  )
}
