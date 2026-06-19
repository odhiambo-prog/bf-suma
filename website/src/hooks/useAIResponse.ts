/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useEffect, useRef, useCallback } from 'react'
import { sendChatMessage } from '@/services/chat.service'
import { buildChatContext, type ChatContext } from '@/lib/context-builder'
import type { ProductWithStock } from '@/services/inventory.service'
import type { Branch } from '@/types/branch.types'
import type { Event } from '@/types/event.types'
import type { FAQ } from '@/types/faq.types'
import type { CompanyEvent } from '@/types/join-us.types'

export interface ChatMessage {
  role: 'user' | 'assistant'
  text: string
}

export function useAIResponse(lead: { id: string; name: string; phone: string; location: string } | null) {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [streamingText, setStreamingText] = useState('')
  const [isStreaming, setIsStreaming] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const streamingTextRef = useRef('')

  const storageKey = lead ? `bfsuma-ai-chat-${lead.id}` : null

  useEffect(() => {
    if (!storageKey) return
    try {
      const saved = localStorage.getItem(storageKey)
      if (saved) {
        const parsed = JSON.parse(saved)
        if (Array.isArray(parsed) && parsed.length > 0) {
          setMessages(parsed)
        }
      }
    } catch { /* ignore */ }
  }, [storageKey])

  useEffect(() => {
    if (!storageKey || isStreaming || messages.length === 0) return
    try {
      localStorage.setItem(storageKey, JSON.stringify(messages))
    } catch { /* ignore */ }
  }, [storageKey, messages, isStreaming])

  const sendMessage = useCallback(async (
    text: string,
    data: {
      products?: ProductWithStock[]
      branches?: Branch[]
      events?: Event[]
      faqs?: FAQ[]
      companyEvents?: CompanyEvent[]
    },
  ) => {
    if (!text.trim() || isStreaming || !lead) return

    const userMsg: ChatMessage = { role: 'user', text: text.trim() }
    setMessages(prev => [...prev, userMsg])
    setIsStreaming(true)
    setError(null)
    setStreamingText('')
    streamingTextRef.current = ''

    const context: ChatContext = buildChatContext({
      lead,
      products: data.products,
      branches: data.branches,
      events: data.events,
      faqs: data.faqs,
      companyEvents: data.companyEvents,
    })

    try {
      const history = [...messages, userMsg]
      const apiMessages = history.map(m => ({ role: m.role, content: m.text }))

      await sendChatMessage(apiMessages, context, lead.id, {
        onToken: (token: string) => {
          streamingTextRef.current += token
          setStreamingText(streamingTextRef.current)
        },
        onDone: () => {
          const finalText = streamingTextRef.current
          setMessages(prev => [...prev, { role: 'assistant', text: finalText }])
          setIsStreaming(false)
          setStreamingText('')
          streamingTextRef.current = ''
        },
        onError: (err: Error) => {
          setError(err.message)
          setIsStreaming(false)
        },
      })
    } catch {
      setError('Connection error. Please try again.')
      setIsStreaming(false)
    }
  }, [lead, messages, isStreaming])

  const clearMessages = useCallback(() => {
    if (storageKey) {
      localStorage.removeItem(storageKey)
    }
    setMessages([])
    setStreamingText('')
    setError(null)
  }, [storageKey])

  return {
    messages,
    streamingText,
    isStreaming,
    error,
    sendMessage,
    clearMessages,
  }
}
