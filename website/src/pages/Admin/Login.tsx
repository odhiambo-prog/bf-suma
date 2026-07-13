import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import SEOHead from '@/components/seo/SEOHead'
import { SHOP_CONFIG } from '@/config/shop.config'
import { Button } from '@/components/ui/Button'
import { Field, Input } from '@/components/admin/ui/FormField'
import { toast } from '@/components/admin/ui/Toaster'
import { Leaf, ArrowLeft } from 'lucide-react'

export default function AdminLogin() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    const err = await login(email, password)
    setLoading(false)
    if (err) {
      setError(err)
      toast.error(err)
    } else {
      toast.success('Signed in successfully')
      navigate('/admin')
    }
  }

  return (
    <>
      <SEOHead title="Admin Login" description="BF SUMA Eagle Shop admin panel login." noindex />
      <div className="min-h-screen bg-ink flex">
        <div className="relative hidden lg:flex w-1/2 flex-col justify-between bg-gradient-to-br from-ink via-ink-800 to-jade-900 p-12 overflow-hidden">
          <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-citrus-500/20 blur-3xl" />
          <div className="absolute -left-10 bottom-10 h-64 w-64 rounded-full bg-jade-500/20 blur-3xl" />
          <div className="relative flex items-center gap-3">
            <div className="w-10 h-10 bg-jade-600 rounded-xl flex items-center justify-center">
              <Leaf className="w-5 h-5 text-white" />
            </div>
            <span className="text-white font-semibold tracking-wide">BF SUMA</span>
          </div>
          <div className="relative">
            <h2 className="text-3xl font-display text-white leading-snug">Evolve the Green Current.</h2>
            <p className="mt-3 text-sm text-muted-200 max-w-sm">
              Sign in to manage events, reviews, branches, and everything that powers the Eagle Shop.
            </p>
          </div>
          <div className="relative text-xs text-muted-400 font-mono">BF SUMA Eagle Shop · Admin</div>
        </div>

        <div className="flex w-full lg:w-1/2 items-center justify-center p-6">
          <div className="w-full max-w-sm">
            <div className="bg-surface-card rounded-3xl shadow-float-lg p-8">
              <div className="flex flex-col items-center mb-8">
                <img src={SHOP_CONFIG.logo} alt="BF SUMA" className="h-12 w-auto mb-4" />
                <h1 className="text-lg font-semibold text-ink">Admin Login</h1>
                <p className="text-xs text-muted-500 mt-1">BF SUMA Eagle Shop</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <Field label="Email" htmlFor="email" error={error ? ' ' : undefined}>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="admin@eagleshop.co.ke"
                    required
                  />
                </Field>

                <Field label="Password" htmlFor="password">
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                  />
                </Field>

                {error && (
                  <p className="text-xs text-danger-600 bg-danger-50 border border-danger-200 rounded-xl px-3 py-2">
                    {error}
                  </p>
                )}

                <Button type="submit" variant="primary" size="md" className="w-full" disabled={loading}>
                  {loading ? 'Signing in...' : 'Sign In'}
                </Button>
              </form>
            </div>

            <a
              href="/"
              className="flex items-center justify-center gap-1.5 text-xs text-muted-400 mt-6 hover:text-citrus-500 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back to website
            </a>
          </div>
        </div>
      </div>
    </>
  )
}
