import { forwardRef, type InputHTMLAttributes, type TextareaHTMLAttributes, type ReactNode, type SelectHTMLAttributes } from 'react'
import * as Label from '@radix-ui/react-label'
import { cn } from '@/lib/utils'

export function Field({ label, htmlFor, error, hint, children, className }: {
  label?: string
  htmlFor?: string
  error?: string
  hint?: string
  children: ReactNode
  className?: string
}) {
  return (
    <div className={cn('space-y-1.5', className)}>
      {label && (
        <Label.Root htmlFor={htmlFor} className="block text-[11px] font-semibold uppercase tracking-wider text-muted-700">
          {label}
        </Label.Root>
      )}
      {children}
      {hint && !error && <p className="text-[11px] text-muted-400">{hint}</p>}
      {error && <p className="text-[11px] font-medium text-danger-600">{error}</p>}
    </div>
  )
}

const fieldBase =
  'w-full rounded-xl border bg-white px-3.5 py-2.5 text-sm text-ink placeholder:text-muted-300 transition-colors focus:outline-none focus:ring-2 focus:ring-jade-500/40 focus:border-jade-400 disabled:opacity-60'

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement> & { invalid?: boolean }>(
  ({ className, invalid, ...props }, ref) => (
    <input ref={ref} className={cn(fieldBase, invalid ? 'border-danger-300' : 'border-surface-border', className)} {...props} />
  ),
)
Input.displayName = 'Input'

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaHTMLAttributes<HTMLTextAreaElement> & { invalid?: boolean }>(
  ({ className, invalid, ...props }, ref) => (
    <textarea ref={ref} className={cn(fieldBase, 'min-h-[100px] resize-y', invalid ? 'border-danger-300' : 'border-surface-border', className)} {...props} />
  ),
)
Textarea.displayName = 'Textarea'

export const Select = forwardRef<HTMLSelectElement, SelectHTMLAttributes<HTMLSelectElement> & { invalid?: boolean }>(
  ({ className, invalid, children, ...props }, ref) => (
    <select ref={ref} className={cn(fieldBase, 'appearance-none bg-white', invalid ? 'border-danger-300' : 'border-surface-border', className)} {...props}>
      {children}
    </select>
  ),
)
Select.displayName = 'Select'

export function Switch({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label?: string }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={cn(
        'relative inline-flex h-6 w-11 items-center rounded-full transition-colors',
        checked ? 'bg-jade-600' : 'bg-muted-200',
      )}
    >
      <span className={cn('inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform', checked ? 'translate-x-5' : 'translate-x-0.5')} />
      {label && <span className="sr-only">{label}</span>}
    </button>
  )
}
