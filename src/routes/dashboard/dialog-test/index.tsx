import { component$, useSignal, $ } from '@builder.io/qwik'
import { type DocumentHead } from '@builder.io/qwik-city'
import { 
  Button, 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogFooter, 
  DialogTitle, 
  DialogDescription, 
  DialogClose,
  Input,
  Card,
  CardHeader,
  CardTitle,
  CardContent
} from '~/components/ui'

export default component$(() => {
  const isDialogOpen = useSignal(false)
  const isConfirmDialogOpen = useSignal(false)
  const isFormDialogOpen = useSignal(false)
  const formData = useSignal({ name: '', email: '' })

  const openDialog = $(() => {
    isDialogOpen.value = true
  })

  const openConfirmDialog = $(() => {
    isConfirmDialogOpen.value = true
  })

  const openFormDialog = $(() => {
    isFormDialogOpen.value = true
  })

  const handleDialogClose = $(() => {
    isDialogOpen.value = false
  })

  const handleConfirmDialogClose = $(() => {
    isConfirmDialogOpen.value = false
  })

  const handleFormDialogClose = $(() => {
    isFormDialogOpen.value = false
  })

  const handleConfirm = $(() => {
    console.log('Confirmed!')
    isConfirmDialogOpen.value = false
  })

  const handleFormSubmit = $(() => {
    console.log('Form submitted:', formData.value)
    isFormDialogOpen.value = false
  })

  return (
    <div class="container mx-auto p-6 space-y-8">
      <div class="text-center space-y-4">
        <h1 class="text-3xl font-bold font-secondary">Dialog Component Test</h1>
        <p class="text-muted-foreground">
          Prueba de los componentes Dialog/Modal con diferentes casos de uso
        </p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Basic Dialog */}
        <Card>
          <CardHeader>
            <CardTitle>Dialog Básico</CardTitle>
          </CardHeader>
          <CardContent>
            <p class="text-sm text-muted-foreground mb-4">
              Dialog simple con información
            </p>
            <Button onClick$={openDialog}>
              Abrir Dialog
            </Button>
          </CardContent>
        </Card>

        {/* Confirmation Dialog */}
        <Card>
          <CardHeader>
            <CardTitle>Dialog de Confirmación</CardTitle>
          </CardHeader>
          <CardContent>
            <p class="text-sm text-muted-foreground mb-4">
              Dialog para confirmar acciones
            </p>
            <Button variant="destructive" onClick$={openConfirmDialog}>
              Eliminar Item
            </Button>
          </CardContent>
        </Card>

        {/* Form Dialog */}
        <Card>
          <CardHeader>
            <CardTitle>Dialog con Formulario</CardTitle>
          </CardHeader>
          <CardContent>
            <p class="text-sm text-muted-foreground mb-4">
              Dialog con campos de entrada
            </p>
            <Button variant="outline" onClick$={openFormDialog}>
              Crear Usuario
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Basic Dialog */}
      <Dialog open={isDialogOpen.value} onOpenChange$={handleDialogClose}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Información</DialogTitle>
            <DialogDescription>
              Este es un dialog básico con información importante para el usuario.
            </DialogDescription>
          </DialogHeader>
          <div class="py-4">
            <p class="text-sm">
              Los dialogs son útiles para mostrar información adicional, 
              formularios o confirmaciones sin navegar a otra página.
            </p>
          </div>
          <DialogFooter>
            <Button onClick$={handleDialogClose}>
              Entendido
            </Button>
          </DialogFooter>
          <DialogClose onClick$={handleDialogClose} />
        </DialogContent>
      </Dialog>

      {/* Confirmation Dialog */}
      <Dialog open={isConfirmDialogOpen.value} onOpenChange$={handleConfirmDialogClose}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>¿Estás seguro?</DialogTitle>
            <DialogDescription>
              Esta acción no se puede deshacer. El elemento será eliminado permanentemente.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick$={handleConfirmDialogClose}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick$={handleConfirm}>
              Eliminar
            </Button>
          </DialogFooter>
          <DialogClose onClick$={handleConfirmDialogClose} />
        </DialogContent>
      </Dialog>

      {/* Form Dialog */}
      <Dialog open={isFormDialogOpen.value} onOpenChange$={handleFormDialogClose}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Crear Nuevo Usuario</DialogTitle>
            <DialogDescription>
              Completa los campos para crear un nuevo usuario en el sistema.
            </DialogDescription>
          </DialogHeader>
          <div class="space-y-4 py-4">
            <div class="space-y-2">
              <label class="text-sm font-medium">Nombre</label>
              <Input 
                placeholder="Ingresa el nombre"
                value={formData.value.name}
                onInput$={(_, el) => {
                  formData.value = { ...formData.value, name: el.value }
                }}
              />
            </div>
            <div class="space-y-2">
              <label class="text-sm font-medium">Email</label>
              <Input 
                type="email"
                placeholder="usuario@ejemplo.com"
                value={formData.value.email}
                onInput$={(_, el) => {
                  formData.value = { ...formData.value, email: el.value }
                }}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick$={handleFormDialogClose}>
              Cancelar
            </Button>
            <Button onClick$={handleFormSubmit}>
              Crear Usuario
            </Button>
          </DialogFooter>
          <DialogClose onClick$={handleFormDialogClose} />
        </DialogContent>
      </Dialog>
    </div>
  )
})

export const head: DocumentHead = {
  title: 'Dialog Test - Qwik CRM',
  meta: [
    {
      name: 'description',
      content: 'Prueba de componentes Dialog/Modal en Qwik CRM',
    },
  ],
}
