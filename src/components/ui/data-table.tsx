import { component$, useStore, useSignal, $, type PropFunction } from '@builder.io/qwik'
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
  selectable?: boolean
  onRowClick$?: PropFunction<(row: T) => void>
  onSelectionChange$?: PropFunction<(selectedRows: T[]) => void>
  class?: string
}

export interface DataTableState {
  searchTerm: string
  sortColumn: string | null
  sortDirection: 'asc' | 'desc'
  currentPage: number
  pageSize: number
  filters: Record<string, string>
  selectedRows: Set<number>
  selectAll: boolean
}

export const DataTable = component$<DataTableProps>(({
  data,
  columns,
  searchable = true,
  searchPlaceholder = "Buscar...",
  pagination = true,
  pageSize = 10,
  sortable = true,
  selectable = false,
  // filterable = false, // TODO: Implementar filtros por columna
  onRowClick$,
  onSelectionChange$,
  class: className
}) => {
  const state = useStore<DataTableState>({
    searchTerm: '',
    sortColumn: columns.find(col => col.sortable !== false)?.id || null, // Primera columna ordenable por defecto
    sortDirection: 'asc',
    currentPage: 1,
    pageSize,
    filters: {},
    selectedRows: new Set<number>(),
    selectAll: false
  })
  
  // Force reactivity trigger for Set operations
  const forceUpdate = useSignal(0)

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

  const handleSelectAll = $(() => {
    const allCurrentlySelected = paginatedData.every((_, index) => {
      const globalIndex = startIndex + index
      return state.selectedRows.has(globalIndex)
    })
    
    if (allCurrentlySelected) {
      // Deseleccionar todas las filas visibles
      paginatedData.forEach((_, index) => {
        const globalIndex = startIndex + index
        state.selectedRows.delete(globalIndex)
      })
      state.selectAll = false
    } else {
      // Seleccionar todas las filas visibles
      paginatedData.forEach((_, index) => {
        const globalIndex = startIndex + index
        state.selectedRows.add(globalIndex)
      })
      // Solo marcar selectAll si TODAS las filas visibles están seleccionadas
      const nowAllSelected = paginatedData.every((_, index) => {
        const globalIndex = startIndex + index
        return state.selectedRows.has(globalIndex)
      })
      state.selectAll = nowAllSelected
    }
    
    // Force UI update by triggering reactivity
    forceUpdate.value++
    
    if (onSelectionChange$) {
      const selectedData = Array.from(state.selectedRows).map(index => data[index])
      onSelectionChange$(selectedData)
    }
  })

  const handleRowSelect = $((rowIndex: number) => {
    if (state.selectedRows.has(rowIndex)) {
      state.selectedRows.delete(rowIndex)
    } else {
      state.selectedRows.add(rowIndex)
    }
    
    // Force UI update by triggering reactivity
    forceUpdate.value++
    
    // Update selectAll state - debe estar checked solo si TODAS las filas visibles están seleccionadas
    const allVisibleSelected = paginatedData.length > 0 && paginatedData.every((_, index) => {
      const globalIndex = startIndex + index
      return state.selectedRows.has(globalIndex)
    })
    state.selectAll = allVisibleSelected
    
    if (onSelectionChange$) {
      const selectedData = Array.from(state.selectedRows).map(index => data[index])
      onSelectionChange$(selectedData)
    }
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
              {selectable && (
                <TableHead class="w-[50px]">
                  <input
                    type="checkbox"
                    checked={state.selectAll}
                    onChange$={handleSelectAll}
                    aria-label="Seleccionar todas las filas"
                    class="h-4 w-4 rounded border border-gray-300 focus:ring-2 focus:ring-blue-500"
                  />
                </TableHead>
              )}
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
                <td class="h-24 text-center p-4 align-middle" colSpan={columns.length + (selectable ? 1 : 0)}>
                  No se encontraron resultados.
                </td>
              </TableRow>
            ) : (
              paginatedData.map((row, index) => {
                const globalIndex = startIndex + index
                return (
                  <TableRow
                    key={index}
                    class={cn(
                      onRowClick$ ? 'cursor-pointer' : '',
                      state.selectedRows.has(globalIndex) ? 'bg-muted/50' : ''
                    )}
                    onClick$={onRowClick$ ? $(() => onRowClick$(row)) : undefined}
                  >
                    {selectable && (
                      <TableCell>
                        <input
                          type="checkbox"
                          checked={state.selectedRows.has(globalIndex) && forceUpdate.value >= 0}
                          onChange$={() => handleRowSelect(globalIndex)}
                          aria-label={`Seleccionar fila ${index + 1}`}
                          class="h-4 w-4 rounded border border-gray-300 focus:ring-2 focus:ring-blue-500"
                        />
                      </TableCell>
                    )}
                    {columns.map((column) => (
                      <TableCell key={column.id}>
                        {renderCellValue(column, row)}
                      </TableCell>
                    ))}
                  </TableRow>
                )
              })
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
