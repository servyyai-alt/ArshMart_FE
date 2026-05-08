import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import AdminLayout from './AdminLayout.jsx'
import UserTable from '../../components/admin/UserTable.jsx'
import { adminFetchUsers, adminUpdateUser } from '../../redux/slices/adminSlice.js'
import toast from 'react-hot-toast'

export default function AdminUsers() {
  const dispatch = useDispatch()
  const { users, loading } = useSelector(s => s.admin)

  useEffect(() => { dispatch(adminFetchUsers()) }, [dispatch])

  const handleUpdate = async (data) => {
    const result = await dispatch(adminUpdateUser(data))
    if (adminUpdateUser.fulfilled.match(result)) {
      toast.success('User updated')
    } else {
      toast.error('Failed to update')
    }
  }

  return (
    <AdminLayout title="Users" subtitle={`${users.length} registered users`}>
      <UserTable users={users} onUpdate={handleUpdate} loading={loading} />
    </AdminLayout>
  )
}
