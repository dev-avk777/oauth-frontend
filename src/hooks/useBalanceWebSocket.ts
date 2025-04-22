import { useEffect, useState, useRef } from 'react'
import { ethers } from 'ethers'

export function useBalanceWebSocket(address: string, network = 'opal') {
  const [balance, setBalance] = useState<string>('0')
  const [blockNumber, setBlockNumber] = useState<number>(0)
  const [error, setError] = useState<string | null>(null)
  const [isConnected, setIsConnected] = useState(false)

  const providerRef = useRef<ethers.WebSocketProvider | null>(null)
  const attempts = useRef(0)
  const maxAttempts = 5

  const connectWebSocket = async () => {
    if (!address || attempts.current >= maxAttempts) {
      return
    }

    try {
      const url =
        network === 'opal'
          ? 'wss://ws-opal.unique.network'
          : 'wss://sepolia.infura.io/ws/v3/YOUR_INFURA_KEY'

      if (providerRef.current) {
        providerRef.current.removeAllListeners()

        providerRef.current.websocket?.close()
        providerRef.current = null
      }

      const provider = new ethers.WebSocketProvider(url)
      providerRef.current = provider

      setError(null)
      setIsConnected(true)
      attempts.current = 0

      const balance = await provider.getBalance(address)
      setBalance(ethers.formatEther(balance))

      provider.on('block', async (blockNum: number) => {
        try {
          const balance = await provider.getBalance(address)
          setBalance(ethers.formatEther(balance))
          setBlockNumber(blockNum)
        } catch (err) {
          console.error('Ошибка обновления баланса:', err)
        }
      })

      provider.on('error', () => {
        setError('Connection error')
        setIsConnected(false)
        reconnect()
      })
    } catch {
      setError('Failed to connect')
      setIsConnected(false)
      reconnect()
    }
  }

  const reconnect = () => {
    if (attempts.current < maxAttempts) {
      attempts.current += 1
      setTimeout(connectWebSocket, Math.min(1000 * attempts.current, 5000))
    } else {
      setError('Max reconnection attempts reached')
    }
  }

  useEffect(() => {
    connectWebSocket()
    return () => {
      if (providerRef.current) {
        providerRef.current.removeAllListeners()
        providerRef.current.websocket?.close()
      }
    }
  }, [address, network])

  return { balance, blockNumber, error, isConnected }
}
