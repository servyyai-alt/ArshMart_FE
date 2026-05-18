import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Plus, Edit, Trash2, Tag } from 'lucide-react'
import AdminLayout from './AdminLayout.jsx'
import CategoryForm from '../../components/admin/CategoryForm.jsx'
import Button from '../../components/Button.jsx'
import {
  adminFetchCategories,
  adminCreateCategory,
  adminUpdateCategory,
  adminDeleteCategory,
} from '../../redux/slices/adminSlice.js'
import toast from 'react-hot-toast'

export default function AdminCategories() {
  const dispatch = useDispatch()
  const { categories, loading } = useSelector(s => s.admin)
  const [showForm, setShowForm] = useState(false)
  const [editCategory, setEditCategory] = useState(null)

  useEffect(() => { dispatch(adminFetchCategories()) }, [dispatch])

  const handleCreate = async (data) => {
    const result = await dispatch(adminCreateCategory(data))
    if (adminCreateCategory.fulfilled.match(result)) {
      toast.success('Category created!')
      setShowForm(false)
    } else {
      toast.error(result.payload || 'Failed to create category')
    }
  }

  const handleUpdate = async (data) => {
    const result = await dispatch(adminUpdateCategory({ id: editCategory._id, ...data }))
    if (adminUpdateCategory.fulfilled.match(result)) {
      toast.success('Category updated!')
      setEditCategory(null)
    } else {
      toast.error(result.payload || 'Failed to update category')
    }
  }

  const handleDelete = async (id, name) => {
    if (!confirm(`Delete category "${name}"?`)) return
    const result = await dispatch(adminDeleteCategory(id))
    if (adminDeleteCategory.fulfilled.match(result)) {
      toast.success('Category deleted')
    } else {
      toast.error('Failed to delete')
    }
  }

  return (
    <AdminLayout title="Categories" subtitle={`${categories.length} categories`}>
      <div className="flex justify-between items-center mb-6">
        <div />
        <Button onClick={() => setShowForm(true)}>
          <Plus className="w-4 h-4" /> Add Category
        </Button>
      </div>

      {loading && !categories.length ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {[...Array(6)].map((_, i) => <div key={i} className="glass-card h-40 animate-pulse" />)}
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {categories.map(cat => (
            <div key={cat._id} className="glass-card overflow-hidden group">
              <div className="relative h-32 bg-dark-800">
                {cat.image ? (
                  <img src={cat.image} alt={cat.name} className="w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Tag className="w-10 h-10 text-slate-700" />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-dark-900/80 to-transparent" />
              </div>
              <div className="p-4 flex items-center justify-between">
                <div>
                  <h3 className="text-white font-medium">{cat.name}</h3>
                  <p className="text-slate-500 text-xs">{cat.productCount || 0} products</p>
                </div>
                <div className="flex gap-1">
                  <button onClick={() => setEditCategory(cat)} className="btn-ghost p-1.5 text-blue-400 hover:text-blue-300">
                    <Edit className="w-3.5 h-3.5" />
                  </button>
                  <button onClick={() => handleDelete(cat._id, cat.name)} className="btn-ghost p-1.5 text-red-400 hover:text-red-300">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showForm && <CategoryForm onSubmit={handleCreate} onClose={() => setShowForm(false)} loading={loading} />}
      {editCategory && <CategoryForm category={editCategory} onSubmit={handleUpdate} onClose={() => setEditCategory(null)} loading={loading} />}
    </AdminLayout>
  )
}
