import { BrowserRouter, Routes, Route } from 'react-router-dom'
import HomePage from '@/pages/HomePage'

import ProfilePage from '@/pages/ProfilePage'
import { AuthProvider } from '@/context/AuthContext'
import { CallbackPage } from './pages/CallbackPage'

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <main className="mx-auto max-w-xl space-y-6 p-6">
          <Routes>
            <Route element={<HomePage />} path="/" />
            <Route element={<CallbackPage />} path="/callback" />
            <Route element={<ProfilePage />} path="/profile" />
          </Routes>
        </main>
      </AuthProvider>
    </BrowserRouter>
  )
}
