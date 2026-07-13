import { Link } from 'react-router-dom'
import { MapPin, Phone, Mail, MessageCircle } from 'lucide-react'
import { SHOP_CONFIG } from '@/config/shop.config'
import type { ReactNode } from 'react'

const quickLinks = [
  { name: 'Home', href: '/' },
  { name: 'Products', href: '/products' },
  { name: 'Events', href: '/events' },
  { name: 'Reviews', href: '/reviews' },
  { name: 'Join Us', href: '/join-us' },
  { name: 'About', href: '/about' },
  { name: 'FAQ', href: '/faq' },
]

const socialLinks = [
  { name: 'Instagram', href: SHOP_CONFIG.social.instagram || '#' },
  { name: 'X', href: '#' },
  { name: 'Facebook', href: '#' },
]

const socialIcons: Record<string, ReactNode> = {
  Instagram: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <circle cx="12" cy="12" r="5" />
      <circle cx="17.5" cy="6.5" r="1.2" fill="currentColor" stroke="none" />
    </svg>
  ),
  X: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  ),
  Facebook: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4">
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  ),
}

const waLink = `https://wa.me/${SHOP_CONFIG.contact.whatsapp.replace(/[^0-9]/g, '')}`

export default function Footer() {
  return (
    <footer className="bg-ink text-white">
      <div className="max-w-7xl mx-auto px-6 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          <div className="lg:col-span-5">
            <div className="flex items-center gap-3 mb-8 min-w-0">
              <img src={SHOP_CONFIG.logo} alt="BF SUMA" className="h-10 w-auto brightness-0 invert flex-shrink-0" />
              <span className="font-display text-xl text-white tracking-wide">Eagle Shop</span>
            </div>
            <p className="text-white/60 text-sm max-w-sm leading-relaxed mb-8">
              Nairobi's premier destination for high-quality health supplements and professional wellness services.
            </p>

            <a
              href={waLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-citrus-500 hover:bg-citrus-600 text-white px-5 py-3 text-xs font-semibold tracking-wide transition-all duration-300 shadow-[0_12px_30px_-12px_rgba(249,115,22,0.7)] hover:-translate-y-0.5"
            >
              <MessageCircle className="w-4 h-4" />
              Talk to us on WhatsApp
            </a>

            <div className="flex gap-2 mt-8">
              {socialLinks.map(social => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 border border-white/15 flex items-center justify-center hover:border-citrus-500 hover:text-citrus-500 transition-colors group rounded-full"
                  aria-label={social.name}
                >
                  <span className="text-white/50 group-hover:text-citrus-500 transition-colors">
                    {socialIcons[social.name]}
                  </span>
                </a>
              ))}
            </div>
          </div>

          <div className="lg:col-span-3">
            <h4 className="text-[11px] font-semibold tracking-[0.18em] uppercase text-white/70 mb-8">
              Quick Links
            </h4>
            <ul className="flex flex-col gap-4">
              {quickLinks.map(link => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-sm text-white/60 hover:text-white transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-4">
            <h4 className="text-[11px] font-semibold tracking-[0.18em] uppercase text-white/70 mb-8">
              Contact
            </h4>
            <ul className="flex flex-col gap-6">
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-jade-400 flex-shrink-0 mt-0.5" />
                <span className="text-sm text-white/60">{SHOP_CONFIG.contact.address}</span>
              </li>
              <li>
                <a href={`tel:${SHOP_CONFIG.contact.phone}`} className="flex items-center gap-3 text-sm text-white/60 hover:text-white transition-colors">
                  <Phone className="w-4 h-4 text-jade-400 flex-shrink-0" />
                  <span>{SHOP_CONFIG.contact.phone}</span>
                </a>
              </li>
              <li>
                <a href={`mailto:${SHOP_CONFIG.contact.email}`} className="flex items-center gap-3 text-sm text-white/60 hover:text-white transition-colors">
                  <Mail className="w-4 h-4 text-jade-400 flex-shrink-0" />
                  <span>{SHOP_CONFIG.contact.email}</span>
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-white/40">
            &copy; 2026 {SHOP_CONFIG.name}. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <Link
              to="/admin/login"
              className="text-xs text-white/40 hover:text-citrus-400 transition-colors font-mono tracking-tight"
            >
              Admin
            </Link>
            <span className="text-xs text-white/30">|</span>
            <a
              href="https://www.dweche.africa"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-xs text-white/40 hover:text-citrus-400 transition-colors"
            >
              <img src="/dweche_logo.png" alt="Dweche Africa" className="h-3.5 w-auto brightness-0 invert opacity-60 hover:opacity-100 transition-opacity" />
              Powered by Dweche Africa
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
