'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/context/AuthContext'
import { useNavigate } from 'react-router-dom'
import { getUserInfo, getUserById } from '@/api/authApi'

/**
 * Callback page for handling authentication
 * Redirects user based on authentication status
 */
export const CallbackPage = () => {
  const { isLoading, error, logout } = useAuth()
  const navigate = useNavigate()
  const [loadingState, setLoadingState] = useState('Processing authentication...')

  useEffect(() => {
    const run = async () => {
      try {
        setLoadingState('Checking authentication...')

        // First try to get user info using cookies/tokens
        try {
          const userData = await getUserInfo()
          if (userData && userData.id) {
            // Successfully got user data, redirect to profile
            setLoadingState('Authentication successful! Redirecting...')
            navigate('/profile')
            return
          }
        } catch (err) {
          console.error('Error getting user info:', err)
          setLoadingState('Trying alternative authentication method...')
        }

        // If we're here, we need to try getting user by ID from URL
        const urlParams = new URLSearchParams(window.location.search)
        const userId = urlParams.get('userId')

        if (userId) {
          try {
            setLoadingState('Fetching user data...')
            const userData = await getUserById(userId)
            if (userData) {
              setLoadingState('User data retrieved! Redirecting...')
              navigate('/profile')
              return
            }
          } catch (err) {
            console.error('Error getting user by ID:', err)
            setLoadingState('Failed to retrieve user data')
          }
        }

        // If nothing worked, redirect to home
        setLoadingState('Authentication failed. Redirecting to login...')
        await logout()
        navigate('/')
      } catch (err) {
        console.error('Unhandled error in callback process:', err)
        // If there's an error — for example, cookie is invalid
        setLoadingState('Authentication error. Logging out...')
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
        <div className="text-center">
          <p className="mb-2 text-lg">{loadingState}</p>
          {isLoading && (
            <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600"></div>
          )}
        </div>
      )}
    </div>
  )
}
