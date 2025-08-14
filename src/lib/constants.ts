/**
 * 🎯 App Configuration & Constants
 * 
 * Configuración centralizada de la aplicación
 */

export const APP_CONFIG = {
  name: 'Qwik Dashboard',
  version: '1.0.0',
  description: 'Sistema Dashboard construido con Qwik para máxima performance',
} as const

/**
 * 🛣️ Application Routes
 */
export const ROUTES = {
  // Landing Pages
  home: '/',
  
  // Authentication
  auth: {
    login: '/login',
    register: '/register',
    forgotPassword: '/forgot-password',
    resetPassword: '/reset-password',
  },
    
  // Dashboard Application
  dashboard: {
    home: '/dashboard',
    clientes: '/dashboard/clientes',
    oportunidades: '/dashboard/oportunidades',
    actividades: '/dashboard/actividades',
    reportes: '/dashboard/reportes',
    configuracion: '/dashboard/configuracion',
  },
} as const

/**
 * 🎨 UI Constants
 */
export const UI_CONFIG = {
  breakpoints: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
  },
  animations: {
    duration: {
      fast: '150ms',
      normal: '300ms',
      slow: '500ms',
    }
  }
} as const
