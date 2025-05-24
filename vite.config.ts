import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },

  // для локальной разработки по http://localhost:3007 или http://172.26.0.4:3007
  server: {
    host: '0.0.0.0',
    port: 3007,
  },

  // для preview (vite preview), т.е. когда вы запускаете конечную сборку на prod-порту
  preview: {
    host: '0.0.0.0', // слушаем на всех интерфейсах
    port: 3007, // порт проксирования
    allowedHosts: [
      // доверенные имена хостов
      'tokenswallet.ru',
      'www.tokenswallet.ru',
      'localhost',
      '127.0.0.1',
    ],
    cors: {
      // CORS-настройки
      origin: ['https://tokenswallet.ru'],
    },
  },
})
