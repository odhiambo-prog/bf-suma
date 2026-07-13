import { MapPin, Phone, Mail, ExternalLink } from 'lucide-react'
import { FloatingSurface } from '@/components/ui/Reveal'

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
    <FloatingSurface className="group overflow-hidden">
      {maps_embed_url && (
        <div className="w-full h-36 overflow-hidden bg-surface-subtle">
          <iframe
            src={maps_embed_url}
            title={name}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="w-full h-full scale-100 group-hover:scale-110 transition-transform duration-500 ease-out"
          />
        </div>
      )}
      <div className="p-5 space-y-3">
        <div className="flex items-start gap-2">
          <MapPin className="w-3.5 h-3.5 text-citrus-500 flex-shrink-0 mt-1" strokeWidth={1.5} />
          <h3 className="font-display text-base text-ink">{name}</h3>
        </div>
        <div className="flex items-start gap-2 text-xs text-muted-500 pl-5">
          <span>{address}</span>
        </div>
        {phone && (
          <a href={`tel:${phone}`} className="flex items-center gap-2 text-xs text-muted-500 hover:text-jade-600 transition-colors">
            <Phone className="w-3.5 h-3.5 text-jade-600 flex-shrink-0" strokeWidth={1.5} />
            <span>{phone}</span>
          </a>
        )}
        {email && (
          <a href={`mailto:${email}`} className="flex items-center gap-2 text-xs text-muted-500 hover:text-jade-600 transition-colors">
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
    </FloatingSurface>
  )
}
