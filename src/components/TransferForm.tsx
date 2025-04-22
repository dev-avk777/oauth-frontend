import { useState } from 'react'
import { ethers } from 'ethers'

const networks = [
  {
    id: 'opal',
    name: 'Opal Network',
    rpcUrl: 'https://rpc-opal.unique.network',
    nativeToken: 'UNQ',
  },
  {
    id: 'sepolia',
    name: 'Ethereum Sepolia',
    rpcUrl: 'https://rpc.sepolia.org',
    nativeToken: 'ETH',
  },
]

export const TransferForm = () => {
  const [network, setNetwork] = useState(networks[0])
  const [recipient, setRecipient] = useState('')
  const [amount, setAmount] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isTransferred, setIsTransferred] = useState(false)
  const [txHash, setTxHash] = useState('')
  const [error, setError] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleTransfer = async () => {
    if (!recipient || !amount) {
      setError('Fill all fields')
      return
    }
    setIsLoading(true)
    setError('')
    setTxHash('')

    try {
      const rawKey = import.meta.env.VITE_PRIVATE_KEY?.trim()
      if (!rawKey || !ethers.isHexString(rawKey, 32)) {
        throw new Error('Invalid private key')
      }

      const provider = new ethers.JsonRpcProvider(network.rpcUrl)
      const wallet = new ethers.Wallet(rawKey, provider)
      const to = ethers.getAddress(recipient.trim())
      const value = ethers.parseEther(amount)

      const balanceBN = await provider.getBalance(wallet.address)
      const gas = await provider.estimateGas({ to, value })
      const feeData = await provider.getFeeData()
      const gasPrice = feeData.gasPrice ?? 0n
      const cost = gas * gasPrice + value

      if (balanceBN < cost) {
        throw new Error(
          `Not enough funds (have ${ethers.formatEther(balanceBN)}, need ${ethers.formatEther(cost)})`
        )
      }

      const tx = await wallet.sendTransaction({ to, value })
      setTxHash(tx.hash)
      await tx.wait()
      setIsTransferred(true)
      setTimeout(() => setIsTransferred(false), 3000)
    } catch (e: any) {
      setError(e.message || 'Transaction failed')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <button
        className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
        onClick={() => setIsModalOpen(true)}
      >
        Transfer Tokens
      </button>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
            <h2 className="mb-4 text-xl font-bold">Transfer {network.nativeToken}</h2>
            <p className="mb-6 text-gray-600">Send native tokens to another address</p>

            <div className="space-y-4">
              <div>
                <label className="mb-1 block font-medium">Network</label>
                <select
                  className="w-full rounded-md border p-2"
                  value={network.id}
                  onChange={e => {
                    const selected = networks.find(n => n.id === e.target.value)
                    if (selected) {
                      setNetwork(selected)
                    }
                  }}
                >
                  {networks.map(net => (
                    <option key={net.id} value={net.id}>
                      {net.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-1 block font-medium">Recipient Address</label>
                <input
                  className="w-full rounded-md border p-2"
                  placeholder="0x..."
                  type="text"
                  value={recipient}
                  onChange={e => setRecipient(e.target.value)}
                />
              </div>

              <div>
                <label className="mb-1 block font-medium">Amount ({network.nativeToken})</label>
                <input
                  className="w-full rounded-md border p-2"
                  placeholder="0.01"
                  type="text"
                  value={amount}
                  onChange={e => setAmount(e.target.value)}
                />
              </div>
            </div>

            {error && <div className="mt-4 text-red-500">{error}</div>}

            {txHash && <div className="mt-4 break-all text-sm">Transaction: {txHash}</div>}

            <div className="mt-6 flex justify-end space-x-3">
              <button
                className="rounded-md bg-gray-200 px-4 py-2 hover:bg-gray-300"
                onClick={() => setIsModalOpen(false)}
              >
                Cancel
              </button>
              <button
                className={`rounded-md px-4 py-2 text-white ${
                  isTransferred
                    ? 'bg-green-500'
                    : isLoading
                      ? 'bg-blue-400'
                      : 'bg-blue-600 hover:bg-blue-700'
                }`}
                disabled={isLoading}
                onClick={handleTransfer}
              >
                {isTransferred ? 'Transferred' : isLoading ? 'Processing...' : 'Transfer'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
