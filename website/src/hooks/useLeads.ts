import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import toast from 'react-hot-toast'

export interface Lead {
  id: string
  name: string
  phone: string
  location: string
  message: string | null
  status: 'new' | 'contacted'
  created_at: string
}

export function useLeads() {
  return useQuery({
    queryKey: ['leads'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('leads')
        .select('*')
        .order('created_at', { ascending: false })
      if (error) throw error
      return (data as Lead[]) || []
    },
  })
}

export function useSubmitLead() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (lead: { name: string; phone: string; location: string; message?: string }) => {
      const { error } = await supabase.from('leads').insert({
        name: lead.name,
        phone: lead.phone,
        location: lead.location,
        message: lead.message || null,
      })
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leads'] })
    },
    onError: (err: Error) => {
      toast.error(err.message || 'Failed to submit. Please try again.')
    },
  })
}

export function useUpdateLeadStatus() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: 'new' | 'contacted' }) => {
      const { error } = await supabase.from('leads').update({ status }).eq('id', id)
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leads'] })
    },
  })
}
