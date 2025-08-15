import { component$, Slot, type PropFunction } from '@builder.io/qwik'
import { cva, type VariantProps } from 'class-variance-authority'

// Función cn simple sin dependencias externas
const cn = (...classes: (string | undefined)[]) => {
  return classes.filter(Boolean).join(' ')
}

const tableVariants = cva(
  'w-full caption-bottom text-sm',
  {
    variants: {
      variant: {
        default: '',
        striped: '[&_tbody_tr:nth-child(odd)]:bg-muted/50',
        bordered: 'border border-border',
      },
      size: {
        sm: 'text-xs',
        default: 'text-sm',
        lg: 'text-base',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
)

export interface TableProps extends VariantProps<typeof tableVariants> {
  class?: string
}

export const Table = component$<TableProps>(({ variant, size, class: className }) => {
  return (
    <div class="relative w-full overflow-auto">
      <table class={cn(tableVariants({ variant, size }), className)}>
        <Slot />
      </table>
    </div>
  )
})

export interface TableHeaderProps {
  class?: string
}

export const TableHeader = component$<TableHeaderProps>(({ class: className }) => {
  return (
    <thead class={cn('[&_tr]:border-b', className)}>
      <Slot />
    </thead>
  )
})

export interface TableBodyProps {
  class?: string
}

export const TableBody = component$<TableBodyProps>(({ class: className }) => {
  return (
    <tbody class={cn('[&_tr:last-child]:border-0', className)}>
      <Slot />
    </tbody>
  )
})

export interface TableFooterProps {
  class?: string
}

export const TableFooter = component$<TableFooterProps>(({ class: className }) => {
  return (
    <tfoot class={cn('border-t bg-muted/50 font-medium [&>tr]:last:border-b-0', className)}>
      <Slot />
    </tfoot>
  )
})

export interface TableRowProps {
  class?: string
  onClick$?: PropFunction<() => void>
}

export const TableRow = component$<TableRowProps>(({ class: className, onClick$ }) => {
  return (
    <tr 
      class={cn('border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted', className)}
      onClick$={onClick$}
    >
      <Slot />
    </tr>
  )
})

export interface TableHeadProps {
  class?: string
  onClick$?: PropFunction<() => void>
}

export const TableHead = component$<TableHeadProps>(({ class: className, onClick$ }) => {
  return (
    <th 
      class={cn('h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0', className)}
      onClick$={onClick$}
    >
      <Slot />
    </th>
  )
})

export interface TableCellProps {
  class?: string
}

export const TableCell = component$<TableCellProps>(({ class: className }) => {
  return (
    <td class={cn('p-4 align-middle [&:has([role=checkbox])]:pr-0', className)}>
      <Slot />
    </td>
  )
})

export interface TableCaptionProps {
  class?: string
}

export const TableCaption = component$<TableCaptionProps>(({ class: className }) => {
  return (
    <caption class={cn('mt-4 text-sm text-muted-foreground', className)}>
      <Slot />
    </caption>
  )
})
