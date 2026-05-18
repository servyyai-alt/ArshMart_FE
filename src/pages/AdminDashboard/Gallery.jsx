import { useEffect, useState } from 'react'
import AdminLayout from './AdminLayout.jsx'
import GalleryUploader from '../../components/admin/GalleryUploader.jsx'
import api from '../../utils/api.js'
import { deleteAsset } from '../../utils/cloudinary.js'
import toast from 'react-hot-toast'

export default function AdminGallery() {
  const [images, setImages] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/admin/gallery')
      .then(res => setImages(res.data.images || []))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const handleUpload = async (newImages) => {
    try {
      await api.post('/admin/gallery', { images: newImages })
      setImages(prev => [...prev, ...newImages])
    } catch {
      toast.error('Failed to save gallery')
    }
  }

  const handleDelete = async (image) => {
    if (!confirm('Delete this image?')) return
    try {
      const encodedPublicId = encodeURIComponent(image.public_id)
      await api.delete(`/admin/gallery/${encodedPublicId}`)
      setImages(prev => prev.filter(i => i.public_id !== image.public_id))
      toast.success('Image removed from gallery')
      try {
        await deleteAsset(image.public_id)
      } catch {
        toast.error('Removed from gallery, but failed to delete from storage')
      }
    } catch {
      toast.error('Failed to delete')
    }
  }

  return (
    <AdminLayout title="Gallery" subtitle="Manage product media">
      {loading ? (
        <div className="text-center py-20"><div className="spinner w-8 h-8 mx-auto" /></div>
      ) : (
        <GalleryUploader images={images} onUpload={handleUpload} onDelete={handleDelete} />
      )}
    </AdminLayout>
  )
}
