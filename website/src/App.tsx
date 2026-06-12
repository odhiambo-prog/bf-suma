import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'react-hot-toast'
import { queryClient } from '@/lib/queryClient'
import Layout from '@/components/layout/Layout'
import Home from '@/pages/Home'
import Products from '@/pages/Products'
import Events from '@/pages/Events'
import FAQ from '@/pages/FAQ'
import Reviews from '@/pages/Reviews'
import JoinUs from '@/pages/JoinUs'
import About from '@/pages/About'

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
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
        </Routes>
      </BrowserRouter>
      <Toaster position="bottom-right" />
    </QueryClientProvider>
  )
}
