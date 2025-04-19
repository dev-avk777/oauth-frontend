// src/pages/CallbackPage.tsx
'use client'

import { useEffect } from 'react'
import { useAuth } from '@/context/AuthContext'
import { useNavigate } from 'react-router-dom'

export const CallbackPage = () => {
  const { handleAuthCallback, isLoading, error } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    const run = async () => {
      const success = await handleAuthCallback()
      if (success) {
        navigate('/profile')
      } else {
        navigate('/')
      }
    }
    run()
  }, [handleAuthCallback, navigate])

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
