import * as Dialog from '@radix-ui/react-dialog'
import { motion } from 'framer-motion'
import { X } from 'lucide-react'
import { expo } from '@/lib/motion'
import type { ReactNode } from 'react'

interface SlideOverProps {
  open: boolean
  onClose: () => void
  title: string
  description?: string
  children: ReactNode
  footer?: ReactNode
}

export function SlideOver({ open, onClose, title, description, children, footer }: SlideOverProps) {
  return (
    <Dialog.Root open={open} onOpenChange={(o) => !o && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay asChild>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-overlay bg-ink/40 backdrop-blur-sm"
          />
        </Dialog.Overlay>
        <Dialog.Content asChild>
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.35, ease: expo }}
            className="fixed inset-y-0 right-0 z-modal flex w-full max-w-md flex-col bg-surface-card shadow-float-lg outline-none"
          >
            <div className="flex items-start justify-between gap-4 border-b border-surface-border px-6 py-5">
              <div>
                <Dialog.Title className="text-base font-semibold text-ink font-display">{title}</Dialog.Title>
                {description && (
                  <Dialog.Description className="mt-1 text-xs text-muted-500">{description}</Dialog.Description>
                )}
              </div>
              <Dialog.Close className="w-9 h-9 flex items-center justify-center rounded-full text-muted-500 hover:bg-surface-subtle hover:text-ink transition-colors">
                <X className="w-4 h-4" />
              </Dialog.Close>
            </div>
            <div className="flex-1 overflow-y-auto px-6 py-6">{children}</div>
            {footer && (
              <div className="border-t border-surface-border px-6 py-4 flex items-center justify-end gap-3 bg-surface-card">
                {footer}
              </div>
            )}
          </motion.div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
