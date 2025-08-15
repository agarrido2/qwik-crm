import { component$, $, useContext } from '@builder.io/qwik'
import { ToastContext, type ToastData } from '~/hooks/use-toast'
import { Toast, ToastClose, ToastDescription, ToastTitle } from './toast'

export const Toaster = component$(() => {
  const store = useContext(ToastContext)

  return (
    <div class="fixed top-0 z-[100] flex max-h-screen w-full flex-col-reverse p-4 sm:bottom-0 sm:right-0 sm:top-auto sm:flex-col md:max-w-[420px]">
      {store.toasts.map((toast: ToastData) => {
        const toastId = toast.id
        const hasAction = !!toast.action
        const actionLabel = toast.action?.label || ''
        const actionId = toast.action?.actionId || ''
        
        return (
          <Toast
            key={toastId}
            variant={toast.variant}
            duration={toast.duration}
            onOpenChange$={$((open: boolean) => {
              if (!open) {
                store.toasts = store.toasts.filter((t: ToastData) => t.id !== toastId)
              }
            })}
          >
            <div class="grid gap-1">
              {toast.title && <ToastTitle>{toast.title}</ToastTitle>}
              {toast.description && <ToastDescription>{toast.description}</ToastDescription>}
            </div>
            {hasAction && (
              <button
                type="button"
                class="inline-flex h-8 shrink-0 items-center justify-center rounded-md border bg-transparent px-3 text-sm font-medium transition-colors hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                onClick$={$(() => {
                  // Dispatch evento con actionId serializable
                  const event = new CustomEvent('toast-action', { 
                    detail: { toastId, actionId, actionLabel } 
                  })
                  document.dispatchEvent(event)
                })}
              >
                {actionLabel}
              </button>
            )}
            <ToastClose onClick$={$(() => {
              store.toasts = store.toasts.filter((t: ToastData) => t.id !== toastId)
            })} />
          </Toast>
        )
      })}
    </div>
  )
})
