/**
 * ADMIN - Gestión de Menú
 * 
 * Formulario administrativo para gestionar el sistema de menú dinámico.
 * Permite CRUD completo de opciones de menú, roles, permisos y configuración.
 * 
 * FUNCIONALIDADES:
 * - Crear/Editar/Eliminar opciones de menú
 * - Gestionar jerarquías y relaciones parent-child
 * - Configurar permisos y roles por opción
 * - Vista previa del menú en tiempo real
 * - Validación completa con Zod
 * 
 * ACCESO: Solo super-administradores
 */

import { component$, useSignal, useStore, $ } from '@builder.io/qwik'
import { routeAction$, zod$, z, Form, routeLoader$ } from '@builder.io/qwik-city'
import { 
  Button, 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  Input,
  Textarea,
  Select,
  SelectOption,
  Checkbox,
  Badge,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DataTable,
  type Column
} from '../../components/ui'
import type { 
  MenuOption, 
  CreateMenuOptionDTO,
  MenuStatistics 
} from '../../types/menu'

// Validación Zod para formulario de menú
const menuOptionSchema = z.object({
  title: z.string().min(1, 'El título es requerido').max(100, 'Máximo 100 caracteres'),
  description: z.string().optional(),
  icon: z.string().optional(),
  icon_url: z.string().url('URL inválida').optional().or(z.literal('')),
  path: z.string().regex(/^\/[a-zA-Z0-9/_-]*$/, 'Ruta inválida').optional().or(z.literal('')),
  external_url: z.string().url('URL externa inválida').optional().or(z.literal('')),
  type: z.enum(['group', 'item', 'separator'], {
    errorMap: () => ({ message: 'Tipo de menú inválido' })
  }),
  parent_id: z.string().optional(),
  order_index: z.number().min(1, 'El orden debe ser mayor a 0'),
  section_title: z.string().optional(),
  is_visible: z.boolean(),
  is_enabled: z.boolean(),
  is_public: z.boolean(),
  badge_text: z.string().max(10, 'Máximo 10 caracteres').optional().or(z.literal('')),
  badge_variant_id: z.string().optional(),
  badge_color: z.string().optional(),
  opens_in_new_tab: z.boolean(),
  requires_confirmation: z.boolean(),
  keyboard_shortcut: z.string().regex(/^(Ctrl|Alt|Shift)\+[A-Z]$/, 'Formato: Ctrl+A').optional().or(z.literal(''))
})

// Loader para cargar datos iniciales
export const useMenuAdminLoader = routeLoader$(async () => {
  // TODO: Cargar desde Supabase
  const mockMenuOptions: MenuOption[] = []
  const mockStatistics: MenuStatistics = {
    total_menu_options: 16,
    total_roles: 5,
    total_permissions: 24,
    total_menu_types: 3,
    active_menu_options: 15,
    system_menu_options: 12,
    custom_menu_options: 4
  }
  
  return {
    menuOptions: mockMenuOptions,
    statistics: mockStatistics
  }
})

// Action para crear/actualizar opción de menú
export const useMenuOptionAction = routeAction$(
  async (data) => {
    // TODO: Implementar lógica de Supabase
    console.log('Menu option data:', data)
    
    // Simular creación/actualización
    return {
      success: true,
      message: data.id ? 'Opción actualizada correctamente' : 'Opción creada correctamente',
      data
    }
  },
  zod$(menuOptionSchema.extend({
    id: z.string().optional() // Para updates
  }))
)

// Action para eliminar opción
export const useDeleteMenuOptionAction = routeAction$(
  async (data) => {
    // TODO: Implementar eliminación en Supabase
    console.log('Deleting menu option:', data.id)
    
    return {
      success: true,
      message: 'Opción eliminada correctamente'
    }
  },
  zod$({
    id: z.string().min(1, 'ID requerido')
  })
)

