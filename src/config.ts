const config = {
  apiUrl:
    import.meta.env.MODE === 'production'
      ? import.meta.env.VITE_AUTH_API_URL || 'https://api.yourdomain.com'
      : import.meta.env.VITE_AUTH_API_URL || 'http://localhost:5000',

  // Добавляем baseUrl для консистентности
  baseUrl:
    import.meta.env.MODE === 'production'
      ? import.meta.env.VITE_FRONTEND_URL || 'https://yourdomain.com'
      : import.meta.env.VITE_FRONTEND_URL || window.location.origin,

  // Флаг для определения продакшен-режима
  isProduction: import.meta.env.MODE === 'production',

  // Для работы в Docker - установлено в false для локальной разработки
  inDocker: false,
}

export default config
