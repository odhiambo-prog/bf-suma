import * as AlertDialog from '@radix-ui/react-alert-dialog'
import { cn } from '@/lib/utils'
import { buttonVariants } from '@/components/ui/Button'

interface ConfirmDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description?: string
  confirmLabel?: string
  cancelLabel?: string
  onConfirm: () => void
}

export function ConfirmDialog({
  open, onOpenChange, title, description, confirmLabel = 'Delete', cancelLabel = 'Cancel', onConfirm,
}: ConfirmDialogProps) {
  return (
    <AlertDialog.Root open={open} onOpenChange={onOpenChange}>
      <AlertDialog.Portal>
        <AlertDialog.Overlay className="fixed inset-0 z-overlay bg-ink/40 backdrop-blur-sm data-[state=open]:animate-[fadeIn_0.2s] data-[state=closed]:animate-[fadeOut_0.2s]" />
        <AlertDialog.Content
          className={cn(
            'fixed left-1/2 top-1/2 z-modal w-[90vw] max-w-sm -translate-x-1/2 -translate-y-1/2',
            'rounded-2xl bg-surface-card p-6 shadow-float-lg outline-none',
          )}
        >
          <AlertDialog.Title className="text-base font-semibold text-ink font-display">{title}</AlertDialog.Title>
          {description && <AlertDialog.Description className="mt-2 text-sm text-muted-500 leading-relaxed">{description}</AlertDialog.Description>}
          <div className="mt-6 flex items-center justify-end gap-3">
            <AlertDialog.Cancel className={buttonVariants({ variant: 'secondary', size: 'sm' })}>
              {cancelLabel}
            </AlertDialog.Cancel>
            <AlertDialog.Action
              onClick={onConfirm}
              className={buttonVariants({ variant: 'danger', size: 'sm' })}
            >
              {confirmLabel}
            </AlertDialog.Action>
          </div>
        </AlertDialog.Content>
      </AlertDialog.Portal>
    </AlertDialog.Root>
  )
}
