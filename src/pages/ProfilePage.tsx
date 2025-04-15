'use client'

import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { FaEthereum, FaCopy } from 'react-icons/fa'

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

  const copyToClipboard = (text: string) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        alert('Ethereum address copied to clipboard!')
      })
      .catch(err => {
        console.error('Failed to copy: ', err)
      })
  }

  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center space-y-8">
      <h1 className="text-3xl font-bold">Ethereum Key Vault</h1>
      <div className="w-full max-w-md space-y-6 rounded-lg bg-white p-8 shadow-lg">
        <div className="text-center">
          <p className="text-2xl font-semibold">
            Welcome, {user.displayName || user.email.split('@')[0]}!
          </p>
          <p className="mt-1 text-gray-500">{user.email}</p>
          {user.picture && (
            <img
              alt={user.displayName || user.email}
              className="mx-auto mt-4 h-20 w-20 rounded-full"
              src={user.picture || '/placeholder.svg'}
            />
          )}
        </div>

        <div className="mt-6 space-y-4">
          <h2 className="flex items-center text-xl font-semibold">
            <FaEthereum className="mr-2 text-blue-500" />
            Your Ethereum Keys
          </h2>

          <div className="rounded-md bg-gray-50 p-4">
            <p className="mb-1 text-sm text-gray-500">Public Address:</p>
            <div className="flex items-center justify-between">
              <code className="block overflow-hidden overflow-ellipsis font-mono text-sm">
                {user.publicKey}
              </code>
              <button
                className="ml-2 rounded-full p-1.5 text-gray-500 hover:bg-gray-200 hover:text-gray-700"
                title="Copy to clipboard"
                onClick={() => copyToClipboard(user.publicKey)}
              >
                <FaCopy />
              </button>
            </div>
          </div>

          <p className="text-sm text-gray-500">
            Your private key is securely stored in the Ethereum Key Vault. You can use this public
            address for receiving funds or interacting with Ethereum applications.
          </p>
        </div>

        <div className="mt-6 flex justify-center">
          <button
            className="rounded-md bg-red-500 px-6 py-2 text-white transition-colors hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
            onClick={logout}
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  )
}
