import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'react-hot-toast'
import { queryClient } from '@/lib/queryClient'
import { AuthProvider } from '@/hooks/useAuth'
import Layout from '@/components/layout/Layout'
import AuthGuard from '@/components/admin/AuthGuard'
import AdminLayout from '@/components/admin/AdminLayout'
import Home from '@/pages/Home'
import Products from '@/pages/Products'
import Events from '@/pages/Events'
import FAQ from '@/pages/FAQ'
import Reviews from '@/pages/Reviews'
import JoinUs from '@/pages/JoinUs'
import About from '@/pages/About'
import AdminLogin from '@/pages/Admin/Login'
import AdminDashboard from '@/pages/Admin'
import AdminEvents from '@/pages/Admin/Events'
import AdminFAQ from '@/pages/Admin/FAQ'
import AdminReviews from '@/pages/Admin/Reviews'
import AdminBranches from '@/pages/Admin/Branches'
import AdminCompanyEvents from '@/pages/Admin/CompanyEvents'
import AdminHeroCarousel from '@/pages/Admin/HeroCarousel'

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route element={<Layout />}>
              <Route path="/" element={<Home />} />
              <Route path="/products" element={<Products />} />
              <Route path="/events" element={<Events />} />
              <Route path="/faq" element={<FAQ />} />
              <Route path="/reviews" element={<Reviews />} />
              <Route path="/join-us" element={<JoinUs />} />
              <Route path="/about" element={<About />} />
            </Route>

            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin" element={<AuthGuard />}>
              <Route element={<AdminLayout />}>
                <Route index element={<AdminDashboard />} />
                <Route path="events" element={<AdminEvents />} />
                <Route path="faq" element={<AdminFAQ />} />
                <Route path="reviews" element={<AdminReviews />} />
                <Route path="branches" element={<AdminBranches />} />
                <Route path="company-events" element={<AdminCompanyEvents />} />
                <Route path="hero" element={<AdminHeroCarousel />} />
              </Route>
            </Route>
          </Routes>
        </BrowserRouter>
        <Toaster position="bottom-right" />
      </AuthProvider>
    </QueryClientProvider>
  )
}
