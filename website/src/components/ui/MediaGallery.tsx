import { useState } from 'react'
import Lightbox from 'yet-another-react-lightbox'
import 'yet-another-react-lightbox/styles.css'

interface MediaItem {
  type: 'image' | 'video' | 'youtube'
  url: string
  thumbnail?: string
  caption?: string
}

interface MediaGalleryProps {
  items: MediaItem[]
}

export default function MediaGallery({ items }: MediaGalleryProps) {
  const [open, setOpen] = useState(false)
  const [index, setIndex] = useState(0)

  if (items.length === 0) return null

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
        {items.map((item, i) => (
          <button
            key={i}
            onClick={() => { setIndex(i); setOpen(true) }}
            className="aspect-square bg-slate-100 overflow-hidden group cursor-pointer border border-surface-border"
          >
            {item.type === 'image' ? (
              <img
                src={item.thumbnail ?? item.url}
                alt={item.caption ?? ''}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-slate-200">
                <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
                  {item.type}
                </span>
              </div>
            )}
          </button>
        ))}
      </div>

      <Lightbox
        open={open}
        close={() => setOpen(false)}
        index={index}
        slides={items.map(item => ({
          src: item.url,
          description: item.caption,
        }))}
      />
    </>
  )
}
