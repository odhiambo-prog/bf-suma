import { Link } from 'react-router-dom'
import { MapPin, Phone, Mail } from 'lucide-react'
import { SHOP_CONFIG } from '@/config/shop.config'

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
  { name: 'Instagram', href: 'https://instagram.com/bfsumaeagleshop' },
  { name: 'X', href: '#' },
  { name: 'Facebook', href: '#' },
]

const socialIcons: Record<string, JSX.Element> = {
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

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-white">
      <div className="max-w-7xl mx-auto px-6 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          <div className="lg:col-span-5">
            <div className="flex items-center gap-3 mb-8">
              <img src={SHOP_CONFIG.logo} alt="BF SUMA" className="h-10 w-auto brightness-0 invert" />
              <span className="font-display text-xl text-white tracking-wide">Eagle Shop</span>
            </div>
            <p className="text-slate-400 text-sm max-w-sm leading-relaxed mb-8">
              Nairobi's premier destination for high-quality health supplements and professional wellness services.
            </p>
            <div className="flex gap-2">
              {socialLinks.map(social => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 border border-slate-700 flex items-center justify-center hover:border-jade-500 hover:text-jade-500 transition-colors group"
                  aria-label={social.name}
                >
                  <span className="text-slate-500 group-hover:text-jade-500 transition-colors">
                    {socialIcons[social.name]}
                  </span>
                </a>
              ))}
            </div>
          </div>

          <div className="lg:col-span-3">
            <h4 className="text-xs font-semibold tracking-widest uppercase text-slate-300 mb-8">
              Quick Links
            </h4>
            <ul className="flex flex-col gap-4">
              {quickLinks.map(link => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-sm text-slate-400 hover:text-white transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-4">
            <h4 className="text-xs font-semibold tracking-widest uppercase text-slate-300 mb-8">
              Contact
            </h4>
            <ul className="flex flex-col gap-6">
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-jade-500 flex-shrink-0 mt-0.5" />
                <span className="text-sm text-slate-400">{SHOP_CONFIG.contact.address}</span>
              </li>
              <li>
                <a href={`tel:${SHOP_CONFIG.contact.phone}`} className="flex items-center gap-3 text-sm text-slate-400 hover:text-white transition-colors">
                  <Phone className="w-4 h-4 text-jade-500 flex-shrink-0" />
                  <span>{SHOP_CONFIG.contact.phone}</span>
                </a>
              </li>
              <li>
                <a href={`mailto:${SHOP_CONFIG.contact.email}`} className="flex items-center gap-3 text-sm text-slate-400 hover:text-white transition-colors">
                  <Mail className="w-4 h-4 text-jade-500 flex-shrink-0" />
                  <span>{SHOP_CONFIG.contact.email}</span>
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-slate-500">
            &copy; 2026 {SHOP_CONFIG.name}. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <Link
              to="/admin/login"
              className="text-xs text-slate-600 hover:text-jade-500 transition-colors font-mono tracking-tight"
            >
              Admin
            </Link>
            <span className="text-xs text-slate-700">|</span>
            <p className="text-xs text-slate-600 font-mono tracking-tight">
              BFSUMA
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
