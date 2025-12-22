import { useEffect, useState } from 'react'
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react'

interface Toast {
  id: string
  type: 'success' | 'error' | 'info' | 'warning'
  message: string
  duration?: number
}

let toastCount = 0

export function toast(type: Toast['type'], message: string, duration = 5000) {
  const id = (++toastCount).toString()
  const newToast: Toast = { id, type, message, duration }

  // Dispatch custom event
  window.dispatchEvent(new CustomEvent('show-toast', { detail: newToast }))

  return id
}

export function Toaster() {
  const [toasts, setToasts] = useState<Toast[]>([])

  useEffect(() => {
    const handleShowToast = (event: CustomEvent<Toast>) => {
      const newToast = event.detail
      setToasts(prev => [...prev, newToast])

      // Auto remove toast
      setTimeout(() => {
        setToasts(prev => prev.filter(t => t.id !== newToast.id))
      }, newToast.duration)
    }

    window.addEventListener('show-toast', handleShowToast as EventListener)

    return () => {
      window.removeEventListener('show-toast', handleShowToast as EventListener)
    }
  }, [])

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }

  const getToastStyles = (type: Toast['type']) => {
    switch (type) {
      case 'success':
        return 'bg-green-50 border-green-200 text-green-800 dark:bg-green-900 dark:border-green-700 dark:text-green-200'
      case 'error':
        return 'bg-red-50 border-red-200 text-red-800 dark:bg-red-900 dark:border-red-700 dark:text-red-200'
      case 'warning':
        return 'bg-yellow-50 border-yellow-200 text-yellow-800 dark:bg-yellow-900 dark:border-yellow-700 dark:text-yellow-200'
      case 'info':
      default:
        return 'bg-blue-50 border-blue-200 text-blue-800 dark:bg-blue-900 dark:border-blue-700 dark:text-blue-200'
    }
  }

  const getIcon = (type: Toast['type']) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="h-5 w-5" />
      case 'error':
        return <AlertCircle className="h-5 w-5" />
      case 'warning':
        return <AlertCircle className="h-5 w-5" />
      case 'info':
      default:
        return <Info className="h-5 w-5" />
    }
  }

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {toasts.map(toast => (
        <div
          key={toast.id}
          className={`max-w-sm w-full p-4 rounded-md border shadow-lg transition-all duration-300 ease-in-out ${getToastStyles(
            toast.type
          )}`}
          role="alert"
        >
          <div className="flex items-start">
            <div className="flex-shrink-0">
              {getIcon(toast.type)}
            </div>
            <div className="ml-3 flex-1">
              <p className="text-sm font-medium">{toast.message}</p>
            </div>
            <div className="ml-auto pl-3">
              <button
                onClick={() => removeToast(toast.id)}
                className="inline-flex rounded-md p-1.5 focus:outline-none focus:ring-2 focus:ring-gray-600 focus:ring-offset-2"
                aria-label="Dismiss"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

// Export convenience functions
export const showSuccessToast = (message: string) => toast('success', message)
export const showErrorToast = (message: string) => toast('error', message)
export const showInfoToast = (message: string) => toast('info', message)
export const showWarningToast = (message: string) => toast('warning', message)


