import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  // base: process.env.NODE_ENV === 'production'?"/leetcodevue/":"/",
  // base:'/leetcodevue/',
  build:{
    outDir:"E:\\IdeaProjects\\SpringBootStudy\\LeetcodeServer\\src\\main\\resources\\static"
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
      '/':{//获取路径中包含了/api的请求
        // target:'http://syfblog.w1.luyouxia.net/',//后台服务所在的源
        target:'http://192.168.0.123:8082/',//后台服务所在的源
        changeOrigin:true,//修改源
        rewrite:(path)=>path.replace(/^\/api/,'')///api替换为''
      }
    }
  }
})
