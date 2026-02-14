import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: '/danstalk/',
  server: {
    port: 5179,
    strictPort: false, // 若 5179 被占用会尝试下一端口
  },
})
