'use client'

import { useEffect } from 'react'

import { useAuth } from '@/context/AuthContext'

import { useNavigate } from 'react-router-dom'

export const CallbackPage = () => {
  const { handleAuthCallback, isLoading, error } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    const processAuth = async () => {
      try {
        // Проверяем, есть ли в URL параметр userData
        const params = new URLSearchParams(window.location.search)
        const userDataParam = params.get('userData')

        console.log('CallbackPage: начало обработки аутентификации')
        console.log('Параметр userData найден:', !!userDataParam)

        if (userDataParam) {
          try {
            const userData = JSON.parse(decodeURIComponent(userDataParam))
            console.log('Данные пользователя получены:', userData)

            // Сохраняем данные пользователя в localStorage
            localStorage.setItem('auth_user', JSON.stringify(userData))
            console.log('Данные пользователя сохранены в localStorage')

            // Увеличиваем задержку для надежности
            const delay = 1500

            console.log(`Ожидание ${delay}мс перед перенаправлением...`)
            setTimeout(() => {
              // Перенаправляем на профиль
              console.log('Перенаправление на страницу профиля')
              navigate('/profile')
            }, delay)
            return
          } catch (e) {
            // Ошибка при разборе данных пользователя
            console.error('Ошибка при разборе данных пользователя:', e)
          }
        }

        // Если нет данных в URL, пробуем стандартный метод
        console.log('Данные не найдены в URL, используем стандартный метод')
        const success = await handleAuthCallback()
        console.log('Результат стандартного метода:', success)

        if (success) {
          console.log('Аутентификация успешна, перенаправление на профиль')
          navigate('/profile')
        } else {
          // If handleAuthCallback returned false but no error was set,
          // we'll redirect to the home page
          console.log('Аутентификация не удалась, перенаправление на главную')
          navigate('/')
        }
      } catch (err) {
        console.error('Ошибка во время аутентификации:', err)
        // If an unexpected error occurs during authentication,
        // we'll still redirect to the home page
        navigate('/')
      }
    }

    processAuth()
  }, [handleAuthCallback, navigate, error])

  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center">
      <h1 className="mb-4 text-2xl font-semibold">
        {error ? 'Authentication Error' : 'Processing authentication...'}
      </h1>

      {error ? (
        <div className="max-w-md rounded-md bg-red-50 p-4 text-red-600">
          <p>{error}</p>
          <button
            className="mt-4 rounded-md bg-red-600 px-4 py-2 text-white hover:bg-red-700"
            onClick={() => navigate('/')}
          >
            Return to Login
          </button>
        </div>
      ) : isLoading ? (
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-b-transparent border-l-transparent border-r-transparent border-t-blue-500"></div>
      ) : (
        <p>Redirecting you to your profile...</p>
      )}
    </div>
  )
}
