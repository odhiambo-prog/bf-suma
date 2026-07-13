import { useQuery } from '@tanstack/react-query'
import {
  Calendar, HelpCircle, Star, MapPin, Users, Image, UserCircle, MessageSquare,
  ArrowRight, CalendarClock, Inbox, AlertCircle,
} from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { StatTile } from '@/components/admin/ui/StatTile'
import { EmptyState } from '@/components/admin/ui/EmptyState'
import Badge from '@/components/ui/Badge'
import { useReviews } from '@/hooks/useReviews'
import { useEvents } from '@/hooks/useEvents'
import { useLeads } from '@/hooks/useLeads'

const quickLinks = [
  { name: 'Events', href: '/admin/events', icon: Calendar, accent: 'jade' as const },
  { name: 'FAQ', href: '/admin/faq', icon: HelpCircle, accent: 'neutral' as const },
  { name: 'Reviews', href: '/admin/reviews', icon: Star, accent: 'citrus' as const },
  { name: 'Branches', href: '/admin/branches', icon: MapPin, accent: 'neutral' as const },
  { name: 'Company Events', href: '/admin/company-events', icon: Users, accent: 'jade' as const },
  { name: 'Hero Carousel', href: '/admin/hero', icon: Image, accent: 'citrus' as const },
  { name: 'Team', href: '/admin/team', icon: UserCircle, accent: 'neutral' as const },
  { name: 'Leads', href: '/admin/leads', icon: MessageSquare, accent: 'jade' as const },
]

export default function AdminDashboard() {
  const { data: reviews } = useReviews()
  const { data: events } = useEvents()
  const { data: leads = [] } = useLeads()

  const { data: pendingReviews = 0 } = useQuery({
    queryKey: ['pending-reviews-count'],
    queryFn: async () => {
      const { count, error } = await supabase
        .from('reviews')
        .select('*', { count: 'exact', head: true })
        .eq('is_approved', false)
      if (error) return 0
      return count ?? 0
    },
  })

  const upcomingEvents = (events ?? []).filter(e => e.status === 'upcoming').length
  const newLeads = (leads || []).filter(l => l.status === 'new').length

  const latestReviews = (reviews ?? []).slice(0, 4)
  const latestLeads = (leads || []).slice(0, 4)
  const activity = [
    ...latestReviews.map(r => ({ type: 'review' as const, id: r.id, title: r.reviewer_name, sub: r.testimonial, date: r.created_at })),
    ...latestLeads.map(l => ({ type: 'lead' as const, id: l.id, title: l.name, sub: l.message || 'New inquiry', date: l.created_at })),
  ]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 6)

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-xl font-semibold text-ink font-display">Dashboard</h1>
        <p className="text-sm text-muted-600 mt-1">Manage your BF SUMA Eagle Shop content.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">
        <StatTile
          label="Pending Reviews"
          value={pendingReviews}
          icon={<AlertCircle className="w-5 h-5" strokeWidth={1.5} />}
          accent="citrus"
          to="/admin/reviews"
          hint="Awaiting moderation"
        />
        <StatTile
          label="Upcoming Events"
          value={upcomingEvents}
          icon={<CalendarClock className="w-5 h-5" strokeWidth={1.5} />}
          accent="jade"
          to="/admin/events"
          hint="Scheduled & visible"
        />
        <StatTile
          label="New Leads"
          value={newLeads}
          icon={<Inbox className="w-5 h-5" strokeWidth={1.5} />}
          accent="jade"
          to="/admin/leads"
          hint="Not yet contacted"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <section className="lg:col-span-2 rounded-2xl border border-surface-border bg-surface-card shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-ink">Recent Activity</h2>
          </div>
          {activity.length === 0 ? (
            <EmptyState
              icon={<Inbox className="w-5 h-5" />}
              title="Nothing here yet"
              description="New reviews and leads will appear here as they come in."
            />
          ) : (
            <ul className="divide-y divide-surface-border">
              {activity.map(item => (
                <li key={`${item.type}-${item.id}`} className="flex items-start gap-3 py-3">
                  <span className={cnBadgeWrap(item.type)}>
                    {item.type === 'review' ? <Star className="w-3.5 h-3.5" /> : <MessageSquare className="w-3.5 h-3.5" />}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium text-ink truncate">{item.title}</p>
                      <Badge
                        variant={item.type === 'review' ? 'citrus' : 'jade'}
                        label={item.type === 'review' ? 'Review' : 'Lead'}
                      />
                    </div>
                    <p className="text-xs text-muted-600 truncate mt-0.5">{item.sub}</p>
                  </div>
                  <span className="text-[11px] text-muted-400 font-mono whitespace-nowrap">
                    {new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="rounded-2xl border border-surface-border bg-surface-card shadow-sm p-6">
          <h2 className="text-sm font-semibold text-ink mb-4">Quick Links</h2>
          <div className="grid grid-cols-2 gap-3">
            {quickLinks.map(link => (
              <StatTile
                key={link.href}
                label={link.name}
                value={<ArrowRight className="w-4 h-4" />}
                icon={<link.icon className="w-5 h-5" strokeWidth={1.5} />}
                accent={link.accent}
                to={link.href}
              />
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}

function cnBadgeWrap(type: 'review' | 'lead') {
  return [
    'flex h-9 w-9 items-center justify-center rounded-xl flex-shrink-0',
    type === 'review' ? 'bg-citrus-50 text-citrus-600' : 'bg-jade-50 text-jade-600',
  ].join(' ')
}
