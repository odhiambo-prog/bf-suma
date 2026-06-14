import { Link } from 'react-router-dom'
import { MapPin, Phone, Mail, ArrowUpRight } from 'lucide-react'
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
  { name: 'Facebook', href: SHOP_CONFIG.social.facebook },
  { name: 'Instagram', href: SHOP_CONFIG.social.instagram },
  { name: 'TikTok', href: SHOP_CONFIG.social.tiktok },
  { name: 'YouTube', href: SHOP_CONFIG.social.youtube },
]

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
                  className="w-9 h-9 border border-slate-700 flex items-center justify-center hover:border-jade-500 hover:text-jade-500 transition-colors group"
                  aria-label={social.name}
                >
                  <ArrowUpRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-jade-500 transition-colors" />
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
