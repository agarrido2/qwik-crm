import { component$, Slot, useSignal, $, type QRL } from '@builder.io/qwik'
import { cn } from '~/lib/utils'

export interface TabsProps {
  class?: string
  defaultValue?: string
  value?: string
  onValueChange$?: QRL<(value: string) => void>
}

export const Tabs = component$<TabsProps>(({
  class: className,
  defaultValue,
  value,
  onValueChange$
}) => {
  const activeTab = useSignal(value || defaultValue || '')

  const handleTabChange = $((newValue: string) => {
    activeTab.value = newValue
    if (onValueChange$) {
      onValueChange$(newValue)
    }
  })

  return (
    <div class={cn('w-full', className)} data-tabs data-value={activeTab.value}>
      <Slot activeTab={activeTab.value} onTabChange={handleTabChange} />
    </div>
  )
})

export interface TabsListProps {
  class?: string
}

export const TabsList = component$<TabsListProps>(({ class: className }) => {
  return (
    <div
      class={cn(
        'inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground',
        className
      )}
      role="tablist"
    >
      <Slot />
    </div>
  )
})

export interface TabsTriggerProps {
  class?: string
  value: string
  disabled?: boolean
}

export const TabsTrigger = component$<TabsTriggerProps>(({
  class: className,
  value,
  disabled = false
}) => {
  return (
    <button
      type="button"
      role="tab"
      class={cn(
        'inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium',
        'ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
        'disabled:pointer-events-none disabled:opacity-50',
        'data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm',
        className
      )}
      data-value={value}
      disabled={disabled}
      aria-selected="false"
    >
      <Slot />
    </button>
  )
})

export interface TabsContentProps {
  class?: string
  value: string
}

export const TabsContent = component$<TabsContentProps>(({
  class: className,
  value
}) => {
  return (
    <div
      class={cn(
        'mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
        className
      )}
      role="tabpanel"
      data-value={value}
      tabIndex={0}
    >
      <Slot />
    </div>
  )
})

export interface AccordionProps {
  class?: string
  type?: 'single' | 'multiple'
  collapsible?: boolean
}

export const Accordion = component$<AccordionProps>(({
  class: className,
  type = 'single',
  collapsible = false
}) => {
  return (
    <div class={cn('w-full', className)} data-accordion data-type={type}>
      <Slot />
    </div>
  )
})

export interface AccordionItemProps {
  class?: string
  value: string
}

export const AccordionItem = component$<AccordionItemProps>(({
  class: className,
  value
}) => {
  const isOpen = useSignal(false)

  return (
    <div class={cn('border-b', className)} data-value={value}>
      <Slot isOpen={isOpen.value} toggle={() => isOpen.value = !isOpen.value} />
    </div>
  )
})

export interface AccordionTriggerProps {
  class?: string
}

export const AccordionTrigger = component$<AccordionTriggerProps>(({
  class: className
}) => {
  return (
    <button
      type="button"
      class={cn(
        'flex flex-1 items-center justify-between py-4 font-medium transition-all hover:underline',
        '[&[data-state=open]>svg]:rotate-180',
        className
      )}
    >
      <Slot />
      <svg
        class="h-4 w-4 shrink-0 transition-transform duration-200"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
      </svg>
    </button>
  )
})

export interface AccordionContentProps {
  class?: string
}

export const AccordionContent = component$<AccordionContentProps>(({
  class: className
}) => {
  return (
    <div
      class={cn(
        'overflow-hidden text-sm transition-all data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down',
        className
      )}
    >
      <div class="pb-4 pt-0">
        <Slot />
      </div>
    </div>
  )
})
