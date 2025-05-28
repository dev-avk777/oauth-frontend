'use client'

import Opal from '@/assets/components/Opal'
import { useAuth } from '@/context/AuthContext'
import { useEffect, useState } from 'react'
import { FaCheck, FaCopy } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'
import { getInitialBalance, getSubstrateConfig, type SubstrateBalance } from '../api/substrateApi'
import { BalanceCard } from '../components/BalanceCard'
import { TransferForm } from '../components/TransferForm'
import { useBalanceWebSocket } from '../hooks/useBalanceWebSocket'

export default function ProfilePage() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [copySuccess, setCopySuccess] = useState(false)
  const [initial, setInitial] = useState<SubstrateBalance | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // WebSocket balance subscription
  const { current, history, status, tokenSymbol, decimals } = useBalanceWebSocket(user?.publicKey)

  useEffect(() => {
    if (!user) {
      navigate('/')
      return
    }

    const loadData = async () => {
      try {
        // загружаем конфиг только локально
        const cfg = await getSubstrateConfig()

        // загружаем начальный баланс и приводим в планки
        const bal = await getInitialBalance()
        const plancks = cfg.useBalances
          ? BigInt(Math.round(parseFloat(bal.balance) * 10 ** cfg.decimals))
          : BigInt(bal.balance)

        setInitial({
          balance: plancks.toString(),
          blockNumber: bal.blockNumber,
          timestamp: bal.timestamp,
        })
      } catch (error) {
        console.error('Failed to load initial data:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [user, navigate])

  // Function to copy Ethereum address to clipboard
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopySuccess(true)
    setTimeout(() => setCopySuccess(false), 2000)
  }

  if (!user) {
    return null
  }

  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center space-y-8">
      <h1 className="text-3xl font-bold">Substrate Key Vault</h1>
      <div className="w-full max-w-md space-y-6 rounded-lg bg-white p-8 shadow-lg">
        <div className="text-center">
          <p className="text-2xl font-semibold">
            Welcome, {user.displayName || user.email.split('@')[0]}!
          </p>
          <p className="mt-1 text-gray-500">{user.email}</p>

          {/* Display Ethereum Address with copy button if available */}
          {user.publicKey && (
            <div className="mt-3 flex items-center justify-center space-x-2">
              <div className="flex items-center rounded-lg bg-blue-50 px-3 py-1.5">
                {/* <FaEthereum className="mr-2 text-blue-500" /> */}
                <Opal height={20} width={20} />
                <span className="ml-1 font-mono text-sm" title={user.publicKey}>
                  {user.publicKey.slice(0, 6)}...{user.publicKey.slice(-4)}
                </span>
              </div>
              <button
                className="rounded-full bg-gray-100 p-1.5 text-gray-500 transition hover:bg-gray-200"
                title="Copy Ethereum address"
                onClick={() => copyToClipboard(user.publicKey)}
              >
                {copySuccess ? <FaCheck className="text-green-500" /> : <FaCopy />}
              </button>
            </div>
          )}

          {/* Display message if publicKey is not available */}
          {!user.publicKey && (
            <div className="mt-3 text-sm text-orange-500">
              No Ethereum address available for this account.
            </div>
          )}

          {user.picture && (
            <img
              alt={user.displayName || user.email}
              className="mx-auto mt-4 h-20 w-20 rounded-full"
              src={user.picture}
            />
          )}
        </div>

        {/* User account type indicator */}
        <div className="mt-3 text-center">
          <span className="rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-600">
            {user.picture ? 'Google Account' : 'Email Account'}
          </span>
        </div>

        {/* Balance Card */}
        {isLoading ? (
          <div className="text-center">Loading balance...</div>
        ) : (
          user.publicKey && (
            <div className="mt-6 space-y-6">
              <BalanceCard
                current={current ?? initial}
                decimals={decimals}
                history={history}
                status={status}
                tokenId={tokenSymbol}
              />

              {/* Transfer Form */}
              <TransferForm
                decimals={decimals}
                maxBalance={BigInt(current?.balance || initial?.balance || '0')}
                tokenSymbol={tokenSymbol || 'OPAL'}
                onSuccess={() => {
                  // Refresh balance after successful transfer
                  setIsLoading(true)
                  getInitialBalance()
                    .then(bal => {
                      const plancks = decimals
                        ? BigInt(Math.round(parseFloat(bal.balance) * 10 ** decimals))
                        : BigInt(bal.balance)
                      setInitial({
                        balance: plancks.toString(),
                        blockNumber: bal.blockNumber,
                        timestamp: bal.timestamp,
                      })
                    })
                    .finally(() => setIsLoading(false))
                }}
              />
            </div>
          )
        )}

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
