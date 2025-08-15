import { component$, $ } from '@builder.io/qwik'
import { 
  Button, 
  Card, 
  CardHeader, 
  CardTitle, 
  CardContent,
  DataTable,
  Badge,
  Input,
  Avatar,
  AvatarImage,
  AvatarFallback,
  Toast,
  ToastTitle,
  ToastDescription
} from '~/components/ui'

// Datos de ejemplo para la tabla
const sampleClients = [
  { id: 1, nombre: 'Ana García', email: 'ana@empresa.com', telefono: '+34 600 123 456', estado: 'Activo', fechaRegistro: '2024-01-15' },
  { id: 2, nombre: 'Carlos López', email: 'carlos@startup.com', telefono: '+34 600 234 567', estado: 'Inactivo', fechaRegistro: '2024-02-20' },
  { id: 3, nombre: 'María Rodríguez', email: 'maria@tech.com', telefono: '+34 600 345 678', estado: 'Activo', fechaRegistro: '2024-03-10' },
  { id: 4, nombre: 'José Martín', email: 'jose@consulting.com', telefono: '+34 600 456 789', estado: 'Pendiente', fechaRegistro: '2024-03-25' },
  { id: 5, nombre: 'Laura Sánchez', email: 'laura@design.com', telefono: '+34 600 567 890', estado: 'Activo', fechaRegistro: '2024-04-05' }
]

// Definición de columnas para la tabla
const clientColumns = [
  {
    id: 'nombre',
    header: 'Cliente',
    accessorKey: 'nombre' as keyof typeof sampleClients[0],
    sortable: true
  },
  {
    id: 'email',
    header: 'Email',
    accessorKey: 'email' as keyof typeof sampleClients[0],
    sortable: true
  },
  {
    id: 'telefono',
    header: 'Teléfono',
    accessorKey: 'telefono' as keyof typeof sampleClients[0]
  },
  {
    id: 'estado',
    header: 'Estado',
    accessorKey: 'estado' as keyof typeof sampleClients[0],
    cell: $((value: string) => {
      const variant = value === 'Activo' ? 'default' : value === 'Inactivo' ? 'secondary' : 'outline'
      return <Badge variant={variant}>{value}</Badge>
    }),
    sortable: true
  },
  {
    id: 'fechaRegistro',
    header: 'Fecha Registro',
    accessorKey: 'fechaRegistro' as keyof typeof sampleClients[0],
    sortable: true
  }
]

