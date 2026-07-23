import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

const normalizeProxyTarget = (value = '') => {
  const trimmed = String(value || '').trim().replace(/\/+$/, '')
  if (!trimmed) return 'http://127.0.0.1:5000'
  return trimmed.replace(/\/api\/?$/, '') || 'http://127.0.0.1:5000'
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const proxyTarget = normalizeProxyTarget(env.VITE_API_URL)

  return {
    plugins: [react()],
    server: {
      proxy: {
        '/api': {
          target: proxyTarget,
          changeOrigin: true,
        },
      },
    },
  }
})
