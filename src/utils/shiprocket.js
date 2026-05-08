import api from './api.js'

export const trackShipment = async (awbCode) => {
  try {
    const { data } = await api.get(`/shipping/track/${awbCode}`)
    return data
  } catch (err) {
    throw new Error(err.response?.data?.message || 'Tracking failed')
  }
}

export const getShippingRates = async ({ pincode, weight, length, breadth, height }) => {
  try {
    const { data } = await api.post('/shipping/rates', { pincode, weight, length, breadth, height })
    return data
  } catch (err) {
    throw new Error(err.response?.data?.message || 'Failed to get rates')
  }
}

export const checkServiceability = async ({ pickupPincode, deliveryPincode, weight }) => {
  try {
    const { data } = await api.post('/shipping/serviceability', { pickupPincode, deliveryPincode, weight })
    return data
  } catch (err) {
    throw new Error(err.response?.data?.message || 'Serviceability check failed')
  }
}
