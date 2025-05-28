// src/config.ts

const apiUrl =
  import.meta.env.MODE === 'production'
    ? import.meta.env.VITE_AUTH_API_URL || 'https://backend.tokenswallet.ru'
    : import.meta.env.VITE_AUTH_API_URL || 'http://localhost:5000'

const config = {
  apiUrl,

  baseUrl:
    import.meta.env.MODE === 'production'
      ? import.meta.env.VITE_FRONTEND_URL || 'https://tokenswallet.ru'
      : import.meta.env.VITE_FRONTEND_URL || window.location.origin,

  isProduction: import.meta.env.MODE === 'production',
  inDocker: false,

  substrate: {
    balanceEndpoint: `${apiUrl}/substrate/balance`,
    configEndpoint: `${apiUrl}/substrate/config`,
    transferEndpoint: `${apiUrl}/substrate/transfer`,
    rpcUrl: import.meta.env.VITE_SUBSTRATE_WS || 'wss://rpc-opal.unique.network',
  },
}

export default config
