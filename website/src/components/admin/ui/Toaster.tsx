/* eslint-disable react-refresh/only-export-components */
import { Toaster as SonnerToaster } from 'sonner'

export function AdminToaster() {
  return (
    <SonnerToaster
      position="top-right"
      toastOptions={{
        style: {
          background: '#FFFFFF',
          border: '1px solid #E3EAE5',
          color: '#0C1B14',
          borderRadius: '16px',
          boxShadow: '0 30px 60px -20px rgba(6,78,59,0.30)',
        },
        className: 'font-body text-sm',
      }}
    />
  )
}

export { toast } from 'sonner'
