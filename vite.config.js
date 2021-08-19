/*
 * @Author: your name
 * @Date: 2021-08-15 15:53:55
 * @LastEditTime: 2021-08-19 14:05:01
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \bloge:\Vue_store\manager-fe\vite.config.js
 */
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    host: '0.0.0.0',
    port: 8888,
    proxy: {
      '/api': {
        target: "http://localhost:3000"
      }
    }
  },
  plugins: [vue()],
})