export default component$(() => {
  const menuData = useMenuAdminLoader()
  const menuOptionAction = useMenuOptionAction()
  const deleteAction = useDeleteMenuOptionAction()
  
  // Estados del componente
  const selectedOption = useSignal<MenuOption | null>(null)
  const isDialogOpen = useSignal(false)
  const viewMode = useSignal<'list' | 'tree' | 'preview'>('list')
  
  // Store para formulario
  const formData = useStore<CreateMenuOptionDTO>({
    title: '',
    description: '',
    icon: '',
    icon_url: '',
    path: '',
    external_url: '',
    type: 'item',
    order_index: 1,
    section_title: '',
    is_visible: true,
    is_enabled: true,
    is_public: false,
    badge_text: '',
    badge_variant_id: '',
    badge_color: '',
    opens_in_new_tab: false,
    requires_confirmation: false,
    keyboard_shortcut: '',
    required_role_ids: [],
    required_permission_ids: [],
    excluded_role_ids: []
  })
  
  // Handlers
  
  const handleNew = $(() => {
    selectedOption.value = null
    // Reset formulario
    Object.assign(formData, {
      title: '',
      description: '',
      icon: '',
      icon_url: '',
      path: '',
      external_url: '',
      type: 'item',
      order_index: 1,
      section_title: '',
      is_visible: true,
      is_enabled: true,
      is_public: false,
      badge_text: '',
      badge_color: '',
      opens_in_new_tab: false,
      requires_confirmation: false,
      keyboard_shortcut: ''
    })
    isDialogOpen.value = true
  })
  
  const handleDelete = $((option: MenuOption) => {
    if (confirm(`¿Eliminar la opción "${option.title}"?`)) {
      deleteAction.submit({ id: option.id })
    }
  })
  
  // Columnas para DataTable
  const columns: Column<MenuOption>[] = [
    {
      id: 'title',
      header: 'Título',
      accessorKey: 'title' as keyof MenuOption,
      cell: $((_: any, option: MenuOption) => (
        <div class="flex items-center gap-2">
          <span class="text-lg">{option.icon}</span>
          <div>
            <div class="font-medium">{option.title}</div>
            {option.description && (
              <div class="text-sm text-gray-500">{option.description}</div>
            )}
          </div>
        </div>
      ))
    },
    {
      id: 'type',
      header: 'Tipo',
      accessorKey: 'type' as keyof MenuOption,
      cell: $((value: string, _: MenuOption) => (
        <Badge variant="outline">
          {value === 'group' ? '📁 Grupo' : value === 'item' ? '📄 Item' : '➖ Separador'}
        </Badge>
      ))
    },
    {
      id: 'path',
      header: 'Ruta',
      accessorKey: 'path' as keyof MenuOption,
      cell: $((_: any, option: MenuOption) => option.path || option.external_url || '-')
    },
    {
      id: 'status',
      header: 'Estado',
      accessorKey: 'status' as keyof MenuOption,
      cell: $((_: any, option: MenuOption) => (
        <div class="flex gap-1">
          {option.is_visible && <Badge variant="outline" class="text-xs">Visible</Badge>}
          {option.is_enabled && <Badge variant="outline" class="text-xs">Activo</Badge>}
          {option.is_public && <Badge variant="outline" class="text-xs">Público</Badge>}
          {option.is_system && <Badge variant="destructive" class="text-xs">Sistema</Badge>}
        </div>
      ))
    },
    {
      id: 'actions',
      header: 'Acciones',
      cell: $((_: any, row: MenuOption) => (
        <div class="flex gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick$={() => {
              selectedOption.value = row
              isDialogOpen.value = true
            }}
          >
            ✏️ Editar
          </Button>
          <Button
            size="sm"
            variant="destructive"
            onClick$={() => handleDelete(row)}
            disabled={row.is_system}
          >
            🗑️ Eliminar
          </Button>
        </div>
      ))
    }
  ]

  return (
    <div class="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-3xl font-bold text-gray-900">🎛️ Administración de Menú</h1>
          <p class="text-gray-600 mt-1">
            Gestiona opciones de menú, permisos y configuración del sistema
          </p>
        </div>
        <div class="flex gap-3">
          <Button variant="outline" onClick$={() => viewMode.value = viewMode.value === 'list' ? 'tree' : 'list'}>
            {viewMode.value === 'list' ? '🌳 Vista Árbol' : '📋 Vista Lista'}
          </Button>
          <Button onClick$={handleNew}>
            ➕ Nueva Opción
          </Button>
        </div>
      </div>

      {/* Estadísticas */}
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent class="p-4">
            <div class="text-2xl font-bold text-blue-600">{menuData.value.statistics.total_menu_options}</div>
            <div class="text-sm text-gray-600">Total Opciones</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent class="p-4">
            <div class="text-2xl font-bold text-green-600">{menuData.value.statistics.active_menu_options}</div>
            <div class="text-sm text-gray-600">Opciones Activas</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent class="p-4">
            <div class="text-2xl font-bold text-purple-600">{menuData.value.statistics.total_roles}</div>
            <div class="text-sm text-gray-600">Roles</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent class="p-4">
            <div class="text-2xl font-bold text-orange-600">{menuData.value.statistics.total_permissions}</div>
            <div class="text-sm text-gray-600">Permisos</div>
          </CardContent>
        </Card>
      </div>

      {/* Mensajes de estado */}
      {menuOptionAction.value?.success && (
        <div class="p-4 bg-green-50 border border-green-200 rounded-md">
          <p class="text-green-800">✅ {menuOptionAction.value.message}</p>
        </div>
      )}

      {deleteAction.value?.success && (
        <div class="p-4 bg-green-50 border border-green-200 rounded-md">
          <p class="text-green-800">✅ {deleteAction.value.message}</p>
        </div>
      )}

      {/* Tabla de opciones */}
      <Card>
        <CardHeader>
          <CardTitle>Opciones de Menú</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable
            data={menuData.value.menuOptions}
            columns={columns}
          />
        </CardContent>
      </Card>

      {/* Dialog de formulario */}
      <Dialog open={isDialogOpen.value} onOpenChange$={(open) => isDialogOpen.value = open}>
        <DialogContent class="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {selectedOption.value ? '✏️ Editar Opción' : '➕ Nueva Opción'}
            </DialogTitle>
          </DialogHeader>

          <Form action={menuOptionAction} class="space-y-6">
            {selectedOption.value && (
              <input type="hidden" name="id" value={selectedOption.value.id} />
            )}

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Información básica */}
              <div class="space-y-4">
                <h3 class="text-lg font-semibold text-gray-900">Información Básica</h3>
                
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">
                    Título *
                  </label>
                  <Input
                    name="title"
                    value={formData.title}
                    placeholder="Ej: Dashboard, Clientes..."
                    required
                  />
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">
                    Descripción
                  </label>
                  <Textarea
                    name="description"
                    value={formData.description}
                    placeholder="Descripción opcional del elemento"
                    rows={3}
                  />
                </div>

                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">
                      Icono
                    </label>
                    <Input
                      name="icon"
                      value={formData.icon}
                      placeholder="📊 o dashboard"
                    />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">
                      URL Icono
                    </label>
                    <Input
                      name="icon_url"
                      value={formData.icon_url}
                      placeholder="https://..."
                      type="url"
                    />
                  </div>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">
                    Tipo *
                  </label>
                  <Select name="type" value={formData.type}>
                    <SelectOption value="item">Elemento</SelectOption>
                    <SelectOption value="group">Grupo</SelectOption>
                    <SelectOption value="separator">Separador</SelectOption>
                  </Select>
                </div>
              </div>

              {/* Navegación y jerarquía */}
              <div class="space-y-4">
                <h3 class="text-lg font-semibold text-gray-900">Navegación</h3>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">
                    Ruta Interna
                  </label>
                  <Input
                    name="path"
                    value={formData.path}
                    placeholder="/dashboard, /clients..."
                  />
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">
                    URL Externa
                  </label>
                  <Input
                    name="external_url"
                    value={formData.external_url}
                    placeholder="https://help.example.com"
                    type="url"
                  />
                </div>

                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">
                      Orden *
                    </label>
                    <Input
                      name="order"
                      value={String(formData.order_index)}
                      type="number"
                    />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">
                      Atajo Teclado
                    </label>
                    <Input
                      name="keyboard_shortcut"
                      value={formData.keyboard_shortcut || ''}
                      placeholder="Ej: Ctrl+K"
                    />
                  </div>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">
                    Título de Sección
                  </label>
                  <Input
                    name="section_title"
                    value={formData.section_title}
                    placeholder="Panel Principal, CRM..."
                  />
                </div>
              </div>
            </div>

            {/* Badge y comportamiento */}
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div class="space-y-4">
                <h3 class="text-lg font-semibold text-gray-900">Badge</h3>
                
                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">
                      Texto Badge
                    </label>
                    <Input
                      name="badge_text"
                      value={formData.badge_text}
                      placeholder="NEW, 5, !"
                    />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">
                      Color Badge
                    </label>
                    <Input
                      name="badge_color"
                      value={formData.badge_color || ''}
                      placeholder="#ff0000"
                    />
                  </div>
                </div>
              </div>

              <div class="space-y-4">
                <h3 class="text-lg font-semibold text-gray-900">Comportamiento</h3>
                
                <div class="space-y-3">
                  <label class="flex items-center gap-2">
                    <Checkbox
                      name="opens_in_new_tab"
                      checked={formData.opens_in_new_tab}
                    />
                    <span class="text-sm">Abrir en nueva pestaña</span>
                  </label>
                  
                  <label class="flex items-center gap-2">
                    <Checkbox
                      name="requires_confirmation"
                      checked={formData.requires_confirmation}
                    />
                    <span class="text-sm">Requiere confirmación</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Estados */}
            <div class="space-y-4">
              <h3 class="text-lg font-semibold text-gray-900">Estados</h3>
              
              <div class="grid grid-cols-3 gap-6">
                <label class="flex items-center gap-2">
                  <Checkbox
                    name="is_visible"
                    checked={formData.is_visible}
                  />
                  <span class="text-sm font-medium">Visible</span>
                </label>
                
                <label class="flex items-center gap-2">
                  <Checkbox
                    name="is_enabled"
                    checked={formData.is_enabled}
                  />
                  <span class="text-sm font-medium">Habilitado</span>
                </label>
                
                <label class="flex items-center gap-2">
                  <Checkbox
                    name="is_public"
                    checked={formData.is_public}
                  />
                  <span class="text-sm font-medium">Público</span>
                </label>
              </div>
            </div>

            {/* Errores de validación */}
            {menuOptionAction.value?.fieldErrors && (
              <div class="p-4 bg-red-50 border border-red-200 rounded-md">
                <h4 class="text-sm font-medium text-red-800 mb-2">Errores de validación:</h4>
                <ul class="text-sm text-red-600 space-y-1">
                  {Object.entries(menuOptionAction.value.fieldErrors).map(([field, errors]) => (
                    <li key={field}>• {field}: {Array.isArray(errors) ? errors[0] : errors}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Botones */}
            <div class="flex justify-end gap-3 pt-4 border-t">
              <Button
                type="button"
                variant="outline"
                onClick$={() => isDialogOpen.value = false}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={menuOptionAction.isRunning}
              >
                {menuOptionAction.isRunning 
                  ? 'Guardando...' 
                  : selectedOption.value ? 'Actualizar' : 'Crear'
                }
              </Button>
            </div>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  )
})
