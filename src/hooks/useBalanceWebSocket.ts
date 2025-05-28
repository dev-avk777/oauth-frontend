import { useEffect, useState } from 'react'
import { ApiPromise, WsProvider } from '@polkadot/api'
import config from '../config'
import type { SubstrateBalance } from '../api/substrateApi'

export type Status = 'online' | 'reconnecting' | 'error'

/**
 * Подписка на изменения баланса Substrate-аккаунта.
 *
 * @param accountId SS58-адрес пользователя (строка, не undefined)
 * @param maxHistory максимальное число записей истории
 */
export function useBalanceWebSocket(accountId?: string, maxHistory = 50) {
  const [current, setCurrent] = useState<SubstrateBalance | null>(null)
  const [history, setHistory] = useState<SubstrateBalance[]>([])
  const [status, setStatus] = useState<Status>('reconnecting')

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

        // Один раз получаем текущее состояние
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

        // Подписываемся на изменения
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

        // Готовим функцию отписки
        unsubscribe = () => {
          try {
            sub()
          } catch (e) {
            console.warn('unsubscribe error', e)
          }
        }

        // Слушаем события провайдера
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

  return { current, history, status }
}
