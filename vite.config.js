import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const config = {
    plugins: [react()],
    test: {
      environment: 'jsdom',
      setupFiles: './src/setupTests.js',
      globals: true,
    },
    define: {
      __APP_VERSION__: JSON.stringify(process?.env?.npm_package_version || '1.0.0'),
    },
    server: {
      port: 3000,
      host: true,
    },
    preview: {
      port: 8080,
      host: true,
    },
  }

  // Environment-specific configuration
  if (mode === 'development') {
    config.server.https = false
  }

  return config
})
