import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { springSnap } from '@/lib/motion'
import { SHOP_CONFIG } from '@/config/shop.config'

const navLinks = [
  { name: 'Home', href: '/' },
  { name: 'Products', href: '/products' },
  { name: 'Events', href: '/events' },
  { name: 'Reviews', href: '/reviews' },
  { name: 'Join Us', href: '/join-us' },
  { name: 'Branches', href: '/branches' },
  { name: 'About', href: '/about' },
  { name: 'FAQ', href: '/faq' },
]

export default function Navbar() {
  const location = useLocation()
  const isHome = location.pathname === '/'
  const [isScrolled, setIsScrolled] = useState(!isHome)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsMobileMenuOpen(false)
  }, [location.pathname])

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsScrolled(!isHome || window.scrollY > 20)
  }, [isHome])

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [isMobileMenuOpen])

  return (
    <nav className={cn(
      'fixed top-0 left-0 w-full z-50 transition-all duration-300',
      isScrolled
        ? 'bg-surface-card/95 backdrop-blur-md border-b border-surface-border shadow-sm py-3'
        : 'bg-slate-900/60 backdrop-blur-md border-b border-white/10 py-4'
    )}>
      <div className="max-w-6xl mx-auto flex items-center justify-between px-6">
        <Link to="/" className="flex items-center gap-3 min-w-0">
          <img
            src={SHOP_CONFIG.logo}
            alt="BF SUMA"
            className="h-12 w-auto flex-shrink-0"
          />
          <span className={cn(
            'font-display text-base tracking-[0.15em] hidden sm:block truncate',
            isScrolled ? 'text-ink' : 'text-white'
          )}>
            EAGLE SHOP
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.href
            return (
              <Link
                key={link.name}
                to={link.href}
                className={cn(
                  'relative px-4 py-2 text-xs font-semibold tracking-widest uppercase transition-colors',
                  isActive
                    ? 'text-citrus-500'
                    : isScrolled
                      ? 'text-muted-600 hover:text-jade-700'
                      : 'text-white/80 hover:text-white'
                )}
              >
                {link.name}
                {isActive && (
                  <motion.div
                    layoutId="nav-underline"
                    className="absolute -bottom-0.5 left-4 right-4 h-[2px] bg-citrus-500"
                    transition={springSnap}
                  />
                )}
              </Link>
            )
          })}
        </div>

        <button
          className={cn(
            'md:hidden p-3 -mr-3 transition-colors flex-shrink-0',
            isScrolled ? 'text-ink' : 'text-white'
          )}
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="absolute top-full left-0 w-full bg-surface-card border-b border-surface-border shadow-lg overflow-hidden"
          >
            <div className="px-6 py-6 flex flex-col gap-1 max-h-[calc(100dvh-5rem)] overflow-y-auto">
              {navLinks.map((link) => {
                const isActive = location.pathname === link.href
                return (
                  <Link
                    key={link.name}
                    to={link.href}
                    className={cn(
                      'px-4 py-3 text-xs font-semibold tracking-widest uppercase transition-colors rounded-lg',
                      isActive
                        ? 'bg-jade-50 text-jade-700'
                        : 'text-muted-600 hover:bg-surface-subtle'
                    )}
                  >
                    {link.name}
                  </Link>
                )
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}
