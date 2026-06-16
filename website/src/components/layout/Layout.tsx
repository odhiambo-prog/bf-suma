import { useLayoutEffect } from 'react'
import { useLocation, Outlet } from 'react-router-dom'
import Navbar from './Navbar'
import Footer from './Footer'
import WhatsAppWidget from '@/components/ui/WhatsAppWidget'
import { usePageTracking } from '@/hooks/useAnalytics'

export default function Layout() {
  const location = useLocation()

  usePageTracking()

  useLayoutEffect(() => {
    window.history.scrollRestoration = 'manual'
    window.scrollTo(0, 0)
  }, [location.pathname])

  return (
    <div className="min-h-screen bg-surface text-slate-900 selection:bg-jade-600/20 selection:text-jade-900">
      <Navbar />
      <main>
        <Outlet />
      </main>
      <Footer />
      <WhatsAppWidget />
    </div>
  )
}
