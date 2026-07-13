import { cn } from '@/lib/utils'

interface GoogleMapEmbedProps {
  embedUrl: string
  title?: string
  height?: 'sm' | 'md' | 'lg'
}

const heights = {
  sm: 'h-48',
  md: 'h-64',
  lg: 'h-80',
}

export default function GoogleMapEmbed({ embedUrl, title = 'Map', height = 'sm' }: GoogleMapEmbedProps) {
  return (
    <div className={cn('w-full bg-surface-subtle', heights[height])}>
      <iframe
        src={embedUrl}
        title={title}
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        className="w-full h-full"
      />
    </div>
  )
}
