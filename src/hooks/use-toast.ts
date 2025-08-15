import { createContextId, useContext, useContextProvider, useStore } from '@builder.io/qwik'

export interface ToastData {
  id: string
  title?: string
  description?: string
  variant?: 'default' | 'destructive' | 'success' | 'warning'
  duration?: number
  action?: {
    label: string
    actionId: string
  }
}

export interface ToastStore {
  toasts: ToastData[]
}

// Context para el Toast
export const ToastContext = createContextId<ToastStore>('toast-context')

let toastCounter = 0

export const useToastProvider = () => {
  const store = useStore<ToastStore>({
    toasts: []
  })
  
  useContextProvider(ToastContext, store)
  return store
}

export const useToast = () => {
  const store = useContext(ToastContext)
  
  const generateId = () => `toast-${++toastCounter}-${Date.now()}`
  
  const addToast = (toast: Omit<ToastData, 'id'>) => {
    const id = generateId()
    const newToast: ToastData = {
      id,
      duration: 5000,
      variant: 'default',
      ...toast
    }
    
    store.toasts = [...store.toasts, newToast]
    
    // Auto-remove después del duration
    if (newToast.duration && newToast.duration > 0) {
      setTimeout(() => {
        removeToast(id)
      }, newToast.duration)
    }
    
    return id
  }
  
  const removeToast = (id: string) => {
    store.toasts = store.toasts.filter((toast: ToastData) => toast.id !== id)
  }
  
  const clearAllToasts = () => {
    store.toasts = []
  }
  
  // Métodos de conveniencia
  const success = (message: string, options?: Partial<Omit<ToastData, 'id' | 'variant'>>) => {
    return addToast({
      description: message,
      variant: 'success',
      ...options
    })
  }
  
  const error = (message: string, options?: Partial<Omit<ToastData, 'id' | 'variant'>>) => {
    return addToast({
      description: message,
      variant: 'destructive',
      ...options
    })
  }
  
  const warning = (message: string, options?: Partial<Omit<ToastData, 'id' | 'variant'>>) => {
    return addToast({
      description: message,
      variant: 'warning',
      ...options
    })
  }
  
  const info = (message: string, options?: Partial<Omit<ToastData, 'id' | 'variant'>>) => {
    return addToast({
      description: message,
      variant: 'default',
      ...options
    })
  }
  
  return {
    toasts: store.toasts,
    addToast,
    removeToast,
    clearAllToasts,
    success,
    error,
    warning,
    info
  }
}
