/**
 * Dynamic Menu System Types - CRM Navigation Structure
 * 
 * Defines the complete type system for the CRM menu navigation
 * with full CRUD support for dynamic management via admin interface.
 * All entities can be created, read, updated, and deleted from Supabase.
 */

// =============================================================================
// DYNAMIC ENTITIES - Managed via Admin Interface
// =============================================================================

// User Roles - Dynamic, stored in Supabase
export interface UserRole {
  id: string                         // UUID primary key
  name: string                       // Role name: "admin", "manager", "sales"
  display_name: string               // Human readable: "Administrador", "Gerente"
  description?: string               // Role description
  level: number                      // Hierarchy level: 1=highest, 10=lowest
  is_active: boolean                 // Enable/disable role
  is_system: boolean                 // System role (non-deletable)
  created_at: Date
  updated_at: Date
  created_by: string                 // User ID who created
}

// Permissions - Dynamic, stored in Supabase
export interface Permission {
  id: string                         // UUID primary key
  name: string                       // Permission key: "clients.read", "reports.create"
  display_name: string               // Human readable: "Ver Clientes", "Crear Reportes"
  description?: string               // Permission description
  module: string                     // Module grouping: "clients", "reports", "dashboard"
  action: string                     // Action type: "read", "create", "update", "delete"
  is_active: boolean                 // Enable/disable permission
  is_system: boolean                 // System permission (non-deletable)
  created_at: Date
  updated_at: Date
  created_by: string                 // User ID who created
}

// Menu Types - Fixed visual types (not dynamic)
export type MenuType = 'group' | 'item' | 'separator'

// Menu Type Configuration - Dynamic metadata for types
export interface MenuTypeConfig {
  id: string                         // UUID primary key
  type: MenuType                     // Fixed type reference
  display_name: string               // Human readable: "Grupo", "Elemento", "Separador"
  description?: string               // Type description
  allows_children: boolean           // Can have subitems
  requires_path: boolean             // Requires navigation path
  icon?: string                      // Default icon for this type
  is_active: boolean                 // Enable/disable type
  is_system: boolean                 // System type (non-deletable)
  created_at: Date
  updated_at: Date
  created_by: string                 // User ID who created
}

// Badge Variants - Dynamic, stored in Supabase
export interface BadgeVariant {
  id: string                         // UUID primary key
  name: string                       // Variant key: "default", "destructive"
  display_name: string               // Human readable: "Por Defecto", "Destructivo"
  css_classes: string                // Tailwind classes for styling
  is_active: boolean                 // Enable/disable variant
  is_system: boolean                 // System variant (non-deletable)
  created_at: Date
  updated_at: Date
  created_by: string                 // User ID who created
}

// Badge configuration for menu items
export interface MenuBadge {
  text: string                       // Badge content: "3", "NEW", "!"
  variant_id: string                 // Reference to BadgeVariant.id
  color?: string                     // Custom color override
}

// =============================================================================
// MENU OPTIONS - Main Dynamic Entity
// =============================================================================

// Main menu option interface - Fully dynamic and CRUD-enabled
export interface MenuOption {
  // Primary identification
  id: string                         // UUID primary key
  parent_id?: string                 // Parent menu ID for hierarchy (null = root)
  
  // Display properties
  title: string                      // Display text: "Dashboard", "Clientes"
  description?: string               // Tooltip/extended description
  icon?: string                      // Emoji or icon identifier: "📊", "dashboard"
  icon_url?: string                  // Custom icon URL (optional)
  
  // Navigation properties
  path?: string                      // Internal route: "/dashboard", "/clients"
  external_url?: string              // External URL if applicable
  
  // Type and hierarchy
  type: MenuType                     // Fixed visual type: 'group' | 'item' | 'separator'
  order_index: number                // Display order within parent: 1, 2, 3...
  section_title?: string             // Section grouping title
  
  // Visibility and state
  is_visible: boolean                // Show/hide element
  is_enabled: boolean                // Enabled/disabled state
  is_public: boolean                 // Access without authentication
  
  // Badge configuration
  badge_text?: string                // Badge content: "3", "NEW", "!"
  badge_variant_id?: string          // Reference to BadgeVariant.id
  badge_color?: string               // Custom badge color
  
  // Behavior settings
  opens_in_new_tab: boolean          // Open in new tab
  requires_confirmation: boolean     // Confirm before navigation
  keyboard_shortcut?: string         // Keyboard shortcut: "Ctrl+D"
  
  // Metadata
  created_at: Date
  updated_at: Date
  created_by: string                 // User ID who created
  is_system: boolean                 // System element (non-deletable)
}

// =============================================================================
// RELATIONSHIP TABLES - Many-to-Many Relations
// =============================================================================

// Menu Option - Role relationship
export interface MenuOptionRole {
  id: string                         // UUID primary key
  menu_option_id: string             // Reference to MenuOption.id
  role_id: string                    // Reference to UserRole.id
  is_required: boolean               // Required vs optional role
  is_excluded: boolean               // Excluded role (blacklist)
  created_at: Date
  created_by: string
}

