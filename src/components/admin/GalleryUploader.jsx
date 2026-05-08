import { useState } from 'react'
import { Upload, Loader2, X, Image } from 'lucide-react'
import Masonry from 'react-masonry-css'
import { uploadImage } from '../../utils/cloudinary.js'
import toast from 'react-hot-toast'

const breakpointCols = { default: 4, 1280: 3, 768: 2, 480: 1 }

export default function GalleryUploader({ images = [], onUpload, onDelete }) {
  const [uploading, setUploading] = useState(false)
  const [dragOver, setDragOver] = useState(false)

  const handleFiles = async (files) => {
    const fileArr = Array.from(files)
    if (!fileArr.length) return
    setUploading(true)
    try {
      const results = await Promise.all(fileArr.map(f => uploadImage(f, 'gallery')))
      const newImages = results.map(r => ({ url: r.url, public_id: r.public_id, caption: '' }))
      onUpload(newImages)
      toast.success(`${fileArr.length} image${fileArr.length > 1 ? 's' : ''} uploaded`)
    } catch {
      toast.error('Upload failed')
    } finally {
      setUploading(false)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setDragOver(false)
    handleFiles(e.dataTransfer.files)
  }

  return (
    <div className="space-y-6">
      {/* Upload Zone */}
      <label
        className={`block glass rounded-2xl border-2 border-dashed transition-all cursor-pointer text-center py-12 px-6 ${
          dragOver ? 'border-primary-500 bg-primary-500/5' : 'border-white/10 hover:border-primary-500/50'
        } ${uploading ? 'opacity-50 pointer-events-none' : ''}`}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
      >
        {uploading ? (
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="w-10 h-10 text-primary-400 animate-spin" />
            <p className="text-slate-400">Uploading images…</p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3">
            <div className="w-14 h-14 rounded-2xl bg-primary-500/10 border border-primary-500/20 flex items-center justify-center">
              <Upload className="w-7 h-7 text-primary-400" />
            </div>
            <div>
              <p className="text-white font-medium">Drop images here or click to upload</p>
              <p className="text-slate-500 text-sm mt-1">PNG, JPG, WEBP up to 10MB each</p>
            </div>
          </div>
        )}
        <input type="file" accept="image/*" multiple className="hidden" onChange={e => handleFiles(e.target.files)} disabled={uploading} />
      </label>

      {/* Gallery Masonry */}
      {images.length > 0 ? (
        <Masonry breakpointCols={breakpointCols} className="masonry-grid" columnClassName="masonry-grid-col">
          {images.map((img, i) => (
            <div key={img.public_id || i} className="mb-4 group relative rounded-xl overflow-hidden glass-card p-0">
              <img src={img.url} alt={img.caption || ''} className="w-full object-cover" loading="lazy" />
              <div className="absolute inset-0 bg-dark-950/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <button
                  onClick={() => onDelete(img)}
                  className="w-9 h-9 bg-red-500/80 rounded-lg flex items-center justify-center hover:bg-red-500 transition-colors"
                >
                  <X className="w-4 h-4 text-white" />
                </button>
              </div>
            </div>
          ))}
        </Masonry>
      ) : (
        !uploading && (
          <div className="text-center py-12">
            <Image className="w-12 h-12 text-slate-700 mx-auto mb-3" />
            <p className="text-slate-500">No images yet. Upload some!</p>
          </div>
        )
      )}
    </div>
  )
}
