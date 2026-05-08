import { useState } from 'react'
import { X, Upload, Loader2 } from 'lucide-react'
import Button from '../Button.jsx'
import { uploadImage } from '../../utils/cloudinary.js'
import toast from 'react-hot-toast'

export default function CategoryForm({ category, onSubmit, onClose, loading }) {
  const [form, setForm] = useState({
    name: category?.name || '',
    description: category?.description || '',
    image: category?.image || '',
  })
  const [uploading, setUploading] = useState(false)

  const handleImageUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    setUploading(true)
    try {
      const result = await uploadImage(file, 'categories')
      setForm(f => ({ ...f, image: result.url }))
      toast.success('Image uploaded!')
    } catch {
      toast.error('Upload failed')
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
      <div className="relative glass-dark rounded-2xl w-full max-w-md animate-slide-up">
        <div className="flex items-center justify-between p-5 border-b border-white/10">
          <h2 className="text-white font-semibold">{category ? 'Edit Category' : 'Add Category'}</h2>
          <button onClick={onClose} className="btn-ghost p-2 rounded-lg"><X className="w-4 h-4" /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div>
            <label className="label">Category Name *</label>
            <input className="input-field" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required />
          </div>
          <div>
            <label className="label">Description</label>
            <textarea className="input-field resize-none h-20" value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
          </div>
          <div>
            <label className="label">Image</label>
            {form.image && (
              <img src={form.image} alt="" className="w-full h-32 object-cover rounded-xl mb-3" />
            )}
            <label className={`btn-secondary w-full justify-center py-3 cursor-pointer ${uploading ? 'opacity-50' : ''}`}>
              {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
              {uploading ? 'Uploading…' : form.image ? 'Change Image' : 'Upload Image'}
              <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} disabled={uploading} />
            </label>
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
