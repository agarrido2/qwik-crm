import { component$, useStore, $, type PropFunction } from '@builder.io/qwik'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './table'
import { Button } from './button'
import { Input } from './input'
import { Badge } from './badge'

// Función cn simple sin dependencias externas
const cn = (...classes: (string | undefined)[]) => {
  return classes.filter(Boolean).join(' ')
}

export interface Column<T = any> {
  id: string
  header: string
  accessorKey?: keyof T
  cell?: (value: any, row: T) => any
  sortable?: boolean
  filterable?: boolean
  width?: string
}

export interface DataTableProps<T = any> {
  data: T[]
  columns: Column<T>[]
  searchable?: boolean
  searchPlaceholder?: string
  pagination?: boolean
  pageSize?: number
  sortable?: boolean
  filterable?: boolean
  onRowClick$?: PropFunction<(row: T) => void>
  class?: string
}

export interface DataTableState {
  searchTerm: string
  sortColumn: string | null
  sortDirection: 'asc' | 'desc'
  currentPage: number
  pageSize: number
  filters: Record<string, string>
}

export const DataTable = component$<DataTableProps>(({
  data,
  columns,
  searchable = true,
  searchPlaceholder = "Buscar...",
  pagination = true,
  pageSize = 10,
  sortable = true,
  // filterable = false, // TODO: Implementar filtros por columna
  onRowClick$,
  class: className
}) => {
  const state = useStore<DataTableState>({
    searchTerm: '',
    sortColumn: columns.find(col => col.sortable !== false)?.id || null, // Primera columna ordenable por defecto
    sortDirection: 'asc',
    currentPage: 1,
    pageSize,
    filters: {}
  })

  // Filtrar datos por búsqueda
  const filteredData = data.filter(row => {
    if (!state.searchTerm) return true
    
    return columns.some(column => {
      if (!column.accessorKey) return false
      const value = row[column.accessorKey]
      return String(value).toLowerCase().includes(state.searchTerm.toLowerCase())
    })
  })

  // Ordenar datos
  const sortedData = [...filteredData].sort((a, b) => {
    if (!state.sortColumn) return 0
    
    const column = columns.find(col => col.id === state.sortColumn)
    if (!column?.accessorKey) return 0
    
    const aValue = a[column.accessorKey]
    const bValue = b[column.accessorKey]
    
    if (aValue < bValue) return state.sortDirection === 'asc' ? -1 : 1
    if (aValue > bValue) return state.sortDirection === 'asc' ? 1 : -1
    return 0
  })

  // Paginar datos
  const startIndex = (state.currentPage - 1) * state.pageSize
  const endIndex = startIndex + state.pageSize
  const paginatedData = pagination ? sortedData.slice(startIndex, endIndex) : sortedData
  
  const totalPages = Math.ceil(sortedData.length / state.pageSize)

  const handleSort = $((columnId: string) => {
    if (state.sortColumn === columnId) {
      state.sortDirection = state.sortDirection === 'asc' ? 'desc' : 'asc'
    } else {
      state.sortColumn = columnId
      state.sortDirection = 'asc'
    }
  })

  const handleSearch = $((value: string) => {
    state.searchTerm = value
    state.currentPage = 1 // Reset to first page
  })

  const handlePageChange = $((page: number) => {
    state.currentPage = page
  })

  const renderCellValue = (column: Column, row: any) => {
    if (column.cell) {
      return column.cell(row[column.accessorKey!], row)
    }
    
    if (column.accessorKey) {
      const value = row[column.accessorKey]
      
      // Renderizado especial para tipos comunes
      if (typeof value === 'boolean') {
        return <Badge variant={value ? 'default' : 'secondary'}>{value ? 'Sí' : 'No'}</Badge>
      }
      
      if (value instanceof Date) {
        return value.toLocaleDateString()
      }
      
      return String(value)
    }
    
    return ''
  }

  return (
    <div class={cn('space-y-4', className)}>
      {/* Barra de búsqueda */}
      {searchable && (
        <div class="flex items-center space-x-2">
          <Input
            placeholder={searchPlaceholder}
            value={state.searchTerm}
            onInput$={(_, el) => handleSearch(el.value)}
            class="max-w-sm"
          />
          {state.searchTerm && (
            <Button
              variant="outline"
              size="sm"
              onClick$={() => handleSearch('')}
            >
              Limpiar
            </Button>
          )}
        </div>
      )}

      {/* Tabla */}
      <div class="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((column) => {
                const columnId = column.id // Extract the serializable value
                return (
                <TableHead
                  key={column.id}
                  class={cn(
                    column.width && `w-[${column.width}]`,
                    sortable && column.sortable !== false ? 'cursor-pointer select-none hover:bg-muted/50' : '',
                    'font-secondary text-[16px] font-semibold' // Lufga SemiBold (600) para cabeceras
                  )}
                  onClick$={sortable && column.sortable !== false ? $(() => handleSort(columnId)) : undefined}
                >
                  <div class="flex items-center space-x-1">
                    <span>{column.header}</span>
                    {sortable && column.sortable !== false && state.sortColumn === column.id && (
                      <span class="text-xs">
                        {state.sortDirection === 'asc' ? '▲' : '▼'}
                      </span>
                    )}
                  </div>
                </TableHead>
                )
              })}
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedData.length === 0 ? (
              <TableRow>
                <td class="h-24 text-center p-4 align-middle" colSpan={columns.length}>
                  No se encontraron resultados.
                </td>
              </TableRow>
            ) : (
              paginatedData.map((row, index) => (
                <TableRow
                  key={index}
                  class={onRowClick$ ? 'cursor-pointer' : ''}
                  onClick$={onRowClick$ ? $(() => onRowClick$(row)) : undefined}
                >
                  {columns.map((column) => (
                    <TableCell key={column.id}>
                      {renderCellValue(column, row)}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Paginación */}
      {pagination && totalPages > 1 && (
        <div class="flex items-center justify-between">
          <div class="text-sm text-muted-foreground">
            Mostrando {startIndex + 1} a {Math.min(endIndex, sortedData.length)} de {sortedData.length} resultados
          </div>
          <div class="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              disabled={state.currentPage === 1}
              onClick$={() => handlePageChange(state.currentPage - 1)}
            >
              Anterior
            </Button>
            
            {/* Números de página */}
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const pageNum = Math.max(1, Math.min(totalPages - 4, state.currentPage - 2)) + i
              if (pageNum > totalPages) return null
              
              return (
                <Button
                  key={pageNum}
                  variant={state.currentPage === pageNum ? 'default' : 'outline'}
                  size="sm"
                  class="font-secondary font-semibold"
                  onClick$={() => handlePageChange(pageNum)}
                >
                  {pageNum}
                </Button>
              )
            })}
            
            <Button
              variant="outline"
              size="sm"
              disabled={state.currentPage === totalPages}
              onClick$={() => handlePageChange(state.currentPage + 1)}
            >
              Siguiente
            </Button>
          </div>
        </div>
      )}
    </div>
  )
})
