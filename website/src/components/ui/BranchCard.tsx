import { motion } from 'framer-motion'
import { MapPin, Phone, Mail, ExternalLink } from 'lucide-react'

interface BranchCardProps {
  name: string
  address: string
  maps_embed_url?: string
  maps_link?: string
  phone?: string
  email?: string
}

export default function BranchCard({ name, address, maps_embed_url, maps_link, phone, email }: BranchCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="bg-white border border-surface-border"
    >
      {maps_embed_url && (
        <div className="w-full bg-slate-100 h-36">
          <iframe
            src={maps_embed_url}
            title={name}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="w-full h-full"
          />
        </div>
      )}
      <div className="p-5 space-y-3">
        <h3 className="font-display text-base text-slate-900">{name}</h3>
        <div className="flex items-start gap-2 text-xs text-slate-500">
          <MapPin className="w-3.5 h-3.5 text-jade-600 flex-shrink-0 mt-0.5" strokeWidth={1.5} />
          <span>{address}</span>
        </div>
        {phone && (
          <a href={`tel:${phone}`} className="flex items-center gap-2 text-xs text-slate-500 hover:text-jade-600 transition-colors">
            <Phone className="w-3.5 h-3.5 text-jade-600 flex-shrink-0" strokeWidth={1.5} />
            <span>{phone}</span>
          </a>
        )}
        {email && (
          <a href={`mailto:${email}`} className="flex items-center gap-2 text-xs text-slate-500 hover:text-jade-600 transition-colors">
            <Mail className="w-3.5 h-3.5 text-jade-600 flex-shrink-0" strokeWidth={1.5} />
            <span>{email}</span>
          </a>
        )}
        {maps_link && (
          <a
            href={maps_link}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-[10px] font-semibold text-jade-600 hover:underline uppercase tracking-wider"
          >
            Open in Maps <ExternalLink className="w-2.5 h-2.5" />
          </a>
        )}
      </div>
    </motion.div>
  )
}
