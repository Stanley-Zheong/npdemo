import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'

const apiProxyTarget = process.env.NPDEMO_API_PROXY_TARGET ?? 'http://localhost:8080'

export default defineConfig({
  plugins: [vue()],
  server: { port: 5173, proxy: { '/api': apiProxyTarget } },
  test: { environment: 'jsdom' },
})
