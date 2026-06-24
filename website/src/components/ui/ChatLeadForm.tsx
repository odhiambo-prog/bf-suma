/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Send, MessageCircle } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { SHOP_CONFIG } from '@/config/shop.config'
import { trackFormSubmit, trackWhatsAppClick } from '@/hooks/useAnalytics'
import { useProducts } from '@/hooks/useProducts'
import { useBranches } from '@/hooks/useBranches'
import { useEvents } from '@/hooks/useEvents'
import { useFAQ } from '@/hooks/useFAQ'
import { useCompanyEvents } from '@/hooks/useCompanyEvents'
import { useAIResponse, type ChatMessage } from '@/hooks/useAIResponse'

interface ChatLeadFormProps {
  onClose: () => void
}

const SUGGESTED_QUESTIONS = [
  '📦 What products are in stock?',
  '📅 Any upcoming events?',
  '🤝 How do I become a distributor?',
  '📍 Where is your Naivasha branch?',
]

const botMessageVariants = {
  hidden: { opacity: 0, x: -20, scale: 0.95 },
  visible: { opacity: 1, x: 0, scale: 1 },
}

const userMessageVariants = {
  hidden: { opacity: 0, x: 20, scale: 0.95 },
  visible: { opacity: 1, x: 0, scale: 1 },
}

function ChatBubble({ msg, isStreaming }: { msg: ChatMessage | { role: string; text: string }; isStreaming?: boolean }) {
  const isUser = msg.role === 'user'
  return (
    <motion.div
      layout
      variants={isUser ? userMessageVariants : botMessageVariants}
      initial="hidden"
      animate="visible"
      transition={{ type: 'spring', stiffness: 200, damping: 20 }}
      className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}
    >
      <div
        className={`max-w-[80%] px-3.5 py-2.5 text-sm leading-relaxed rounded-lg shadow-sm ${
          isUser
            ? 'bg-[#DCF8C6] text-slate-800 rounded-br-sm'
            : 'bg-white text-slate-700 rounded-bl-sm'
        }`}
      >
        <span>{msg.text}</span>
        {isStreaming && <span className="inline-block w-1.5 h-4 bg-slate-400 ml-0.5 animate-pulse" />}
      </div>
    </motion.div>
  )
}

function TypingIndicator() {
  return (
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
  )
}

