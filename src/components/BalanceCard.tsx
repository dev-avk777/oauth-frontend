import React from 'react'
import type { SubstrateBalance } from '../api/substrateApi'
import type { Status } from '../hooks/useBalanceWebSocket'
import { FaEthereum } from 'react-icons/fa'
import { formatBalance } from '@polkadot/util'

interface Props {
  current: SubstrateBalance | null
  history: SubstrateBalance[]
  status: Status
  tokenId?: string
  decimals?: number
}

export const BalanceCard: React.FC<Props> = ({
  current,
  history,
  status,
  tokenId = 'OPAL',
  decimals = 12,
}) => {
  const statusColors = {
    online: 'bg-green-500',
    reconnecting: 'bg-yellow-400 animate-pulse',
    error: 'bg-red-500',
  }

  if (!current) {
    return (
      <div className="rounded-lg bg-white p-4 shadow">
        <h2 className="mb-2 text-xl font-semibold">Wallet Balance</h2>
        <div className="flex items-center justify-between">
          <span className="text-gray-500">Loading...</span>
          <div className={`h-3 w-3 rounded-full ${statusColors[status]}`} />
        </div>
      </div>
    )
  }

  return (
    <div className="rounded-lg bg-white p-4 shadow">
      <h2 className="mb-2 text-xl font-semibold">Wallet Balance</h2>
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <FaEthereum className="mr-2 text-blue-500" />
          <span className="text-3xl font-bold">
            {formatBalance(current.balance, { decimals, withUnit: false, forceUnit: tokenId })}
          </span>
        </div>
        <div className={`h-3 w-3 rounded-full ${statusColors[status]}`} />
      </div>

      {current.blockNumber && (
        <p className="mt-2 text-sm text-gray-600">
          Last update: Block #{current.blockNumber}
          {current.timestamp && `, ${new Date(current.timestamp).toLocaleString()}`}
        </p>
      )}

      {history.length > 0 && (
        <div className="mt-4 max-h-48 overflow-y-auto">
          <h3 className="mb-2 text-sm font-semibold text-gray-600">Balance History</h3>
          {history.map((item, i) => (
            <div
              key={i}
              className="flex justify-between border-t border-gray-100 py-1 text-sm text-gray-600"
            >
              <span>
                {formatBalance(item.balance, { decimals, withUnit: false, forceUnit: tokenId })}
              </span>
              {item.blockNumber && <span>#{item.blockNumber}</span>}
              {item.timestamp && <span>{new Date(item.timestamp).toLocaleTimeString()}</span>}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
