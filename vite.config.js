import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  // base: process.env.NODE_ENV === 'production'?"/leetcodevue/":"/",
  // base:'/leetcodevue/',
  build:{
    emptyOutDir:true,
    outDir:"E:\\IdeaProjects\\SpringBootStudy\\LeetcodeServer\\src\\main\\docker\\data\\nginx\\html"
  },
  plugins: [
    vue(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  server:{
    proxy:{
      '/api':{//获取路径中包含了/api的请求
        target:process.env.NODE_ENV === 'production'?'http://172.30.62.63:8083/':'http://localhost:8082/',//后台服务所在的源
        changeOrigin:true,//修改源
        rewrite:(path)=>path.replace(/^\/api/,'')///api替换为''
      }
    }
  }
})
