'use client'

import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { FaEthereum, FaCopy, FaPlus, FaKey, FaSignature } from 'react-icons/fa'

type TransactionData = {
  to: string
  value: string
  data?: string
}

export default function ProfilePage() {
  const { user, logout, ethereumKeys, getUserKeys, createKey, signTx, getBalance } = useAuth()
  const navigate = useNavigate()
  const [showCreateKey, setShowCreateKey] = useState(false)
  const [showSignTx, setShowSignTx] = useState(false)
  const [selectedKeyId, setSelectedKeyId] = useState('')
  const [balances, setBalances] = useState<Record<string, string>>({})
  const [txData, setTxData] = useState<TransactionData>({ to: '', value: '' })
  const [signedTx, setSignedTx] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const fetchUserKeys = async () => {
    try {
      setLoading(true)
      const keys = await getUserKeys()
      await fetchBalances(keys)
      setLoading(false)
    } catch (error) {
      console.error('Error fetching keys:', error)
      setLoading(false)
    }
  }
  useEffect(() => {
    if (!user) {
      navigate('/')
    } else {
      fetchUserKeys()
    }
  }, [user, navigate, fetchUserKeys])

  const fetchBalances = async (keys: Record<string, unknown>[]) => {
    const balanceObj: Record<string, string> = {}
    for (const key of keys) {
      try {
        const balance = await getBalance(key.address as string)
        balanceObj[key.address as string] = balance
      } catch (error) {
        console.error(`Error fetching balance for ${key.address}:`, error)
        balanceObj[key.address as string] = 'Error'
      }
    }
    setBalances(balanceObj)
  }

  const handleCreateKey = async () => {
    try {
      setLoading(true)
      await createKey()
      setShowCreateKey(false)
      setLoading(false)
    } catch (error) {
      console.error('Error creating key:', error)
      setLoading(false)
    }
  }

  const handleSignTransaction = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedKeyId || !txData.to || !txData.value) {
      return
    }

    try {
      setLoading(true)
      const result = await signTx(selectedKeyId, {
        to: txData.to,
        value: txData.value,
        data: txData.data,
      })
      const signedTransaction = result.signedTransaction as string
      setSignedTx(signedTransaction)
      setLoading(false)
    } catch (error) {
      console.error('Error signing transaction:', error)
      setLoading(false)
    }
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

  if (!user) {
    return null
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
          <div className="flex items-center justify-between">
            <h2 className="flex items-center text-xl font-semibold">
              <FaEthereum className="mr-2 text-blue-500" />
              Your Ethereum Keys
            </h2>
            <button
              className="flex items-center rounded-full bg-blue-100 p-1.5 text-blue-600 hover:bg-blue-200"
              title="Create new key"
              onClick={() => setShowCreateKey(true)}
            >
              <FaPlus />
            </button>
          </div>

          {loading ? (
            <div className="flex justify-center py-4">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-b-transparent border-l-transparent border-r-transparent border-t-blue-500"></div>
            </div>
          ) : (
            <div>
              {ethereumKeys.length === 0 ? (
                <div className="rounded-md bg-gray-50 p-4 text-center">
                  <p>You don&apos;t have any Ethereum keys yet.</p>
                  <button
                    className="mt-2 rounded-md bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700"
                    onClick={() => setShowCreateKey(true)}
                  >
                    Create your first key
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {ethereumKeys.map(key => (
                    <div key={key.id} className="rounded-md bg-gray-50 p-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="mb-1.5 flex items-center">
                            <FaKey className="mr-2 text-gray-500" />
                            <p className="text-sm font-medium text-gray-700">
                              Key: {key.id.slice(0, 8)}...
                            </p>
                          </div>
                          <div className="flex items-center justify-between">
                            <code className="block max-w-[240px] overflow-hidden overflow-ellipsis font-mono text-xs text-gray-600">
                              {key.address}
                            </code>
                            <button
                              className="ml-2 rounded-full p-1 text-gray-500 hover:bg-gray-200 hover:text-gray-700"
                              title="Copy address"
                              onClick={() => copyToClipboard(key.address)}
                            >
                              <FaCopy className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </div>
                        <button
                          className="rounded-md bg-green-100 px-2 py-1 text-xs text-green-700 hover:bg-green-200"
                          title="Sign transaction"
                          onClick={() => {
                            setSelectedKeyId(key.id)
                            setShowSignTx(true)
                          }}
                        >
                          <FaSignature className="h-4 w-4" />
                        </button>
                      </div>
                      <div className="mt-2 flex items-center justify-between border-t border-gray-200 pt-2 text-xs">
                        <span className="text-gray-500">
                          Created: {new Date(key.createdAt).toLocaleDateString()}
                        </span>
                        <span className="font-semibold text-blue-600">
                          Balance: {balances[key.address] || '0'} ETH
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {showCreateKey && (
            <div className="fixed inset-0 z-10 flex items-center justify-center bg-black bg-opacity-50">
              <div className="w-[320px] rounded-lg bg-white p-6 shadow-xl">
                <h3 className="mb-4 text-lg font-semibold">Create New Ethereum Key</h3>
                <p className="mb-4 text-sm text-gray-600">
                  This will generate a new Ethereum key that will be securely stored in the Ethereum
                  Key Vault. You can use this key to sign transactions and interact with Ethereum
                  applications.
                </p>
                <div className="flex justify-end space-x-2">
                  <button
                    className="rounded-md border border-gray-300 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    disabled={loading}
                    onClick={() => setShowCreateKey(false)}
                  >
                    Cancel
                  </button>
                  <button
                    className="rounded-md bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700"
                    disabled={loading}
                    onClick={handleCreateKey}
                  >
                    {loading ? 'Creating...' : 'Create Key'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {showSignTx && (
            <div className="fixed inset-0 z-10 flex items-center justify-center bg-black bg-opacity-50">
              <div className="w-[400px] rounded-lg bg-white p-6 shadow-xl">
                <h3 className="mb-4 text-lg font-semibold">Sign Transaction</h3>
                {signedTx ? (
                  <div className="space-y-4">
                    <p className="text-sm text-green-600">Transaction successfully signed!</p>
                    <div className="rounded-md bg-gray-50 p-3">
                      <p className="text-xs text-gray-700">Signed Transaction:</p>
                      <div className="flex items-center justify-between">
                        <code className="mt-1 block max-h-[100px] w-full overflow-auto text-wrap break-all font-mono text-xs text-gray-600">
                          {signedTx}
                        </code>
                        <button
                          className="ml-2 flex-shrink-0 rounded-full p-1 text-gray-500 hover:bg-gray-200 hover:text-gray-700"
                          onClick={() => copyToClipboard(signedTx)}
                        >
                          <FaCopy />
                        </button>
                      </div>
                    </div>
                    <div className="flex justify-end">
                      <button
                        className="rounded-md bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700"
                        onClick={() => {
                          setShowSignTx(false)
                          setSignedTx(null)
                          setTxData({ to: '', value: '' })
                        }}
                      >
                        Close
                      </button>
                    </div>
                  </div>
                ) : (
                  <form className="space-y-4" onSubmit={handleSignTransaction}>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Recipient Address
                      </label>
                      <input
                        required
                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        placeholder="0x..."
                        type="text"
                        value={txData.to}
                        onChange={e => setTxData({ ...txData, to: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Amount (ETH)
                      </label>
                      <input
                        required
                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        placeholder="0.01"
                        type="text"
                        value={txData.value}
                        onChange={e => setTxData({ ...txData, value: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Data (Optional)
                      </label>
                      <input
                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        placeholder="0x..."
                        type="text"
                        value={txData.data || ''}
                        onChange={e => setTxData({ ...txData, data: e.target.value })}
                      />
                    </div>
                    <div className="flex justify-end space-x-2">
                      <button
                        className="rounded-md border border-gray-300 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                        disabled={loading}
                        type="button"
                        onClick={() => setShowSignTx(false)}
                      >
                        Cancel
                      </button>
                      <button
                        className="rounded-md bg-green-600 px-4 py-2 text-sm text-white hover:bg-green-700"
                        disabled={loading}
                        type="submit"
                      >
                        {loading ? 'Signing...' : 'Sign Transaction'}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          )}

          <p className="text-sm text-gray-500">
            Your private keys are securely stored in the Ethereum Key Vault and never exposed to the
            browser.
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
