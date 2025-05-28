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

  const parsePlancks = (amt: string): bigint => {
    const num = parseFloat(amt)
    if (isNaN(num)) {
      return BigInt(0)
    }
    return BigInt(Math.floor(num * 10 ** decimals))
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError(undefined)
    if (!toAddress) {
      setError('Введите адрес получателя')
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
      alert('Перевод отправлен!')
    } catch (err: any) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form className="space-y-4 rounded-lg border bg-gray-50 p-4" onSubmit={handleSubmit}>
      <h2 className="text-lg font-medium">Перевод {tokenSymbol}</h2>
      <div>
        <label className="block text-sm font-medium">Адрес получателя</label>
        <input
          className="mt-1 w-full rounded border px-2 py-1"
          disabled={submitting}
          type="text"
          value={toAddress}
          onChange={e => setToAddress(e.target.value)}
        />
      </div>
      <div>
        <label className="block text-sm font-medium">Сумма ({tokenSymbol})</label>
        <input
          className="mt-1 w-full rounded border px-2 py-1"
          disabled={submitting}
          max={Number(maxBalance) / 10 ** decimals}
          min={0}
          step={1 / 10 ** decimals}
          type="number"
          value={amount}
          onChange={e => setAmount(e.target.value)}
        />
        <p className="mt-1 text-xs text-gray-500">
          Доступно: {(Number(maxBalance) / 10 ** decimals).toString()} {tokenSymbol}
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
  )
}
