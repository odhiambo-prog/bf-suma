import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Send, Loader2, MessageCircle } from 'lucide-react'
import { useLeadForm } from '@/hooks/useLeadForm'
import { useSubmitLead } from '@/hooks/useLeads'
import { SHOP_CONFIG } from '@/config/shop.config'
import { trackFormSubmit, trackWhatsAppClick } from '@/hooks/useAnalytics'
import toast from 'react-hot-toast'

export default function LeadForm() {
  const { isOpen, contextMessage, closeLeadForm } = useLeadForm()
  const submitLead = useSubmitLead()

  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [location, setLocation] = useState('')

  const isValid = name.trim() && phone.trim() && location.trim()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!isValid) return

    await submitLead.mutateAsync({
      name: name.trim(),
      phone: phone.trim(),
      location: location.trim(),
      message: contextMessage || undefined,
    })

    trackFormSubmit('lead')
    trackWhatsAppClick('lead-form')

    const waMessage = `Hi! I'm ${name.trim()} from ${location.trim()}.${contextMessage ? ` I'm interested in: ${contextMessage}.` : ''} Call me at ${phone.trim()}.`
    const waUrl = `https://wa.me/${SHOP_CONFIG.contact.whatsapp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(waMessage)}`

    toast.success('Thank you! We\'ll connect you shortly.')
    window.open(waUrl, '_blank', 'noopener')
    closeLeadForm()
    setName('')
    setPhone('')
    setLocation('')
  }

  function handleClose() {
    if (submitLead.isPending) return
    closeLeadForm()
    setName('')
    setPhone('')
    setLocation('')
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/40"
            onClick={handleClose}
          />
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className="relative w-full sm:max-w-md bg-white sm:rounded-2xl sm:shadow-2xl max-h-[90vh] overflow-y-auto"
          >
            <div className="bg-jade-600 px-6 py-5 sm:rounded-t-2xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <MessageCircle className="w-5 h-5 text-white" />
                  <h2 className="text-sm font-semibold text-white">Talk to Us</h2>
                </div>
                <button
                  onClick={handleClose}
                  disabled={submitLead.isPending}
                  className="p-1 text-white/80 hover:text-white transition-colors disabled:opacity-50"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {contextMessage && (
                <div className="bg-jade-50 border border-jade-200 rounded-lg px-4 py-3 text-xs text-jade-800">
                  Interested in: <span className="font-semibold">{contextMessage}</span>
                </div>
              )}

              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-muted-600 mb-1.5">Your Name *</label>
                <input
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="e.g. John Doe"
                  className="w-full px-3 py-2.5 border border-muted-300 rounded-lg text-sm text-ink focus:border-jade-500 outline-none transition-colors"
                  required
                  disabled={submitLead.isPending}
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-muted-600 mb-1.5">Phone Number *</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  placeholder="e.g. +254 712 345 678"
                  className="w-full px-3 py-2.5 border border-muted-300 rounded-lg text-sm text-ink focus:border-jade-500 outline-none transition-colors"
                  required
                  disabled={submitLead.isPending}
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-muted-600 mb-1.5">Your Location *</label>
                <input
                  value={location}
                  onChange={e => setLocation(e.target.value)}
                  placeholder="e.g. Nairobi, Kenya"
                  className="w-full px-3 py-2.5 border border-muted-300 rounded-lg text-sm text-ink focus:border-jade-500 outline-none transition-colors"
                  required
                  disabled={submitLead.isPending}
                />
              </div>

              <button
                type="submit"
                disabled={!isValid || submitLead.isPending}
                className="w-full flex items-center justify-center gap-2 bg-jade-600 hover:bg-jade-700 text-white rounded-lg px-6 py-3 text-xs font-semibold tracking-wider uppercase transition-colors disabled:opacity-50 mt-2"
              >
                {submitLead.isPending ? (
                  <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Submitting...</>
                ) : (
                  <><Send className="w-3.5 h-3.5" /> Send &amp; Connect on WhatsApp</>
                )}
              </button>

              <p className="text-[10px] text-muted-400 text-center">
                We'll open WhatsApp to continue the conversation.
              </p>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
