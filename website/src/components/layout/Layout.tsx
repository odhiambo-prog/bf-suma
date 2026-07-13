import { useLayoutEffect } from 'react'
import { useLocation, Outlet } from 'react-router-dom'
import Navbar from './Navbar'
import Footer from './Footer'
import { LeadFormProvider } from '@/hooks/useLeadForm'
import LeadForm from '@/components/ui/LeadForm'
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
    <LeadFormProvider>
      <div className="min-h-screen bg-surface text-ink selection:bg-jade-600/20 selection:text-ink">
        <Navbar />
        <main>
          <Outlet />
        </main>
        <Footer />
        <WhatsAppWidget />
        <LeadForm />
      </div>
    </LeadFormProvider>
  )
}
