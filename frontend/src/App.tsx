import { Routes, Route } from 'react-router-dom'
import { Navbar } from './components/layout/Navbar'
import { Dashboard } from './features/dashboard/Dashboard'
import { Expenses } from './features/expenses/Expenses'
import { Auth } from './features/auth/Auth'
import { ProtectedRoute } from './components/layout/ProtectedRoute'
import { Toaster } from './components/ui/Toaster'
import { AuthProvider } from './features/auth/hooks/useAuth'

function App() {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Navbar />
        <main className="page-container">
          <Routes>
            <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/expenses" element={<ProtectedRoute><Expenses /></ProtectedRoute>} />
            <Route path="/auth" element={<Auth />} />
          </Routes>
        </main>
        <Toaster />
      </div>
    </AuthProvider>
  )
}

export default App
