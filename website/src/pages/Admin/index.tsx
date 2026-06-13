import { Link } from 'react-router-dom'
import { Calendar, HelpCircle, Star, MapPin, Users, Image, ArrowRight } from 'lucide-react'

const cards = [
  { name: 'Events', href: '/admin/events', icon: Calendar, count: 'Manage events with media uploads' },
  { name: 'FAQ', href: '/admin/faq', icon: HelpCircle, count: 'Manage frequently asked questions' },
  { name: 'Reviews', href: '/admin/reviews', icon: Star, count: 'Moderate customer reviews' },
  { name: 'Branches', href: '/admin/branches', icon: MapPin, count: 'Manage branch locations' },
  { name: 'Company Events', href: '/admin/company-events', icon: Users, count: 'Distributor program events' },
  { name: 'Hero Carousel', href: '/admin/hero', icon: Image, count: 'Homepage carousel slides' },
]

export default function AdminDashboard() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-xl font-semibold text-slate-900">Dashboard</h1>
        <p className="text-sm text-slate-500 mt-1">Manage your BF SUMA Eagle Shop content.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {cards.map(card => {
          const Icon = card.icon
          return (
            <Link
              key={card.href}
              to={card.href}
              className="bg-white border border-slate-200 rounded-xl p-6 hover:border-jade-300 hover:shadow-md transition-all group"
            >
              <Icon className="w-8 h-8 text-jade-600 mb-4" strokeWidth={1.5} />
              <h3 className="text-sm font-semibold text-slate-900 mb-1">{card.name}</h3>
              <p className="text-xs text-slate-500">{card.count}</p>
              <div className="mt-4 flex items-center gap-1 text-[11px] font-semibold text-jade-600 uppercase tracking-wider group-hover:gap-2 transition-all">
                Manage <ArrowRight className="w-3 h-3" />
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
