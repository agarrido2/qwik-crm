// 🎯 Components Index - Exports Centralizados
// Estructura: /src/components/[category]/Component.tsx

// 🚀 Router Head (Core Qwik)
export { RouterHead } from './router-head/router-head'

// 🏗️ Shared Components (Reutilizables)
export { Header } from './shared/Header'
export { default as Sidebar } from './shared/Sidebar'

// 🎨 UI Components (Elementos básicos)
// export { Button } from './ui/Button'           // 🔜 Por crear
// export { Card } from './ui/Card'               // 🔜 Por crear
// export { Input } from './ui/Input'             // 🔜 Por crear
// export { Modal } from './ui/Modal'             // 🔜 Por crear

// 🌟 Landing Components (Página principal)
// export { Hero } from './landing/Hero'          // 🔜 Por crear
// export { Features } from './landing/Features'  // 🔜 Por crear
// export { Testimonials } from './landing/Testimonials' // 🔜 Por crear

// 🔐 Auth Components (Autenticación)
export { UserProfileCard, QuickUserInfo } from '~/features/auth/components/UserProfileDemo'
export { AuthProvider } from './auth/AuthProvider'

// 📱 App Components (CRM, Kanban, Calendar, etc.)
export { AppLayout } from './app/AppLayout'
// export { ClientCard } from './app/ClientCard'           // 🔜 Por crear
// export { OpportunityList } from './app/OpportunityList' // 🔜 Por crear
// export { ActivityCalendar } from './app/ActivityCalendar' // 🔜 Por crear
// export { KanbanBoard } from './app/KanbanBoard'         // 🔜 Por crear
// export { ReportChart } from './app/ReportChart'         // 🔜 Por crear
