import './assets/main.scss'

import { createApp } from 'vue'
import App from './App.vue'
import router from '@/router'
import {createPinia} from 'pinia'
import { createPersistedState } from 'pinia-persistedstate-plugin'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import locale from 'element-plus/dist/locale/zh-cn.js'


// 设置document.title的函数
const setPageTitle = (title) => {
    document.title = title ? `${title} - 算法刷题管理` : '算法刷题管理';
};

// 在路由守卫中设置页面标题
router.beforeEach((to, from, next) => {
    // 如果路由元信息中有title属性，则设置为页面标题
    if (to.meta && to.meta.title) {
        setPageTitle(to.meta.title);
    } else {
        // 默认页面标题
        setPageTitle();
    }
    next();
});

router.afterEach((to, from) => {
    if (to.meta.title) {
        if(to.meta.show){
            const start=to.path.lastIndexOf('/')
            document.title = to.meta.title+' - '+decodeURIComponent(to.path).slice(start+1)+' - 算法刷题管理';
        }else{
            setPageTitle(to.meta.title);
        }
    }
});

const app=createApp(App)
const pinia = createPinia();
const persist = createPersistedState();

pinia.use(persist)
app.use(pinia)
app.use(router)
app.use(ElementPlus,{locale})
app.mount('#app')
