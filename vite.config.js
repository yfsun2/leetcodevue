import { fileURLToPath, URL } from 'node:url'

import { defineConfig,loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import.meta.env

// https://vitejs.dev/config/
export default defineConfig(({command,mode})=>{
  const config=loadEnv(mode,'.')
  return{
    build:{
      emptyOutDir:true,
      // outDir:"E:\\IdeaProjects\\SpringBootStudy\\LeetcodeServer\\src\\main\\docker\\data\\nginx\\html"
      // outDir:"D:\\nginx-1.26.2\\html"
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
          target:config.VITE_BASIC_API,//后台服务所在的源
          changeOrigin:true,//修改源
          rewrite:(path)=>path.replace(/^\/api/,'')///api替换为''
        }
      }
    }
  }
})
