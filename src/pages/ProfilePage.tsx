'use client'

import { useAuth } from '@/context/AuthContext'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export default function ProfilePage() {
  const { user, logout /* createKey, getUserKeys, signTx, getBalance, ethereumKeys */ } = useAuth()
  const navigate = useNavigate()
  // const [showCreateKey, setShowCreateKey] = useState(false)
  // const [showSignTx, setShowSignTx] = useState(false)
  // const [selectedKeyId, setSelectedKeyId] = useState('')
  // const [balances, setBalances] = useState<Record<string, string>>({})
  // const [txData, setTxData] = useState({ to: '', value: '' })
  // const [signedTx, setSignedTx] = useState<string | null>(null)
  // const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!user) {
      navigate('/')
    }
    // TODO: when backend ready, load keys:
    // getUserKeys().then(keys => {/* set state */})
  }, [user, navigate /*, getUserKeys */])

  // TODO: stubbed until backend implements:
  // const fetchBalances = async (keys: any[]) => { /* ... */ }
  // const handleCreateKey = async () => { /* createKey(); ... */ }
  // const handleSignTransaction = async (e: React.FormEvent) => { /* ... */ }
  // const copyToClipboard = (text: string) => {navigator.clipboard.writeText(text)}
  console.log(user)
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
          <p className="mt-1 text-gray-500">{user.publicKey}</p>
          {user.picture && (
            <img
              alt={user.displayName || user.email}
              className="mx-auto mt-4 h-20 w-20 rounded-full"
              src={user.picture}
            />
          )}
        </div>

        {/* Ethereum keys section (commented until backend ready)
        <div className="mt-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="flex items-center text-xl font-semibold">
              <FaEthereum className="mr-2 text-blue-500" /> Your Ethereum Keys
            </h2>
            <button
              onClick={() => setShowCreateKey(true)}
              className="flex items-center rounded-full bg-blue-100 p-1.5 text-blue-600 hover:bg-blue-200"
            >
              <FaPlus />
            </button>
          </div>
          {loading ? (
            <div>Loading keys...</div>
          ) : (
            <div>
              {ethereumKeys.length === 0 ? (
                <div>You don't have any Ethereum keys yet.</div>
              ) : (
                ethereumKeys.map(key => (
                  <div key={key.id} className="p-4 border rounded">
                    <p>Key: {key.id.slice(0, 8)}...</p>
                    <p>Address: {key.address}</p>
                    <p>Balance: {balances[key.address] || '0'} ETH</p>
                    <button onClick={() => { setSelectedKeyId(key.id); setShowSignTx(true) }}>
                      <FaSignature /> Sign
                    </button>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
        */}

        <div className="mt-6 flex justify-center">
          <button
            className="rounded-md bg-red-500 px-6 py-2 text-white hover:bg-red-600"
            onClick={logout}
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  )
}