// Menu Option - Permission relationship
export interface MenuOptionPermission {
  id: string                         // UUID primary key
  menu_option_id: string             // Reference to MenuOption.id
  permission_id: string              // Reference to Permission.id
  is_required: boolean               // Required vs optional permission
  created_at: Date
  created_by: string
}

// =============================================================================
// COMPUTED/RUNTIME TYPES - For Application Logic
// =============================================================================

// Enhanced menu option with resolved relationships (for runtime use)
export interface MenuOptionWithRelations extends MenuOption {
  badge_variant?: BadgeVariant       // Resolved badge variant
  required_roles: UserRole[]         // Resolved required roles
  required_permissions: Permission[] // Resolved required permissions
  excluded_roles: UserRole[]         // Resolved excluded roles
  children: MenuOptionWithRelations[] // Child menu options
}

// Menu section grouping (computed from menu options)
export interface MenuSection {
  title: string                      // Section title
  items: MenuOptionWithRelations[]   // Menu items in this section
  order: number                      // Section display order
}

// Complete menu structure (computed)
export interface MenuStructure {
  sections: MenuSection[]            // All menu sections
  version: string                    // Menu version for caching
  last_updated: Date                 // Last modification date
  total_items: number                // Total menu items count
}

// User context for menu filtering
export interface UserMenuContext {
  user_id: string
  user_roles: string[]               // User's role IDs
  user_permissions: string[]         // User's permission IDs
  is_authenticated: boolean
  is_admin: boolean                  // Quick admin check
}

// =============================================================================
// CRUD OPERATION TYPES - For Admin Interface
// =============================================================================

// Create/Update DTOs for admin forms
export interface CreateMenuOptionDTO {
  parent_id?: string
  title: string
  description?: string
  icon?: string
  icon_url?: string
  path?: string
  external_url?: string
  type: MenuType
  order_index: number
  section_title?: string
  is_visible: boolean
  is_enabled: boolean
  is_public: boolean
  badge_text?: string
  badge_variant_id?: string
  badge_color?: string
  opens_in_new_tab: boolean
  requires_confirmation: boolean
  keyboard_shortcut?: string
  required_role_ids: string[]        // Array of role IDs
  required_permission_ids: string[]  // Array of permission IDs
  excluded_role_ids: string[]        // Array of excluded role IDs
}

export interface UpdateMenuOptionDTO extends Partial<CreateMenuOptionDTO> {
  id: string                         // Required for updates
}

// Bulk operations
export interface BulkMenuOperation {
  operation: 'create' | 'update' | 'delete' | 'reorder'
  items: (CreateMenuOptionDTO | UpdateMenuOptionDTO | string)[] // DTOs or IDs
}

// =============================================================================
// ADMIN INTERFACE TYPES
// =============================================================================

// Form validation schemas
export interface MenuOptionValidation {
  title: { required: true; minLength: 1; maxLength: 100 }
  path: { pattern: '^/[a-zA-Z0-9/_-]*$' }  // Valid route pattern
  external_url: { pattern: '^https?://' }   // Valid URL pattern
  keyboard_shortcut: { pattern: '^(Ctrl|Alt|Shift)\\+[A-Z]$' }
}

// Admin dashboard statistics
export interface MenuStatistics {
  total_menu_options: number
  total_roles: number
  total_permissions: number
  total_menu_types: number
  active_menu_options: number
  system_menu_options: number
  custom_menu_options: number
}

// =============================================================================
// EXPORT TYPES FOR EXTERNAL USE
// =============================================================================

// Re-export commonly used types
export type MenuOptionId = string
export type RoleId = string
export type PermissionId = string
export type MenuTypeId = string
export type BadgeVariantId = string

// =============================================================================
// UTILITY TYPES AND FUNCTIONS
// =============================================================================

// Menu filtering and processing utilities
export interface MenuUtils {
  // Core filtering
  filterByPermissions: (menu: MenuOptionWithRelations[], context: UserMenuContext) => MenuOptionWithRelations[]
  filterByRoles: (menu: MenuOptionWithRelations[], userRoles: string[]) => MenuOptionWithRelations[]
  
  // Menu navigation
  findMenuItem: (menu: MenuOptionWithRelations[], id: string) => MenuOptionWithRelations | null
  getActiveMenuItem: (menu: MenuOptionWithRelations[], currentPath: string) => MenuOptionWithRelations | null
  getBreadcrumb: (menu: MenuOptionWithRelations[], currentPath: string) => MenuOptionWithRelations[]
  
  // Menu structure
  flattenMenu: (menu: MenuOptionWithRelations[]) => MenuOptionWithRelations[]
  buildHierarchy: (flatMenu: MenuOption[]) => MenuOptionWithRelations[]
  groupBySection: (menu: MenuOptionWithRelations[]) => MenuSection[]
  
  // Validation
  validateMenuStructure: (menu: MenuOption[]) => { isValid: boolean; errors: string[] }
  validateCircularReference: (menu: MenuOption[], parentId: string, childId: string) => boolean
}
