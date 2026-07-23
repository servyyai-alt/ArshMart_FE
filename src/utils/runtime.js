const trimTrailingSlash = (value = '') => String(value || '').trim().replace(/\/+$/, '')

const normalizeApiBaseUrl = (value = '') => {
  const trimmed = trimTrailingSlash(value)
  if (!trimmed) return '/api'
  return trimmed.endsWith('/api') ? trimmed : `${trimmed}/api`
}

const siteUrl = trimTrailingSlash(import.meta.env.VITE_SITE_URL || import.meta.env.VITE_APP_URL) || 'https://sandhaikart.com'

export const runtimeConfig = {
  appName: import.meta.env.VITE_APP_NAME || 'Sandhaikart',
  apiBaseUrl: normalizeApiBaseUrl(import.meta.env.VITE_API_URL),
  siteUrl,
  ogImageUrl: trimTrailingSlash(import.meta.env.VITE_OG_IMAGE_URL) || `${siteUrl}/favicon.png`,
  razorpayKeyId: import.meta.env.VITE_RAZORPAY_KEY_ID || '',
  whatsappNumber: import.meta.env.VITE_WHATSAPP_NUMBER || '',
  whatsappUrl: trimTrailingSlash(import.meta.env.VITE_WHATSAPP_URL || ''),
  instagramUrl: trimTrailingSlash(import.meta.env.VITE_INSTAGRAM_URL || ''),
  facebookUrl: trimTrailingSlash(import.meta.env.VITE_FACEBOOK_URL || ''),
  whatsappMessage: import.meta.env.VITE_WHATSAPP_MESSAGE || 'Thank you for choosing Sandhaikart. How can I help you?',
}

export { normalizeApiBaseUrl, trimTrailingSlash }