export default component$(() => {
  return (
    <div class="p-6 max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div class="mb-8">
        <h1 class="text-4xl font-bold text-foreground mb-2 font-secondary">DataTable Demo</h1>
        <p class="text-muted-foreground font-primary text-lg">
          Demostración del componente DataTable con datos de clientes
        </p>
      </div>

      {/* DataTable Demo */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Clientes</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable 
            data={sampleClients}
            columns={clientColumns}
            searchable={true}
            searchPlaceholder="Buscar clientes..."
            pagination={true}
            pageSize={3}
            sortable={true}
            onRowClick$={(client) => {
              console.log('Cliente seleccionado:', client)
            }}
          />
        </CardContent>
      </Card>

      {/* Pruebas de Botones */}
      <Card>
        <CardHeader>
          <CardTitle class="font-secondary text-2xl">🎯 Pruebas de Botones</CardTitle>
        </CardHeader>
        <CardContent class="space-y-6">
          {/* Variantes de botones */}
          <div>
            <h3 class="font-primary font-semibold text-lg mb-3">Variantes</h3>
            <div class="flex flex-wrap gap-3">
              <Button variant="default">Default</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="outline">Outline</Button>
              <Button variant="destructive">Destructive</Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="link">Link</Button>
            </div>
          </div>

          {/* Tamaños de botones */}
          <div>
            <h3 class="font-primary font-semibold text-lg mb-3">Tamaños</h3>
            <div class="flex flex-wrap items-center gap-3">
              <Button size="sm">Pequeño</Button>
              <Button size="default">Default</Button>
              <Button size="lg">Grande</Button>
              <Button size="xl">Extra Grande</Button>
              <Button size="icon">🔍</Button>
            </div>
          </div>

          {/* Estados de botones */}
          <div>
            <h3 class="font-primary font-semibold text-lg mb-3">Estados</h3>
            <div class="flex flex-wrap gap-3">
              <Button>Normal</Button>
              <Button disabled>Deshabilitado</Button>
              <Button variant="outline" disabled>Outline Deshabilitado</Button>
              <Button variant="destructive" disabled>Destructive Deshabilitado</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Pruebas de Input */}
      <Card>
        <CardHeader>
          <CardTitle class="font-secondary text-2xl">📝 Pruebas de Input</CardTitle>
        </CardHeader>
        <CardContent class="space-y-6">
          <div>
            <h3 class="font-primary font-semibold text-lg mb-3">Variantes</h3>
            <div class="space-y-3">
              <Input placeholder="Input default" />
              <Input variant="destructive" placeholder="Input con error" />
              <Input variant="success" placeholder="Input exitoso" />
            </div>
          </div>
          
          <div>
            <h3 class="font-primary font-semibold text-lg mb-3">Tamaños</h3>
            <div class="space-y-3">
              <Input size="sm" placeholder="Input pequeño" />
              <Input size="default" placeholder="Input default" />
              <Input size="lg" placeholder="Input grande" />
              <Input size="xl" placeholder="Input extra grande" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Pruebas de Badge */}
      <Card>
        <CardHeader>
          <CardTitle class="font-secondary text-2xl">🏷️ Pruebas de Badge</CardTitle>
        </CardHeader>
        <CardContent class="space-y-6">
          <div>
            <h3 class="font-primary font-semibold text-lg mb-3">Variantes</h3>
            <div class="flex flex-wrap gap-3">
              <Badge variant="default">Default</Badge>
              <Badge variant="secondary">Secondary</Badge>
              <Badge variant="destructive">Destructive</Badge>
              <Badge variant="outline">Outline</Badge>
              <Badge variant="success">Success</Badge>
              <Badge variant="warning">Warning</Badge>
              <Badge variant="info">Info</Badge>
            </div>
          </div>
          
          <div>
            <h3 class="font-primary font-semibold text-lg mb-3">Tamaños</h3>
            <div class="flex flex-wrap gap-3 items-center">
              <Badge size="sm">Pequeño</Badge>
              <Badge size="default">Default</Badge>
              <Badge size="lg">Grande</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Pruebas de Avatar */}
      <Card>
        <CardHeader>
          <CardTitle class="font-secondary text-2xl">👤 Pruebas de Avatar</CardTitle>
        </CardHeader>
        <CardContent class="space-y-6">
          <div>
            <h3 class="font-primary font-semibold text-lg mb-3">Con Imagen</h3>
            <div class="flex flex-wrap gap-3 items-center">
              <Avatar size="sm">
                <AvatarImage src="https://github.com/shadcn.png" alt="Avatar" />
                <AvatarFallback size="sm">CN</AvatarFallback>
              </Avatar>
              <Avatar size="default">
                <AvatarImage src="https://github.com/shadcn.png" alt="Avatar" />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
              <Avatar size="lg">
                <AvatarImage src="https://github.com/shadcn.png" alt="Avatar" />
                <AvatarFallback size="lg">CN</AvatarFallback>
              </Avatar>
              <Avatar size="xl">
                <AvatarImage src="https://github.com/shadcn.png" alt="Avatar" />
                <AvatarFallback size="xl">CN</AvatarFallback>
              </Avatar>
            </div>
          </div>
          
          <div>
            <h3 class="font-primary font-semibold text-lg mb-3">Solo Fallback</h3>
            <div class="flex flex-wrap gap-3 items-center">
              <Avatar size="sm">
                <AvatarFallback size="sm">JD</AvatarFallback>
              </Avatar>
              <Avatar size="default">
                <AvatarFallback>JD</AvatarFallback>
              </Avatar>
              <Avatar size="lg">
                <AvatarFallback size="lg">JD</AvatarFallback>
              </Avatar>
              <Avatar size="2xl">
                <AvatarFallback size="2xl">JD</AvatarFallback>
              </Avatar>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Pruebas de Toast */}
      <Card>
        <CardHeader>
          <CardTitle class="font-secondary text-2xl">🔔 Pruebas de Toast</CardTitle>
        </CardHeader>
        <CardContent class="space-y-6">
          <div>
            <h3 class="font-primary font-semibold text-lg mb-3">Variantes</h3>
            <div class="space-y-3">
              <Toast variant="default">
                <div class="grid gap-1">
                  <ToastTitle>Toast Default</ToastTitle>
                  <ToastDescription>Este es un toast de información general.</ToastDescription>
                </div>
              </Toast>
              
              <Toast variant="success">
                <div class="grid gap-1">
                  <ToastTitle>¡Éxito!</ToastTitle>
                  <ToastDescription>La operación se completó correctamente.</ToastDescription>
                </div>
              </Toast>
              
              <Toast variant="warning">
                <div class="grid gap-1">
                  <ToastTitle>Advertencia</ToastTitle>
                  <ToastDescription>Hay algo que requiere tu atención.</ToastDescription>
                </div>
              </Toast>
              
              <Toast variant="destructive">
                <div class="grid gap-1">
                  <ToastTitle>Error</ToastTitle>
                  <ToastDescription>Ocurrió un error inesperado.</ToastDescription>
                </div>
              </Toast>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Prueba de Interactividad */}
      <Card>
        <CardHeader>
          <CardTitle class="font-secondary text-2xl">⚡ Prueba de Interactividad</CardTitle>
        </CardHeader>
        <CardContent>
          <p class="font-primary text-muted-foreground mb-4">
            Todos los componentes tienen efectos hover, focus y transiciones suaves.
          </p>
          <div class="flex flex-wrap gap-3">
            <Button onClick$={() => alert('¡Botón Default clickeado!')}>
              Probar Click
            </Button>
            <Button variant="outline" onClick$={() => console.log('Botón Outline clickeado')}>
              Log a Consola
            </Button>
            <Button variant="secondary" onClick$={() => confirm('¿Confirmar acción?')}>
              Mostrar Confirm
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Estado de Migración */}
      <Card class="border-green-200 bg-green-50">
        <CardHeader>
          <CardTitle class="font-secondary text-green-800">✅ Componentes QwikUI Completados</CardTitle>
        </CardHeader>
        <CardContent>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-green-700 font-primary">
            <div class="space-y-2">
              <p>✅ Button - Todas las variantes + hover/focus</p>
              <p>✅ Card - Con hover y transiciones</p>
              <p>✅ Input - 3 variantes + 4 tamaños</p>
              <p>✅ Badge - 7 variantes + 3 tamaños</p>
            </div>
            <div class="space-y-2">
              <p>✅ Avatar - Con imagen y fallback</p>
              <p>✅ Toast - 4 variantes con título/descripción</p>
              <p>✅ Sistema de temas CSS variables</p>
              <p>✅ Idénticos a shadcn/ui</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
})