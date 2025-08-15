import { component$, useSignal, $ } from '@builder.io/qwik'
import { type DocumentHead } from '@builder.io/qwik-city'
import { 
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  SimpleDropdown, 
  DropdownMenu, 
  DropdownMenuTrigger, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuLabel 
} from '~/components/ui'

export default component$(() => {
  const isComposableOpen = useSignal(false)

  const toggleComposable = $(() => {
    isComposableOpen.value = !isComposableOpen.value
  })

  const handleEdit = $(() => {
    console.log('Edit clicked')
    isComposableOpen.value = false
  })

  const handleDelete = $(() => {
    console.log('Delete clicked')
    isComposableOpen.value = false
  })

  const handleShare = $(() => {
    console.log('Share clicked')
    isComposableOpen.value = false
  })

  return (
    <div class="container mx-auto p-6 space-y-8">
      <div class="text-center space-y-4">
        <h1 class="text-3xl font-bold font-secondary">Dropdown Menu Test</h1>
        <p class="text-muted-foreground">
          Prueba de los componentes DropdownMenu con diferentes implementaciones
        </p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Simple Dropdown */}
        <Card>
          <CardHeader>
            <CardTitle>Simple Dropdown</CardTitle>
          </CardHeader>
          <CardContent>
            <p class="text-sm text-muted-foreground mb-4">
              Dropdown con estado interno y fácil de usar
            </p>
            <SimpleDropdown triggerText="Opciones" class="w-48">
              <DropdownMenuLabel>Acciones</DropdownMenuLabel>
              <DropdownMenuItem onClick$={$(() => console.log('Ver perfil'))}>
                <svg class="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Ver perfil
              </DropdownMenuItem>
              <DropdownMenuItem onClick$={$(() => console.log('Configuración'))}>
                <svg class="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Configuración
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick$={$(() => console.log('Cerrar sesión'))}>
                <svg class="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Cerrar sesión
              </DropdownMenuItem>
            </SimpleDropdown>
          </CardContent>
        </Card>

        {/* Composable Dropdown */}
        <Card>
          <CardHeader>
            <CardTitle>Composable Dropdown</CardTitle>
          </CardHeader>
          <CardContent>
            <p class="text-sm text-muted-foreground mb-4">
              Dropdown con componentes separados para mayor control
            </p>
            <DropdownMenu class="w-48">
              <DropdownMenuTrigger onClick$={toggleComposable}>
                Acciones del elemento
              </DropdownMenuTrigger>
              <DropdownMenuContent show={isComposableOpen.value}>
                <DropdownMenuLabel>Gestión</DropdownMenuLabel>
                <DropdownMenuItem onClick$={handleEdit}>
                  <svg class="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  Editar
                </DropdownMenuItem>
                <DropdownMenuItem onClick$={handleShare}>
                  <svg class="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                  </svg>
                  Compartir
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick$={handleDelete} class="text-red-600 hover:text-red-700 hover:bg-red-50">
                  <svg class="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  Eliminar
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </CardContent>
        </Card>
      </div>

      <div class="mt-8 p-4 bg-gray-50 rounded-lg">
        <h3 class="text-lg font-semibold mb-2">Instrucciones de Uso</h3>
        <div class="space-y-2 text-sm text-gray-600">
          <p><strong>Simple Dropdown:</strong> Maneja su propio estado internamente. Ideal para casos simples.</p>
          <p><strong>Composable Dropdown:</strong> Requiere manejo manual del estado. Ideal para casos complejos.</p>
          <p>Ambos incluyen detección de clics externos y animaciones CSS.</p>
        </div>
      </div>
    </div>
  )
})

export const head: DocumentHead = {
  title: 'Dropdown Test - Qwik CRM',
  meta: [
    {
      name: 'description',
      content: 'Prueba de componentes DropdownMenu en Qwik CRM',
    },
  ],
}