export default function ChatLeadForm({ onClose }: ChatLeadFormProps) {
  const [step, setStep] = useState(0)
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'assistant' as const, text: "👋 Hi there! Welcome to BF SUMA Eagle Shop. What's your name?" },
  ])
  const [input, setInput] = useState('')
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [location, setLocation] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [leadId, setLeadId] = useState<string | null>(null)
  const [phase, setPhase] = useState<'lead' | 'ai'>('lead')
  const [showSuggestions, setShowSuggestions] = useState(true)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const { data: products } = useProducts()
  const { data: branches } = useBranches()
  const { data: events } = useEvents()
  const { data: faqs } = useFAQ()
  const { data: companyEvents } = useCompanyEvents()

  const {
    messages: aiMessages,
    streamingText,
    isStreaming: isAiStreaming,
    error: aiError,
    sendMessage,
    clearMessages,
  } = useAIResponse(
    leadId ? { id: leadId, name, phone, location } : null,
  )

  useEffect(() => {
    const stored = localStorage.getItem('bfsuma-chat-session')
    if (!stored) return
    try {
      const session = JSON.parse(stored)
      if (session.leadId && session.name) {
        setName(session.name)
        setPhone(session.phone)
        setLocation(session.location)
        setLeadId(session.leadId)
        setPhase('ai')
        setShowSuggestions(false)
      }
    } catch { /* ignore */ }
  }, [])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, aiMessages, streamingText, isTyping, isAiStreaming])

  useEffect(() => {
    inputRef.current?.focus()
  }, [step, phase])

  useEffect(() => {
    if (!isAiStreaming && phase === 'ai') {
      inputRef.current?.focus()
    }
  }, [isAiStreaming, phase])

  function addBotMessage(text: string) {
    setIsTyping(true)
    setTimeout(() => {
      setIsTyping(false)
      setMessages(prev => [...prev, { role: 'assistant', text }])
    }, 800)
  }

  function addUserMessage(text: string) {
    setMessages(prev => [...prev, { role: 'user', text }])
  }

  async function handleSend(e: React.FormEvent) {
    e.preventDefault()
    const val = input.trim()
    if (!val || isTyping || submitting) return

    addUserMessage(val)
    setInput('')
    inputRef.current?.focus()

    if (step === 0) {
      setName(val)
      setTimeout(() => addBotMessage(`🤝 Nice to meet you, ${val}! What's the best phone number to reach you?`), 100)
      setStep(1)
    } else if (step === 1) {
      setPhone(val)
      setTimeout(() => addBotMessage(`📍 Got it! And where are you based?`), 100)
      setStep(2)
    } else if (step === 2) {
      setLocation(val)
      setSubmitting(true)
      setIsTyping(true)

      try {
        const { error } = await supabase
          .from('leads')
          .insert({ name, phone, location: val, message: 'Chat widget inquiry' })

        if (error) {
          console.error('[ChatLeadForm] Supabase insert error:', error)
          console.error('[ChatLeadForm] Error details:', JSON.stringify(error, Object.getOwnPropertyNames(error)))
          console.error('[ChatLeadForm] Auth session:', (await supabase.auth.getSession()).data.session?.user?.email ?? 'none')
          throw error
        }
        trackFormSubmit('chat-lead')

        const savedLeadId = 'local'
        setLeadId(savedLeadId)
        setIsTyping(false)
        setSubmitting(false)
        setPhase('ai')
        setShowSuggestions(true)

        localStorage.setItem('bfsuma-chat-session', JSON.stringify({
          leadId: savedLeadId,
          name,
          phone,
          location: val,
        }))
      } catch (err) {
        console.error('[ChatLeadForm] Failed to save lead:', err)
        setIsTyping(false)
        setMessages(prev => [...prev, {
          role: 'assistant',
          text: "😕 Sorry, something went wrong. Could you try again?",
        }])
        setSubmitting(false)
        setStep(2)
      }
    }
  }

  function handleAiSend(text: string) {
    sendMessage(text, {
      products,
      branches,
      events,
      faqs,
      companyEvents,
    })
    setShowSuggestions(false)
    setInput('')
    inputRef.current?.focus()
  }

  function handleSuggestionClick(question: string) {
    const cleanText = question.replace(/^[^\s]+\s/, '')
    handleAiSend(cleanText)
  }

  function handleTalkToHuman() {
    trackWhatsAppClick('chat-talk-to-human')
    const waMessage = `Hi! I'm ${name} from ${location}. Call me at ${phone}.`
    const waUrl = `https://wa.me/${SHOP_CONFIG.contact.whatsapp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(waMessage)}`
    window.open(waUrl, '_blank', 'noopener')
    onClose()
  }

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.15 }}
        className="fixed inset-0 z-40 bg-black/20 sm:bg-transparent"
        onClick={onClose}
      />
      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 40, scale: 0.9 }}
        transition={{ type: 'spring', stiffness: 350, damping: 25 }}
        className="fixed sm:bottom-24 bottom-0 right-0 sm:right-6 left-0 sm:left-auto z-50 w-auto sm:w-[360px] bg-white shadow-2xl border border-slate-200 sm:rounded-2xl rounded-t-2xl flex flex-col max-h-[85vh] sm:max-h-none"
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
            <p className="text-[10px] text-white/70">
              {phase === 'ai' ? 'AI Assistant' : 'Typically replies instantly'}
            </p>
          </div>
        </div>
        <button onClick={onClose} className="p-1 text-white/80 hover:text-white transition-colors">
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto p-4 bg-[#ECE5DD] space-y-2 sm:h-[380px]">
        <AnimatePresence mode="popLayout">
          {phase === 'lead' && messages.map((msg, i) => (
            <ChatBubble key={`lead-${i}`} msg={msg} />
          ))}

          {phase === 'ai' && (
            <>
              {aiMessages.length === 0 && !isAiStreaming && (
                <ChatBubble
                  msg={{
                    role: 'assistant',
                    text: `🚀 Thanks ${name}! Now, how can I help you today? Ask me about products, events, branches, or anything about BF SUMA.`,
                  }}
                />
              )}

              {aiMessages.map((msg, i) => (
                <ChatBubble key={`ai-${i}`} msg={msg} />
              ))}

              {isAiStreaming && (
                <ChatBubble
                  msg={{ role: 'assistant', text: streamingText || '...' }}
                  isStreaming
                />
              )}

              {showSuggestions && aiMessages.length === 0 && !isAiStreaming && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex flex-wrap gap-1.5 pt-2"
                >
                  {SUGGESTED_QUESTIONS.map((q) => (
                    <motion.button
                      key={q}
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => handleSuggestionClick(q)}
                      className="text-xs bg-white hover:bg-[#DCF8C6] border border-slate-200 rounded-full px-3 py-1.5 shadow-sm transition-colors text-slate-700"
                    >
                      {q}
                    </motion.button>
                  ))}
                </motion.div>
              )}

              {aiError && (
                <div className="text-red-500 text-xs text-center pt-1">{aiError}</div>
              )}
            </>
          )}
        </AnimatePresence>

        {phase === 'lead' && isTyping && <TypingIndicator />}

        <div ref={messagesEndRef} />
      </div>

      <form
        onSubmit={phase === 'ai' ? (e) => { e.preventDefault(); handleAiSend(input) } : handleSend}
        className="bg-white border-t border-slate-200 px-3 py-2"
      >
        {phase === 'ai' && leadId && (
          <div className="flex gap-1.5 mb-2">
            <motion.button
              type="button"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={handleTalkToHuman}
              className="flex-1 text-[11px] bg-[#25D366] hover:bg-[#22c35e] text-white font-medium rounded-lg px-3 py-1.5 transition-colors flex items-center justify-center gap-1.5"
            >
              <MessageCircle className="w-3 h-3" />
              Talk to human
            </motion.button>
            {aiMessages.length > 0 && (
              <motion.button
                type="button"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={clearMessages}
                className="text-[11px] bg-slate-100 hover:bg-slate-200 text-slate-500 rounded-lg px-3 py-1.5 transition-colors"
              >
                Clear
              </motion.button>
            )}
          </div>
        )}

        <div className="flex items-center gap-2">
          <input
            ref={inputRef}
            type={phase === 'lead' && step === 1 ? 'tel' : 'text'}
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder={
              phase === 'ai'
                ? isAiStreaming
                  ? 'AI is typing...'
                  : 'Ask me anything...'
                : isTyping || submitting
                  ? 'Please wait...'
                  : step === 0
                    ? 'Type your name...'
                    : step === 1
                      ? 'Type your phone number...'
                      : 'Type your location...'
            }
            disabled={
              phase === 'lead' ? (isTyping || submitting) : isAiStreaming
            }
            className="flex-1 px-3 py-2 text-sm bg-slate-50 rounded-lg outline-none focus:bg-white focus:ring-1 focus:ring-[#075E54] transition-all disabled:opacity-50"
            autoComplete="off"
          />
          <motion.button
            type="submit"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.9 }}
            disabled={
              !input.trim() ||
              (phase === 'lead' && (isTyping || submitting)) ||
              (phase === 'ai' && isAiStreaming)
            }
            className="w-9 h-9 bg-[#075E54] hover:bg-[#054d44] rounded-full flex items-center justify-center transition-colors disabled:opacity-40 shrink-0"
          >
            <Send className="w-4 h-4 text-white" />
          </motion.button>
        </div>
      </form>
    </motion.div>
    </>
  )
}
