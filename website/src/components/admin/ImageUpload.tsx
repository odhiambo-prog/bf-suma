import { useState } from 'react'
import { Upload, X } from 'lucide-react'
import { supabase } from '@/lib/supabase'

interface ImageUploadProps {
  bucket: string
  onUpload: (url: string) => void
  accept?: string
  className?: string
}

export default function ImageUpload({ bucket, onUpload, accept = 'image/*', className }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [preview, setPreview] = useState<string | null>(null)

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    const ext = file.name.split('.').pop()
    const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`

    const { error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(filename, file, { contentType: file.type })

    if (uploadError) {
      console.error('Upload error:', uploadError)
      setUploading(false)
      return
    }

    const { data: { publicUrl } } = supabase.storage
      .from(bucket)
      .getPublicUrl(filename)

    setPreview(URL.createObjectURL(file))
    onUpload(publicUrl)
    setUploading(false)
  }

  const handleRemove = () => {
    setPreview(null)
    onUpload('')
  }

  return (
    <div className={className}>
      {preview ? (
        <div className="relative inline-block">
          <img src={preview} alt="Preview" className="h-24 w-24 object-cover rounded border border-slate-200" />
          <button
            onClick={handleRemove}
            className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      ) : (
        <label className="flex items-center gap-2 px-4 py-3 border-2 border-dashed border-slate-300 rounded-lg cursor-pointer hover:border-jade-400 transition-colors text-sm text-slate-500">
          <Upload className="w-4 h-4" />
          <span>{uploading ? 'Uploading...' : 'Upload image'}</span>
          <input type="file" accept={accept} className="hidden" onChange={handleFile} disabled={uploading} />
        </label>
      )}
    </div>
  )
}
