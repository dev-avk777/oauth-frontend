import { useEffect, useState } from 'react'
import { ApiPromise, WsProvider } from '@polkadot/api'
import config from '../config'
import type { SubstrateBalance } from '../api/substrateApi'

export type Status = 'online' | 'reconnecting' | 'error'

export function useBalanceWebSocket(
  accountId?: string,
  maxHistory = 50
): {
  current: SubstrateBalance | null
  history: SubstrateBalance[]
  status: Status
  decimals: number
  tokenSymbol: string
} {
  const [current, setCurrent] = useState<SubstrateBalance | null>(null)
  const [history, setHistory] = useState<SubstrateBalance[]>([])
  const [status, setStatus] = useState<Status>('reconnecting')
  const [decimals, setDecimals] = useState<number>(0)
  const [tokenSymbol, setTokenSymbol] = useState<string>('')

  useEffect(() => {
    if (!accountId) {
      setCurrent(null)
      setHistory([])
      setStatus('error')
      return
    }

    let api: ApiPromise
    let unsubscribe: () => void = () => {}
    let lastBalance: string | null = null
    let lastBlock: number | null = null
    let skipInitial = true

    const connect = async () => {
      try {
        setStatus('reconnecting')
        const provider = new WsProvider(config.substrate.rpcUrl)
        api = await ApiPromise.create({ provider })

        // Достаём decimals и символ токена из метаданных цепочки
        const chainDecimals = api.registry.chainDecimals[0]
        const chainTokens = api.registry.chainTokens[0] || ''
        setDecimals(chainDecimals)
        setTokenSymbol(chainTokens)

        // Начальное состояние
        const acctRaw = await api.query.system.account(accountId)
        const acct: any = acctRaw
        const initBalance = acct.data.free.toString()
        const header = await api.rpc.chain.getHeader()
        const initBlock = header.number.toNumber()
        const initTime = new Date().toISOString()

        const initial: SubstrateBalance = {
          balance: initBalance,
          blockNumber: initBlock,
          timestamp: initTime,
        }
        setCurrent(initial)
        setHistory([initial])
        lastBalance = initBalance
        lastBlock = initBlock
        setStatus('online')

        // Подписка на изменения
        const sub: any = await api.query.system.account(accountId, async (info: any) => {
          const balance = info.data.free.toString()
          const hdr = await api.rpc.chain.getHeader()
          const block = hdr.number.toNumber()
          const ts = new Date().toISOString()

          if (skipInitial) {
            skipInitial = false
            lastBalance = balance
            lastBlock = block
            return
          }
          if (balance === lastBalance && block === lastBlock) {
            return
          }
          lastBalance = balance
          lastBlock = block

          const payload: SubstrateBalance = {
            balance,
            blockNumber: block,
            timestamp: ts,
          }
          setCurrent(payload)
          setHistory(h => [payload, ...h].slice(0, maxHistory))
        })
        unsubscribe = () => {
          try {
            sub()
          } catch (e) {
            console.warn('Failed to unsubscribe from balance updates', e)
          }
        }

        provider.on('connected', () => setStatus('online'))
        provider.on('disconnected', () => setStatus('reconnecting'))
        provider.on('error', () => setStatus('error'))
      } catch (err) {
        console.error('WS init error:', err)
        setStatus('error')
      }
    }

    connect()

    return () => {
      unsubscribe()
      api?.disconnect()
    }
  }, [accountId, maxHistory])

  return { current, history, status, decimals, tokenSymbol }
}
