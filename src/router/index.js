import {createRouter, createWebHashHistory} from 'vue-router'

//导入组件
import LayoutVue from '@/views/Layout.vue'

import TypeManageVue from '@/views/lc/TypeManage.vue'
import TopicManageVue from '@/views/lc/TopicManage.vue'
import QuestionManageVue from '@/views/lc/QuestionManage.vue'
import WeeklyContestVue from '@/views/lc/ContestManage.vue'
import TopicDetailVue from "@/views/lc/TopicDetail.vue";
import IndexVue from "@/views/Index.vue";
import PlatformManage from "@/views/lc/PlatformManage.vue";
import LoginVue from "@/views/Login.vue";
import UserInfoVue from "@/views/user/UserInfo.vue"
import UserAvatarVue from "@/views/user/UserAvatar.vue";
import UserResetPasswordVue from "@/views/user/UserResetPassword.vue";


//定义路由关系
const routes = [
    { path: '/login', component: LoginVue },
    {
        path: '/', component: LayoutVue, children: [
            { path: '', component: IndexVue },
            { path: '/type', component: TypeManageVue },
            { path: '/topic', component: TopicManageVue},
            { path: '/question/:platformId', component: QuestionManageVue ,props: true},
            { path: '/contest/:platformId', component: WeeklyContestVue,props: true },
            { path: '/topic/detail/:topicId/:topicName', component: TopicDetailVue,props:true },
            { path: '/platform', component: PlatformManage},
            { path: '/user/info', component: UserInfoVue },
            { path: '/user/avatar', component: UserAvatarVue },
            { path: '/user/resetPassword', component: UserResetPasswordVue }
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
