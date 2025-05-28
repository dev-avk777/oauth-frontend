import config from '../config'

export interface SubstrateBalance {
  balance: string
  blockNumber?: number
  timestamp?: string
}

export interface SubstrateConfig {
  rpcUrl: string
  tokenId: string
  useBalances: boolean
  ss58Prefix: number
  decimals: number
}

/**
 * Get initial balance for the authenticated user
 */
export const getInitialBalance = async (): Promise<SubstrateBalance> => {
  const response = await fetch(config.substrate.balanceEndpoint, {
    credentials: 'include',
    headers: { Accept: 'application/json' },
  })
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new Error(errorData.message || 'Failed to fetch balance')
  }
  return response.json()
}

/**
 * Get Substrate configuration
 */
export const getSubstrateConfig = async (): Promise<SubstrateConfig> => {
  const response = await fetch(config.substrate.configEndpoint, {
    credentials: 'include',
    headers: { Accept: 'application/json' },
  })
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new Error(errorData.message || 'Failed to fetch substrate config')
  }
  return response.json()
}

/**
 * Perform a transfer of tokens
 */
export const transferTokens = async (
  toAddress: string,
  amount: string,
  assetId: string
): Promise<void> => {
  const response = await fetch(config.substrate.transferEndpoint, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({ toAddress, amount, assetId }),
  })
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new Error(errorData.message || 'Transfer failed')
  }
}
