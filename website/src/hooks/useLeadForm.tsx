/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, type ReactNode } from 'react'

interface LeadFormContextType {
  isOpen: boolean
  contextMessage: string
  openLeadForm: (context?: string) => void
  closeLeadForm: () => void
}

const LeadFormContext = createContext<LeadFormContextType>({
  isOpen: false,
  contextMessage: '',
  openLeadForm: () => {},
  closeLeadForm: () => {},
})

export function LeadFormProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)
  const [contextMessage, setContextMessage] = useState('')

  const openLeadForm = (context?: string) => {
    setContextMessage(context || '')
    setIsOpen(true)
  }

  const closeLeadForm = () => {
    setIsOpen(false)
    setContextMessage('')
  }

  return (
    <LeadFormContext.Provider value={{ isOpen, contextMessage, openLeadForm, closeLeadForm }}>
      {children}
    </LeadFormContext.Provider>
  )
}

export function useLeadForm() {
  return useContext(LeadFormContext)
}
