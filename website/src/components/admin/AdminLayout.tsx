import { useState } from 'react'
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  LayoutDashboard, Calendar, HelpCircle, Star, MapPin, 
  Users, Image, UserCircle, MessageSquare, LogOut, Menu, X, ChevronRight 
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useAuth } from '@/hooks/useAuth'

const navItems = [
  { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { name: 'Events', href: '/admin/events', icon: Calendar },
  { name: 'FAQ', href: '/admin/faq', icon: HelpCircle },
  { name: 'Reviews', href: '/admin/reviews', icon: Star },
  { name: 'Branches', href: '/admin/branches', icon: MapPin },
  { name: 'Company Events', href: '/admin/company-events', icon: Users },
  { name: 'Hero Carousel', href: '/admin/hero', icon: Image },
  { name: 'Team', href: '/admin/team', icon: UserCircle },
  { name: 'Leads', href: '/admin/leads', icon: MessageSquare },
]

export default function AdminLayout() {
  const location = useLocation()
  const navigate = useNavigate()
  const { logout, user } = useAuth()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const handleLogout = async () => {
    await logout()
    navigate('/admin/login')
  }

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <aside className={cn(
        'fixed inset-y-0 left-0 z-40 w-64 bg-slate-900 border-r border-slate-800 flex flex-col transition-transform duration-200 lg:translate-x-0',
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      )}>
        <div className="p-5 border-b border-slate-800">
          <Link to="/admin" className="flex items-center gap-3">
            <div className="w-8 h-8 bg-jade-600 rounded flex items-center justify-center">
              <span className="text-xs font-bold text-white">A</span>
            </div>
            <span className="text-sm font-semibold text-white tracking-wide">Admin Panel</span>
          </Link>
        </div>

        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {navItems.map(item => {
            const Icon = item.icon
            const isActive = location.pathname === item.href
            return (
              <Link
                key={item.href}
                to={item.href}
                onClick={() => setSidebarOpen(false)}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 text-xs font-semibold tracking-wider uppercase rounded-lg transition-colors',
                  isActive 
                    ? 'bg-jade-600/20 text-jade-400' 
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                )}
              >
                <Icon className="w-4 h-4" strokeWidth={1.5} />
                <span>{item.name}</span>
                {isActive && <ChevronRight className="w-3 h-3 ml-auto" />}
              </Link>
            )
          })}
        </nav>

        <div className="p-4 border-t border-slate-800">
          <div className="flex items-center gap-3 mb-3 px-1">
            <div className="w-7 h-7 bg-slate-700 rounded-full flex items-center justify-center">
              <span className="text-[10px] font-bold text-slate-300">
                {user?.email?.[0].toUpperCase()}
              </span>
            </div>
            <span className="text-xs text-slate-400 truncate">{user?.email}</span>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-3 py-2 w-full text-xs font-semibold tracking-wider uppercase text-slate-400 hover:text-red-400 hover:bg-slate-800 rounded-lg transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" strokeWidth={1.5} />
            Sign Out
          </button>
        </div>
      </aside>

      <div className="lg:pl-64 flex-1 flex flex-col min-h-screen">
        <header className="sticky top-0 z-30 bg-white border-b border-slate-200 h-14 flex items-center px-6">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="lg:hidden p-2 -ml-2 text-slate-600 hover:text-slate-900"
          >
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          <div className="ml-auto text-xs text-slate-400 font-mono">
            BF SUMA Admin
          </div>
        </header>

        <main className="flex-1 p-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.15 }}
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  )
}
