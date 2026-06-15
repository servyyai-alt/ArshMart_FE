import { useState } from 'react'
import { X, Upload, Loader2, Trash2, Image as ImageIcon, Video } from 'lucide-react'
import Button from '../Button.jsx'
import { uploadImage, uploadVideo, deleteAsset } from '../../utils/cloudinary.js'
import toast from 'react-hot-toast'

export default function CategoryForm({ category, onSubmit, onClose, loading }) {
  const [form, setForm] = useState({
    name: category?.name || '',
    description: category?.description || '',
    image: category?.image || '',
    media: category?.media || (category?.image ? { kind: 'image', url: category.image, publicId: category.imagePublicId || '' } : { kind: 'image', url: '', publicId: '' }),
  })
  const [uploading, setUploading] = useState(false)

  const handleImageUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    setUploading(true)
    try {
      const result = await uploadImage(file, 'categories')
      setForm(f => ({
        ...f,
        image: result.url,
        media: { kind: 'image', url: result.url, publicId: result.public_id },
      }))
      toast.success('Image uploaded!')
    } catch {
      toast.error('Upload failed')
    } finally {
      setUploading(false)
    }
  }

  const handleVideoUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    setUploading(true)
    try {
      const result = await uploadVideo(file, 'categories')
      setForm(f => ({
        ...f,
        media: { kind: 'video', url: result.url, publicId: result.public_id },
      }))
      toast.success('Video uploaded!')
    } catch {
      toast.error('Upload failed')
    } finally {
      setUploading(false)
    }
  }

  const handleDeleteMedia = async () => {
    if (!form.media?.publicId) {
      setForm(f => ({ ...f, media: { kind: 'image', url: '', publicId: '' }, image: '' }))
      return
    }
    if (!confirm('Delete category media?')) return
    setUploading(true)
    try {
      await deleteAsset(form.media.publicId, form.media.kind === 'video' ? 'video' : 'image')
      setForm(f => ({ ...f, media: { kind: 'image', url: '', publicId: '' }, image: '' }))
      toast.success('Media deleted')
    } catch {
      toast.error('Failed to delete')
    } finally {
      setUploading(false)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.name) { toast.error('Category name required'); return }
    onSubmit(form)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-dark-950/80 backdrop-blur-sm" onClick={onClose} />
      <div className="relative glass-dark border border-white/30 rounded-2xl w-full max-w-md animate-slide-up">
        <div className="flex items-center justify-between p-5 border-b border-white/10">
          <h2 className="text-white font-semibold">{category ? 'Edit Category' : 'Add Category'}</h2>
          <button onClick={onClose} className="btn-ghost p-2 rounded-lg"><X className="w-4 h-4" /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div>
            <label className="label">Category Name *</label>
            <input className="input-field text-white" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required />
          </div>
          <div>
            <label className="label">Description</label>
            <textarea className="input-field text-white resize-none h-20" value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
          </div>
          <div>
            <label className="label">Category Media (image or video)</label>
            {form.media?.url && (
              <div className="relative w-full h-32 rounded-xl mb-3 overflow-hidden border border-white/10">
                {form.media.kind === 'video' ? (
                  <video src={form.media.url} className="w-full h-full object-cover" muted playsInline />
                ) : (
                  <img src={form.media.url} alt="" className="w-full h-full object-cover" />
                )}
                <button
                  type="button"
                  onClick={handleDeleteMedia}
                  className="absolute top-2 right-2 w-8 h-8 rounded-lg bg-red-500/80 hover:bg-red-500 flex items-center justify-center"
                  title="Delete"
                  disabled={uploading}
                >
                  <Trash2 className="w-4 h-4 text-white" />
                </button>
              </div>
            )}

            <div className="grid grid-cols-2 gap-2">
              <label className={`btn-secondary border border-white/30 w-full justify-center py-3 cursor-pointer ${uploading ? 'opacity-50 pointer-events-none' : ''}`}>
                {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ImageIcon className="w-4 h-4" />}
                {uploading ? 'Uploading…' : 'Upload Image'}
                <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} disabled={uploading} />
              </label>
              <label className={`btn-secondary border border-white/30 w-full justify-center py-3 cursor-pointer ${uploading ? 'opacity-50 pointer-events-none' : ''}`}>
                {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Video className="w-4 h-4" />}
                {uploading ? 'Uploading…' : 'Upload Video'}
                <input type="file" accept="video/*" className="hidden" onChange={handleVideoUpload} disabled={uploading} />
              </label>
            </div>
          </div>
          <div className="flex gap-3 pt-1">
            <button type="button" onClick={onClose} className="btn-secondary flex-1 justify-center">Cancel</button>
            <Button type="submit" loading={loading} className="flex-1 justify-center">
              {category ? 'Update' : 'Create'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
