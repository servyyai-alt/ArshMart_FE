import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Plus, Search, Edit, Trash2, Package } from 'lucide-react'
import AdminLayout from './AdminLayout.jsx'
import ProductForm from '../../components/admin/ProductForm.jsx'
import Button from '../../components/Button.jsx'
import {
  adminFetchProducts,
  adminCreateProduct,
  adminUpdateProduct,
  adminDeleteProduct,
} from '../../redux/slices/adminSlice.js'
import { getTransformedUrl } from '../../utils/cloudinary.js'
import toast from 'react-hot-toast'

export default function AdminProducts() {
  const dispatch = useDispatch()
  const { products, totalProducts, loading } = useSelector(s => s.admin)
  const [showForm, setShowForm] = useState(false)
  const [editProduct, setEditProduct] = useState(null)
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)

  useEffect(() => {
    dispatch(adminFetchProducts({ page, keyword: search, limit: 10 }))
  }, [dispatch, page, search])

  const handleCreate = async (data) => {
    const result = await dispatch(adminCreateProduct(data))
    if (adminCreateProduct.fulfilled.match(result)) {
      toast.success('Product created!')
      setShowForm(false)
    } else {
      toast.error(result.payload || 'Failed to create')
    }
  }

  const handleUpdate = async (data) => {
    const result = await dispatch(adminUpdateProduct({ id: editProduct._id, ...data }))
    if (adminUpdateProduct.fulfilled.match(result)) {
      toast.success('Product updated!')
      setEditProduct(null)
    } else {
      toast.error('Failed to update')
    }
  }

  const handleDelete = async (id, name) => {
    if (!confirm(`Delete "${name}"? This cannot be undone.`)) return
    const result = await dispatch(adminDeleteProduct(id))
    if (adminDeleteProduct.fulfilled.match(result)) {
      toast.success('Product deleted')
    } else {
      toast.error('Failed to delete')
    }
  }

  const totalPages = Math.ceil(totalProducts / 10)

  return (
    <AdminLayout title="Products" subtitle={`${totalProducts} total products`}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1) }}
            className="input-field pl-10 py-2.5 text-sm"
          />
        </div>
        <Button onClick={() => setShowForm(true)}>
          <Plus className="w-4 h-4" /> Add Product
        </Button>
      </div>

      {/* Table */}
      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left px-5 py-3.5 text-slate-400 font-medium">Product</th>
                <th className="text-left px-5 py-3.5 text-slate-400 font-medium hidden md:table-cell">Category</th>
                <th className="text-left px-5 py-3.5 text-slate-400 font-medium">Price</th>
                <th className="text-left px-5 py-3.5 text-slate-400 font-medium hidden sm:table-cell">Stock</th>
                <th className="text-left px-5 py-3.5 text-slate-400 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading && !products.length ? (
                [...Array(6)].map((_, i) => (
                  <tr key={i}><td colSpan={5} className="px-5 py-3"><div className="h-8 glass rounded animate-pulse" /></td></tr>
                ))
              ) : products.map(product => (
                <tr key={product._id} className="table-row">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      {product.images?.[0]?.url ? (
                        <img
                          src={getTransformedUrl(product.images[0].url, { width: 40, height: 40 })}
                          alt={product.name}
                          className="w-10 h-10 rounded-lg object-cover flex-shrink-0"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-lg glass flex items-center justify-center flex-shrink-0">
                          <Package className="w-5 h-5 text-slate-500" />
                        </div>
                      )}
                      <div>
                        <p className="text-slate-200 font-medium line-clamp-1 max-w-48">{product.name}</p>
                        {product.isFeatured && (
                          <span className="text-xs text-yellow-400">★ Featured</span>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 hidden md:table-cell">
                    <span className="text-slate-400 text-xs">{product.category}</span>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className="text-white font-medium">₹{product.price?.toLocaleString('en-IN')}</span>
                  </td>
                  <td className="px-5 py-3.5 hidden sm:table-cell">
                    <span className={`badge text-xs border ${product.stock > 0 ? 'text-green-400 bg-green-500/10 border-green-500/30' : 'text-red-400 bg-red-500/10 border-red-500/30'}`}>
                      {product.stock > 0 ? product.stock : 'Out of stock'}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-1">
                      <button onClick={() => setEditProduct(product)} className="btn-ghost py-1.5 px-2.5 text-xs text-blue-400 hover:text-blue-300">
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      <button onClick={() => handleDelete(product._id, product.name)} className="btn-ghost py-1.5 px-2.5 text-xs text-red-400 hover:text-red-300">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {!loading && products.length === 0 && (
            <div className="text-center py-12 text-slate-500">No products found</div>
          )}
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-6">
          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i}
              onClick={() => setPage(i + 1)}
              className={`w-9 h-9 rounded-xl text-sm transition-all ${page === i + 1 ? 'bg-primary-500 text-white' : 'glass text-slate-400 hover:text-white'}`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}

      {/* Forms */}
      {showForm && <ProductForm onSubmit={handleCreate} onClose={() => setShowForm(false)} loading={loading} />}
      {editProduct && <ProductForm product={editProduct} onSubmit={handleUpdate} onClose={() => setEditProduct(null)} loading={loading} />}
    </AdminLayout>
  )
}
