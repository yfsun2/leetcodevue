import {createRouter, createWebHashHistory} from 'vue-router'

//导入组件
import LayoutVue from '@/views/Layout.vue'

import TypeManageVue from '@/views/lc/LabelManage.vue'
import TopicManageVue from '@/views/lc/TopicManage.vue'
import QuestionManageVue from '@/views/lc/QuestionManage.vue'
import ContestManage from '@/views/lc/ContestManage.vue'
import TopicDetailVue from "@/views/lc/TopicDetail.vue";
import IndexVue from "@/views/Index.vue";
import PlatformManage from "@/views/lc/PlatformManage.vue";
import LoginVue from "@/views/Login.vue";
import UserInfoVue from "@/views/user/UserInfo.vue"
import UserAvatarVue from "@/views/user/UserAvatar.vue";
import UserResetPasswordVue from "@/views/user/UserResetPassword.vue";
import SolutionMange from "@/views/lc/SolutionMange.vue";
import EveryTea from "@/views/lc/EveryTea.vue";
import UserManage from "@/views/user/UserManage.vue";
import BlogManage from "@/views/blog/BlogManage.vue";


//定义路由关系
const routes = [
    { path: '/login', component: LoginVue },
    {
        path: '/', component: LayoutVue, children: [
            { path: '', component: IndexVue ,meta:{title:'首页',show:false}},
            { path: '/label', component: TypeManageVue ,meta:{title:'标签',show:false}},
            { path: '/topic', component: TopicManageVue,meta:{title:'题单',show:false}},
            { name:'question',path: '/question/:platformId/:platformName', component: QuestionManageVue ,props: true,meta:{title:'问题',show:true}},
            { path: '/solution/:questionId',component: SolutionMange,props: true,meta:{title:'题解',show:false}},
            { path: '/contest/:platformId/:platformName', component: ContestManage,props: true ,meta:{title:'竞赛',show:true}},
            { path: '/topic/detail/:topicId/:topicName', component: TopicDetailVue,props:true ,meta:{title:'题单详情',show:true}},
            { path: '/platform', component: PlatformManage,meta:{title:'平台',show:false}},
            { path: '/blog', component: BlogManage,meta:{title:'博客',show:false}},
            { path: '/everyday', component: EveryTea,meta:{title:'每日一题',show:false}},
            { path: '/user/info', component: UserInfoVue,meta:{title:'基本资料',show:false} },
            { path: '/user/avatar', component: UserAvatarVue ,meta:{title:'更换头像',show:false}},
            { path: '/user/resetPassword', component: UserResetPasswordVue ,meta:{title:'修改密码',show:false}},
            { path: '/user/manage', component: UserManage ,meta:{title:'用户管理',show:false}}
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
