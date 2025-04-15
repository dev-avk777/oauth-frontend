'use client'

import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'

export default function CallbackPage() {
  const { handleAuthCallback, isLoading, error } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    const processAuth = async () => {
      try {
        const success = await handleAuthCallback()
        if (success) {
          navigate('/profile')
        } else {
          // If handleAuthCallback returned false but no error was set,
          // we'll redirect to the home page
          navigate('/')
        }
      } catch (err) {
        // If an unexpected error occurs during authentication,
        // we'll still redirect to the home page
        console.error('Unexpected authentication error:', err)
        navigate('/')
      }
    }

    processAuth()
  }, [handleAuthCallback, navigate, error])

  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center">
      <h1 className="mb-4 text-2xl font-semibold">
        {error ? 'Authentication Error' : 'Processing authentication...'}
      </h1>

      {error ? (
        <div className="max-w-md rounded-md bg-red-50 p-4 text-red-600">
          <p>{error}</p>
          <button
            className="mt-4 rounded-md bg-red-600 px-4 py-2 text-white hover:bg-red-700"
            onClick={() => navigate('/')}
          >
            Return to Login
          </button>
        </div>
      ) : isLoading ? (
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-b-transparent border-l-transparent border-r-transparent border-t-blue-500"></div>
      ) : (
        <p>Redirecting you to your profile...</p>
      )}
    </div>
  )
}
