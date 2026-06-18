import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Send, Check, Loader2 } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { SHOP_CONFIG } from '@/config/shop.config'
import { trackFormSubmit } from '@/hooks/useAnalytics'

interface ChatMessage {
  role: 'bot' | 'user'
  text: string
}

interface ChatLeadFormProps {
  onClose: () => void
}

const botMessageVariants = {
  hidden: { opacity: 0, x: -20, scale: 0.95 },
  visible: { opacity: 1, x: 0, scale: 1 },
}

const userMessageVariants = {
  hidden: { opacity: 0, x: 20, scale: 0.95 },
  visible: { opacity: 1, x: 0, scale: 1 },
}

export default function ChatLeadForm({ onClose }: ChatLeadFormProps) {
  const [step, setStep] = useState(0)
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'bot', text: "👋 Hi there! Welcome to BF SUMA Eagle Shop. What's your name?" },
  ])
  const [input, setInput] = useState('')
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [done, setDone] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isTyping])

  useEffect(() => {
    if (!done) inputRef.current?.focus()
  }, [step, done])

  function addBotMessage(text: string) {
    setIsTyping(true)
    setTimeout(() => {
      setIsTyping(false)
      setMessages(prev => [...prev, { role: 'bot', text }])
    }, 800)
  }

  function addUserMessage(text: string) {
    setMessages(prev => [...prev, { role: 'user', text }])
  }

  async function handleSend(e: React.FormEvent) {
    e.preventDefault()
    const val = input.trim()
    if (!val || isTyping || submitting || done) return

    addUserMessage(val)
    setInput('')

    if (step === 0) {
      setName(val)
      setTimeout(() => addBotMessage(`🤝 Nice to meet you, ${val}! What's the best phone number to reach you?`), 100)
      setStep(1)
    } else if (step === 1) {
      setPhone(val)
      setTimeout(() => addBotMessage(`📍 Got it! And where are you based?`), 100)
      setStep(2)
    } else if (step === 2) {
      setSubmitting(true)
      setIsTyping(true)

      try {
        const { error } = await supabase.from('leads').insert({
          name,
          phone,
          location: val,
          message: 'Chat widget inquiry',
        })
        if (error) throw error
        trackFormSubmit('chat-lead')

        const waMessage = `Hi! I'm ${name} from ${val}. Call me at ${phone}.`
        const waUrl = `https://wa.me/${SHOP_CONFIG.contact.whatsapp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(waMessage)}`

        setIsTyping(false)
        setMessages(prev => [...prev, {
          role: 'bot',
          text: `🚀 Thanks ${name}! Let's connect you on WhatsApp now.`,
        }])
        setDone(true)

        setTimeout(() => {
          window.open(waUrl, '_blank', 'noopener')
          onClose()
        }, 1500)
      } catch (err) {
        setIsTyping(false)
        setMessages(prev => [...prev, {
          role: 'bot',
          text: "😕 Sorry, something went wrong. Could you try again?",
        }])
        setSubmitting(false)
        setStep(2)
      }
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 40, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 40, scale: 0.9 }}
      transition={{ type: 'spring', stiffness: 350, damping: 25 }}
      className="fixed bottom-24 right-6 z-50 w-[360px] max-w-[calc(100vw-2rem)] bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden"
    >
      <div className="bg-[#075E54] px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-[#25D366] rounded-full flex items-center justify-center">
            <svg viewBox="0 0 24 24" className="w-5 h-5 fill-white" xmlns="http://www.w3.org/2000/svg">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
          </div>
          <div>
            <p className="text-sm font-semibold text-white">BF SUMA Eagle Shop</p>
            <p className="text-[10px] text-white/70">Typically replies instantly</p>
          </div>
        </div>
        <button onClick={onClose} className="p-1 text-white/80 hover:text-white transition-colors">
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="h-[380px] overflow-y-auto p-4 bg-[#ECE5DD] space-y-2">
        <AnimatePresence mode="popLayout">
          {messages.map((msg, i) => (
            <motion.div
              key={`${msg.role}-${i}`}
              layout
              variants={msg.role === 'bot' ? botMessageVariants : userMessageVariants}
              initial="hidden"
              animate="visible"
              transition={{ type: 'spring', stiffness: 200, damping: 20 }}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] px-3.5 py-2.5 text-sm leading-relaxed rounded-lg shadow-sm ${
                  msg.role === 'user'
                    ? 'bg-[#DCF8C6] text-slate-800 rounded-br-sm'
                    : 'bg-white text-slate-700 rounded-bl-sm'
                }`}
              >
                {msg.text.includes('👋') || msg.text.includes('🤝') || msg.text.includes('📍') || msg.text.includes('🚀') || msg.text.includes('😕') ? (
                  <span>{msg.text}</span>
                ) : (
                  <span>{msg.text}</span>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {isTyping && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex justify-start"
          >
            <div className="bg-white rounded-lg rounded-bl-sm px-4 py-3 shadow-sm flex items-center gap-1">
              {[0, 1, 2].map(i => (
                <motion.span
                  key={i}
                  custom={i}
                  animate={{ y: [0, -4, 0] }}
                  transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }}
                  className="w-2 h-2 bg-slate-400 rounded-full"
                />
              ))}
            </div>
          </motion.div>
        )}

        {done && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex justify-center pt-2"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            >
              <Loader2 className="w-5 h-5 text-[#075E54]" />
            </motion.div>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSend} className="bg-white border-t border-slate-200 px-3 py-2 flex items-center gap-2">
        <input
          ref={inputRef}
          type={step === 1 ? 'tel' : 'text'}
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder={
            done ? 'Connected!' :
            isTyping ? 'Please wait...' :
            step === 0 ? 'Type your name...' :
            step === 1 ? 'Type your phone number...' :
            'Type your location...'
          }
          disabled={isTyping || submitting || done}
          className="flex-1 px-3 py-2 text-sm bg-slate-50 rounded-lg outline-none focus:bg-white focus:ring-1 focus:ring-[#075E54] transition-all disabled:opacity-50"
          autoComplete="off"
        />
        <motion.button
          type="submit"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.9 }}
          disabled={!input.trim() || isTyping || submitting || done}
          className="w-9 h-9 bg-[#075E54] hover:bg-[#054d44] rounded-full flex items-center justify-center transition-colors disabled:opacity-40 shrink-0"
        >
          {submitting ? (
            <Loader2 className="w-4 h-4 text-white animate-spin" />
          ) : done ? (
            <Check className="w-4 h-4 text-white" />
          ) : (
            <Send className="w-4 h-4 text-white" />
          )}
        </motion.button>
      </form>
    </motion.div>
  )
}
