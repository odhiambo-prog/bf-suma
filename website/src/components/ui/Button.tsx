/* eslint-disable react-refresh/only-export-components */
import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { cn } from '@/lib/utils'

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'citrus'
type Size = 'sm' | 'md' | 'lg'

const base =
  'inline-flex items-center justify-center gap-2 font-semibold tracking-wide rounded-full transition-all duration-300 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-jade-500 disabled:opacity-50 disabled:pointer-events-none select-none'

const variants: Record<Variant, string> = {
  primary:
    'bg-jade-600 text-white shadow-[0_12px_30px_-12px_rgba(5,150,105,0.6)] hover:bg-jade-700 hover:shadow-[0_16px_36px_-12px_rgba(5,150,105,0.7)] hover:-translate-y-0.5 active:translate-y-0 active:shadow-none',
  citrus:
    'bg-citrus-500 text-white shadow-[0_12px_30px_-12px_rgba(249,115,22,0.6)] hover:bg-citrus-600 hover:shadow-[0_16px_36px_-12px_rgba(249,115,22,0.7)] hover:-translate-y-0.5 active:translate-y-0 active:shadow-none',
  secondary:
    'bg-white text-ink border border-surface-border hover:border-jade-300 hover:text-jade-700 hover:-translate-y-0.5 shadow-sm hover:shadow-float',
  ghost:
    'bg-transparent text-ink hover:bg-jade-50 hover:text-jade-700',
  danger:
    'bg-danger-600 text-white hover:bg-danger-700 hover:-translate-y-0.5 shadow-[0_12px_30px_-12px_rgba(220,38,38,0.6)]',
}

const sizes: Record<Size, string> = {
  sm: 'text-[11px] px-5 py-2.5',
  md: 'text-xs px-7 py-3.5',
  lg: 'text-sm px-9 py-4',
}

export function buttonVariants({
  variant = 'primary',
  size = 'md',
  className,
}: { variant?: Variant; size?: Size; className?: string } = {}) {
  return cn(base, variants[variant], sizes[size], className)
}

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
  children: ReactNode
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', className, children, ...props }, ref) => (
    <button ref={ref} className={buttonVariants({ variant, size, className })} {...props}>
      {children}
    </button>
  ),
)
Button.displayName = 'Button'

interface ButtonLinkProps {
  to: string
  variant?: Variant
  size?: Size
  className?: string
  children: ReactNode
  onClick?: () => void
  'aria-label'?: string
}

export function ButtonLink({ to, variant = 'primary', size = 'md', className, children, ...rest }: ButtonLinkProps) {
  return (
    <Link to={to} className={buttonVariants({ variant, size, className })} {...rest}>
      {children}
    </Link>
  )
}
