import api from './api.js'

export const uploadImage = async (file, folder = 'products') => {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('folder', folder)

  const { data } = await api.post('/upload/image', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return data
}

export const uploadVideo = async (file, folder = 'products') => {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('folder', folder)
  formData.append('resource_type', 'video')

  const { data } = await api.post('/upload/video', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return data
}

export const deleteAsset = async (publicId, resourceType = 'image') => {
  const { data } = await api.delete('/upload/delete', {
    data: { publicId, resourceType },
  })
  return data
}

export const getTransformedUrl = (url, options = {}) => {
  const { width, height, quality = 'auto', format = 'auto' } = options
  if (!url || !url.includes('cloudinary.com')) return url

  const transformations = []
  if (width) transformations.push(`w_${width}`)
  if (height) transformations.push(`h_${height}`)
  transformations.push(`q_${quality}`, `f_${format}`, 'c_fill')

  const parts = url.split('/upload/')
  if (parts.length !== 2) return url
  return `${parts[0]}/upload/${transformations.join(',')}/${parts[1]}`
}
