import React, { useState, type FormEvent } from 'react'
import { transferTokens } from '../api/substrateApi'

interface TransferFormProps {
  maxBalance: bigint
  decimals: number
  tokenSymbol: string
  onSuccess?: () => void
}

export const TransferForm: React.FC<TransferFormProps> = ({
  maxBalance,
  decimals,
  tokenSymbol,
  onSuccess,
}) => {
  const [toAddress, setToAddress] = useState('')
  const [amount, setAmount] = useState('')
  const [error, setError] = useState<string>()
  const [submitting, setSubmitting] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)

  const parsePlancks = (amt: string): bigint => {
    const num = parseFloat(amt)
    if (isNaN(num)) {
      return BigInt(0)
    }
    return BigInt(Math.floor(num * 10 ** decimals))
  }
  const ss58Pattern = /^5[1-9A-HJ-NP-Za-km-z]{47}$/
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError(undefined)
    if (!toAddress) {
      setError('Введите адрес получателя')
      return
    }
    if (!ss58Pattern.test(toAddress)) {
      setError('Введите корректный SS58-адрес, начинающийся с «5» и длиной 48 символов')
      return
    }
    const valuePlancks = parsePlancks(amount)
    if (valuePlancks <= BigInt(0)) {
      setError('Сумма должна быть больше нуля')
      return
    }
    if (valuePlancks > maxBalance) {
      const available = (Number(maxBalance) / 10 ** decimals).toString()
      setError(`Недостаточно средств (максимум ${available} ${tokenSymbol})`)
      return
    }
    setSubmitting(true)
    try {
      await transferTokens(toAddress, amount, tokenSymbol)
      setToAddress('')
      setAmount('')
      if (onSuccess) {
        onSuccess()
      }
      setTimeout(() => setShowSuccess(true), 5000)
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message)
      } else {
        setError('Произошла ошибка при переводе')
      }
    } finally {
      setSubmitting(false)
    }
  }
  const isEmpty = maxBalance === BigInt(0)
  return (
    <>
      <form className="space-y-4 rounded-lg border bg-gray-50 p-4" onSubmit={handleSubmit}>
        <h2 className="text-lg font-medium">Перевод {tokenSymbol}</h2>
        <div>
          <label className="block text-sm font-medium">Адрес получателя</label>
          <input
            required
            className="mt-1 w-full rounded border px-2 py-1"
            disabled={submitting}
            pattern="^5[1-9A-HJ-NP-Za-km-z]{47}$"
            title="Адрес должен начинаться с «5» и быть 48 символов в диапазоне Base58"
            type="text"
            value={toAddress}
            onChange={e => {
              setToAddress(e.target.value)
              setError(undefined)
            }}
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Сумма ({tokenSymbol})</label>
          <input
            className="mt-1 w-full rounded border px-2 py-1"
            disabled={submitting || isEmpty}
            max={Number(maxBalance) / 10 ** decimals}
            min={0}
            step={1 / 10 ** decimals}
            type="number"
            value={amount}
            onChange={e => setAmount(e.target.value)}
          />
          <p className="mt-1 text-xs text-gray-500">
            Доступно: {(Number(maxBalance) / 10 ** decimals).toFixed(4)} {tokenSymbol}
          </p>
        </div>
        {error && <div className="text-sm text-red-500">{error}</div>}
        <button
          className="w-full rounded bg-blue-600 px-4 py-2 text-white disabled:opacity-50"
          disabled={submitting}
          type="submit"
        >
          {submitting ? 'Отправка…' : 'Отправить'}
        </button>
      </form>
      {showSuccess && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
          onClick={() => setShowSuccess(false)}
        >
          <div className="rounded-lg bg-white p-6 shadow-lg" onClick={e => e.stopPropagation()}>
            <p className="text-lg">Перевод отправлен!</p>
            <button
              className="mt-4 rounded bg-blue-600 px-4 py-2 text-white"
              onClick={() => setShowSuccess(false)}
            >
              Закрыть
            </button>
          </div>
        </div>
      )}
    </>
  )
}
