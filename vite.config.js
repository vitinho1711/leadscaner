import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()], 
  server: { 
    proxy: { '/api': 'http://localhost:3001' },
    watch: {
      ignored: ['**/.wwebjs_auth/**', '**/.sdr_wwebjs_auth/**', '**/.wwebjs_cache/**', '**/leads.json', '**/history.json', '**/users.json']
    }
  },
  optimizeDeps: {
    include: ['@supabase/supabase-js']
  }
})
