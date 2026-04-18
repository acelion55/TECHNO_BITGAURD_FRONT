import { useEffect, useState } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import useStore from './store/useStore'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'
import Layout from './components/layout/Layout'
import DashboardPage from './pages/DashboardPage'
import DcaPage from './pages/DcaPage'
import PortfolioPage from './pages/PortfolioPage'
import TransactionsPage from './pages/TransactionsPage'
import TaxPage from './pages/TaxPage'
import ChatPage from './pages/ChatPage'
import './App.css'

function App() {
  const { user, fetchPrice, restoreSession } = useStore()
  const [authView, setAuthView] = useState('login')   // 'login' | 'signup'
  const [sessionChecked, setSessionChecked] = useState(false)

  // Restore session from httpOnly cookie on page load
  useEffect(() => {
    restoreSession().finally(() => setSessionChecked(true))
    // Listen for forced logout from axios interceptor
    const handler = () => { logout(); setSessionChecked(true); }
    window.addEventListener('auth:logout', handler)
    return () => window.removeEventListener('auth:logout', handler)
  }, [])

  // Refresh BTC price every 30s
  useEffect(() => {
    fetchPrice()
    const interval = setInterval(fetchPrice, 30000)
    return () => clearInterval(interval)
  }, [])

  // Wait for session check before rendering
  if (!sessionChecked) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-zinc-700 border-t-orange-400 rounded-full animate-spin" />
      </div>
    )
  }

  // Not logged in → show auth pages
  if (!user) {
    return authView === 'login'
      ? <LoginPage  onSwitch={() => setAuthView('signup')} />
      : <SignupPage onSwitch={() => setAuthView('login')} />
  }

  // Logged in → show dashboard
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/"             element={<DashboardPage />} />
          <Route path="/dca"          element={<DcaPage />} />
          <Route path="/portfolio"    element={<PortfolioPage />} />
          <Route path="/transactions" element={<TransactionsPage />} />
          <Route path="/tax"          element={<TaxPage />} />
          <Route path="/chat"         element={<ChatPage />} />
          <Route path="*"             element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
