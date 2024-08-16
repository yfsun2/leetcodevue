import {createRouter, createWebHashHistory, createWebHistory} from 'vue-router'

//导入组件
import LayoutVue from '@/views/Layout.vue'

import TypeManageVue from '@/views/lc/TypeManage.vue'
import TopicManageVue from '@/views/lc/TopicManage.vue'
import QuestionManageVue from '@/views/lc/QuestionManage.vue'
import WeeklyContestVue from '@/views/lc/ContestManage.vue'
import TopicDetailVue from "@/views/lc/TopicDetail.vue";
import IndexVue from "@/views/Index.vue";


//定义路由关系
const routes = [
    {
        path: '/', component: LayoutVue, children: [
            { path: '', component: IndexVue },
            { path: '/type', component: TypeManageVue },
            { path: '/topic', component: TopicManageVue},
            { path: '/question', component: QuestionManageVue },
            { path: '/contest', component: WeeklyContestVue },
            { path: '/topic/detail/:topicId', component: TopicDetailVue,props:true },
        ]
    }
]

//创建路由器
const router = createRouter({
    // history: createWebHistory(),
    history:createWebHashHistory(),
    routes: routes
})

//导出路由
export default router
