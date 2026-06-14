import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import type { TeamMember } from '@/types/team.types'

export function useTeamMembers() {
  return useQuery({
    queryKey: ['team-members'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('team_members')
        .select('*')
        .eq('is_active', true)
        .order('sort_order')
      if (error) throw error
      return (data as TeamMember[]) || []
    },
    staleTime: 1000 * 60 * 60,
  })
}
