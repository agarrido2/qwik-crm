/**
 * SidebarData - Configuración de opciones del menú del sidebar
 * 
 * Define la estructura de navegación del dashboard con iconos,
 * rutas y configuración de submenús.
 */

// Data configuration file - no components needed

export interface SidebarItem {
  id: string
  title: string
  icon: string
  path?: string
  badge?: string
  children?: SidebarItem[]
  isExpanded?: boolean
}

export interface SidebarSection {
  title: string
  items: SidebarItem[]
}

// Datos del menú principal
export const sidebarData: SidebarSection[] = [
  {
    title: "MAIN",
    items: [
      {
        id: "dashboard",
        title: "My Dashboard",
        icon: "🏠",
        path: "/dashboard",
        isExpanded: true,
        children: [
          {
            id: "analysis",
            title: "Analysis",
            icon: "📊",
            path: "/dashboard/analysis"
          },
          {
            id: "wallet",
            title: "My Wallet",
            icon: "💰",
            path: "/dashboard/wallet"
          },
          {
            id: "iot",
            title: "Smart IOT",
            icon: "🔗",
            path: "/dashboard/iot"
          }
        ]
      },
      {
        id: "applications",
        title: "Applications",
        icon: "📱",
        children: [
          {
            id: "clientes",
            title: "Clientes",
            icon: "👥",
            path: "/dashboard/clientes"
          },
          {
            id: "oportunidades",
            title: "Oportunidades",
            icon: "💼",
            path: "/dashboard/oportunidades"
          },
          {
            id: "actividades",
            title: "Actividades",
            icon: "📅",
            path: "/dashboard/actividades"
          }
        ]
      },
      {
        id: "pages",
        title: "More Pages",
        icon: "📄",
        children: [
          {
            id: "reports",
            title: "Reports",
            icon: "📈",
            path: "/dashboard/reports"
          },
          {
            id: "settings",
            title: "Settings",
            icon: "⚙️",
            path: "/dashboard/settings"
          }
        ]
      },
      {
        id: "account",
        title: "Account",
        icon: "👤",
        children: [
          {
            id: "profile",
            title: "Profile",
            icon: "👤",
            path: "/dashboard/profile"
          },
          {
            id: "billing",
            title: "Billing",
            icon: "💳",
            path: "/dashboard/billing"
          }
        ]
      },
      {
        id: "auth",
        title: "Authentication",
        icon: "🔐",
        children: [
          {
            id: "login",
            title: "Login",
            icon: "🔑",
            path: "/auth/login"
          },
          {
            id: "register",
            title: "Register",
            icon: "📝",
            path: "/auth/register"
          }
        ]
      },
      {
        id: "menu-level",
        title: "Menu Level",
        icon: "📋",
        children: [
          {
            id: "level-1",
            title: "Level 1",
            icon: "📌",
            children: [
              {
                id: "level-2",
                title: "Level 2",
                icon: "📍",
                path: "/dashboard/level-2"
              }
            ]
          }
        ]
      }
    ]
  },
  {
    title: "RESOURCES",
    items: [
      {
        id: "modals",
        title: "Modals Popups",
        icon: "🪟",
        path: "/dashboard/modals"
      },
      {
        id: "widgets",
        title: "Widget's",
        icon: "🧩",
        path: "/dashboard/widgets"
      },
      {
        id: "documentation",
        title: "Documentation",
        icon: "📚",
        path: "/dashboard/documentation"
      },
      {
        id: "changelog",
        title: "Changelog",
        icon: "📝",
        path: "/dashboard/changelog"
      }
    ]
  }
]

// Helper para obtener item por path
export const getSidebarItemByPath = (path: string): SidebarItem | null => {
  for (const section of sidebarData) {
    for (const item of section.items) {
      if (item.path === path) return item
      if (item.children) {
        for (const child of item.children) {
          if (child.path === path) return child
          if (child.children) {
            for (const grandchild of child.children) {
              if (grandchild.path === path) return grandchild
            }
          }
        }
      }
    }
  }
  return null
}
