import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: undefined
      }
    }
  },
  server: {
    fs: {
      // 允许访问项目根目录之外的文件
      strict: false
    },
    proxy: {
      "/dist": {
        target: "http://localhost:8080", // 代理目标地址
        changeOrigin: true, // 修改请求头中的 Origin 字段
      },
    }
  }
})
