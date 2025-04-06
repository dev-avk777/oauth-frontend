'use client'

import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'

export default function CallbackPage() {
  const { handleAuthCallback, isLoading } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    const processAuth = async () => {
      const success = await handleAuthCallback()
      if (success) {
        navigate('/profile')
      } else {
        navigate('/')
      }
    }

    processAuth()
  }, [handleAuthCallback, navigate])

  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center">
      <h1 className="mb-4 text-2xl font-semibold">Processing authentication...</h1>
      {isLoading && (
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-b-transparent border-l-transparent border-r-transparent border-t-blue-500"></div>
      )}
    </div>
  )
}
