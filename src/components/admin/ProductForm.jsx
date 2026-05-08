import { useState } from 'react'
import { X, Plus, Upload, Loader2 } from 'lucide-react'
import Button from '../Button.jsx'
import { uploadImage } from '../../utils/cloudinary.js'
import toast from 'react-hot-toast'

const CATEGORIES = [
  'Electronics', 'Fashion', 'Home & Kitchen', 'Sports', 'Books',
  'Beauty', 'Toys', 'Automotive', 'Grocery', 'Health',
]

export default function ProductForm({ product, onSubmit, onClose, loading }) {
  const [form, setForm] = useState({
    name: product?.name || '',
    description: product?.description || '',
    price: product?.price || '',
    originalPrice: product?.originalPrice || '',
    category: product?.category || '',
    stock: product?.stock || '',
    brand: product?.brand || '',
    isFeatured: product?.isFeatured || false,
    images: product?.images || [],
    specifications: product?.specifications || [],
  })
  const [uploading, setUploading] = useState(false)

  const set = (key, value) => setForm(f => ({ ...f, [key]: value }))

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files)
    if (!files.length) return
    setUploading(true)
    try {
      const uploads = await Promise.all(files.map(f => uploadImage(f, 'products')))
      const newImages = uploads.map(u => ({ url: u.url, public_id: u.public_id }))
      set('images', [...form.images, ...newImages])
      toast.success(`${files.length} image${files.length > 1 ? 's' : ''} uploaded`)
    } catch (err) {
      toast.error('Image upload failed')
    } finally {
      setUploading(false)
    }
  }

  const removeImage = (idx) => set('images', form.images.filter((_, i) => i !== idx))

  const addSpec = () => set('specifications', [...form.specifications, { key: '', value: '' }])
  const removeSpec = (idx) => set('specifications', form.specifications.filter((_, i) => i !== idx))
  const updateSpec = (idx, field, value) => {
    const specs = [...form.specifications]
    specs[idx] = { ...specs[idx], [field]: value }
    set('specifications', specs)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.name || !form.price || !form.category || !form.stock) {
      toast.error('Please fill all required fields')
      return
    }
    onSubmit(form)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-dark-950/80 backdrop-blur-sm" onClick={onClose} />
      <div className="relative glass-dark rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto scrollbar-hide animate-slide-up">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10 sticky top-0 glass-dark z-10">
          <h2 className="text-white font-semibold text-lg">{product ? 'Edit Product' : 'Add Product'}</h2>
          <button onClick={onClose} className="btn-ghost p-2 rounded-lg"><X className="w-5 h-5" /></button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Basic Info */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="label">Product Name *</label>
              <input className="input-field" value={form.name} onChange={e => set('name', e.target.value)} required />
            </div>
            <div>
              <label className="label">Category *</label>
              <select className="input-field appearance-none" value={form.category} onChange={e => set('category', e.target.value)} required>
                <option value="" className="bg-dark-800">Select category</option>
                {CATEGORIES.map(c => <option key={c} value={c} className="bg-dark-800">{c}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Brand</label>
              <input className="input-field" value={form.brand} onChange={e => set('brand', e.target.value)} />
            </div>
            <div>
              <label className="label">Price (₹) *</label>
              <input type="number" className="input-field" value={form.price} onChange={e => set('price', e.target.value)} required min="0" />
            </div>
            <div>
              <label className="label">Original Price (₹)</label>
              <input type="number" className="input-field" value={form.originalPrice} onChange={e => set('originalPrice', e.target.value)} min="0" />
            </div>
            <div>
              <label className="label">Stock *</label>
              <input type="number" className="input-field" value={form.stock} onChange={e => set('stock', e.target.value)} required min="0" />
            </div>
            <div className="flex items-center gap-3 pt-6">
              <button
                type="button"
                onClick={() => set('isFeatured', !form.isFeatured)}
                className={`w-10 h-6 rounded-full transition-all ${form.isFeatured ? 'bg-primary-500' : 'bg-white/10'}`}
              >
                <div className={`w-4 h-4 rounded-full bg-white mx-1 transition-transform ${form.isFeatured ? 'translate-x-4' : 'translate-x-0'}`} />
              </button>
              <span className="text-slate-300 text-sm">Featured Product</span>
            </div>
          </div>

          <div>
            <label className="label">Description</label>
            <textarea className="input-field resize-none h-24" value={form.description} onChange={e => set('description', e.target.value)} />
          </div>

          {/* Images */}
          <div>
            <label className="label">Product Images</label>
            <div className="flex flex-wrap gap-3 mb-3">
              {form.images.map((img, i) => (
                <div key={i} className="relative w-20 h-20">
                  <img src={img.url} alt="" className="w-full h-full object-cover rounded-xl" />
                  <button
                    type="button"
                    onClick={() => removeImage(i)}
                    className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center"
                  >
                    <X className="w-3 h-3 text-white" />
                  </button>
                </div>
              ))}
              <label className={`w-20 h-20 glass rounded-xl flex flex-col items-center justify-center gap-1 cursor-pointer hover:border-primary-500/50 transition-colors text-slate-400 hover:text-primary-400 ${uploading ? 'opacity-50 pointer-events-none' : ''}`}>
                {uploading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Upload className="w-5 h-5" />}
                <span className="text-xs">{uploading ? 'Uploading' : 'Upload'}</span>
                <input type="file" accept="image/*" multiple className="hidden" onChange={handleImageUpload} disabled={uploading} />
              </label>
            </div>
          </div>

          {/* Specifications */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="label mb-0">Specifications</label>
              <button type="button" onClick={addSpec} className="btn-ghost text-xs py-1 px-3">
                <Plus className="w-3 h-3" /> Add
              </button>
            </div>
            <div className="space-y-2">
              {form.specifications.map((spec, i) => (
                <div key={i} className="flex gap-2">
                  <input className="input-field text-sm py-2" placeholder="Key" value={spec.key} onChange={e => updateSpec(i, 'key', e.target.value)} />
                  <input className="input-field text-sm py-2" placeholder="Value" value={spec.value} onChange={e => updateSpec(i, 'value', e.target.value)} />
                  <button type="button" onClick={() => removeSpec(i)} className="text-slate-500 hover:text-red-400 flex-shrink-0">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="btn-secondary flex-1 justify-center py-3">Cancel</button>
            <Button type="submit" loading={loading} className="flex-1 justify-center py-3">
              {product ? 'Update Product' : 'Add Product'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
