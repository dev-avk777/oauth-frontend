import config from '../config.ts'

export const login = async (credentials: { email: string; password: string }) => {
  const response = await fetch(`${config.apiUrl}/users/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials),
    credentials: 'include', // Передаём куки
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new Error(errorData.message || 'Login failed')
  }
  return response.json()
}

export const register = async (credentials: { email: string; password: string }) => {
  const response = await fetch(`${config.apiUrl}/users/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials),
    credentials: 'include', // Добавляем credentials: 'include' для поддержки куки
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new Error(errorData.message || 'Registration failed')
  }
  return response.json()
}

// Инициирование Google OAuth авторизации
export const loginWithGoogle = () => {
  const redirectUri = `${config.baseUrl}/callback`
  window.location.href = `${config.apiUrl}/auth/google?redirect_uri=${encodeURIComponent(redirectUri)}`
}

export const getUserInfo = async () => {
  const response = await fetch(`${config.apiUrl}/auth/user-info`, {
    credentials: 'include', // Для передачи куки
  })
  if (!response.ok) {
    throw new Error('Failed to fetch user data')
  }
  return response.json()
}

export const logoutApi = async () => {
  await fetch(`${config.apiUrl}/auth/logout`, {
    method: 'POST',
    credentials: 'include',
  })
}

// Методы для работы с Ethereum ключами

// Создание нового Ethereum ключа
export const createEthereumKey = async () => {
  const response = await fetch(`${config.apiUrl}/ethereum/keys/create`, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new Error(errorData.message || 'Failed to create Ethereum key')
  }
  return response.json()
}

// Получение списка всех ключей пользователя
export const getEthereumKeys = async () => {
  try {
    console.log('Отправка запроса на получение ключей...')
    const response = await fetch(`${config.apiUrl}/ethereum/keys`, {
      credentials: 'include',
      headers: {
        Accept: 'application/json',
      },
    })

    if (!response.ok) {
      const statusText = response.statusText
      let errorMessage = `HTTP ошибка ${response.status}: ${statusText}`

      try {
        const errorData = await response.json()
        errorMessage = errorData.message || errorMessage
      } catch (e) {
        console.error('Не удалось распарсить ответ от сервера:', e)
      }

      console.error(`Ошибка получения ключей: ${errorMessage}`)
      throw new Error(errorMessage)
    }

    const data = await response.json()
    console.log('Получены данные ключей:', data)
    return data
  } catch (error) {
    console.error('Ошибка при получении ключей:', error)
    throw error
  }
}

// Тип для транзакции
type Transaction = {
  to: string
  value: string
  data?: string
  gasLimit?: string
  gasPrice?: string
}

// Подписание транзакции
export const signTransaction = async (keyId: string, transaction: Transaction) => {
  const response = await fetch(`${config.apiUrl}/ethereum/keys/${keyId}/sign`, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ transaction }),
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new Error(errorData.message || 'Failed to sign transaction')
  }
  return response.json()
}

// Получение баланса по адресу
export const getEthereumBalance = async (address: string) => {
  const response = await fetch(`${config.apiUrl}/ethereum/balance/${address}`, {
    credentials: 'include',
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new Error(errorData.message || 'Failed to fetch balance')
  }
  return response.json()
}
