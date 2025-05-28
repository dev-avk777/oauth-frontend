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
 * @returns Promise with balance information
 */
export const getInitialBalance = async (): Promise<SubstrateBalance> => {
  const response = await fetch(config.substrate.balanceEndpoint, {
    credentials: 'include',
    headers: {
      Accept: 'application/json',
    },
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new Error(errorData.message || 'Failed to fetch balance')
  }

  return response.json()
}

/**
 * Get Substrate configuration
 * @returns Promise with substrate configuration
 */
export const getSubstrateConfig = async (): Promise<SubstrateConfig> => {
  const response = await fetch(config.substrate.configEndpoint, {
    credentials: 'include',
    headers: {
      Accept: 'application/json',
    },
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new Error(errorData.message || 'Failed to fetch substrate config')
  }

  return response.json()
}
