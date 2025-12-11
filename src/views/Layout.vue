<script setup>
import {
    Management,
    Promotion,
    User,
    EditPen, CaretBottom, Crop, SwitchButton, UserFilled, Star, MilkTea, Bell, MessageBox,
} from '@element-plus/icons-vue'
import {platformListService} from "@/api/platform.js";
import {unReadService,listService,setReadService,setAllReadService} from "@/api/message.js";
import {useRouter} from 'vue-router'
import {onMounted, onUnmounted, ref} from 'vue'
import {ElMessage,ElMessageBox} from 'element-plus'
import avatar from '@/assets/default.png'

import {userInfoService} from '@/api/user.js'
import useUserInfoStore from '@/stores/userInfo.js'
import {useTokenStore} from '@/stores/token.js'
const tokenStore = useTokenStore();
const userInfoStore = useUserInfoStore();
//调用函数,获取用户详细信息
const getUserInfo = async()=>{
    //调用接口
    await userInfoService().then(result=>{
        //数据存储到pinia中
        getPlatformList()
        userInfoStore.setInfo(result.data);
    }).catch(err=>{
        console.log(err)
    })
}


const router = useRouter();
//条目被点击后,调用的函数

const search = ref('')

const handleCommand = (command)=>{
    //判断指令
    if(command === 'logout'){
        //退出登录
        ElMessageBox.confirm(
            '您确认要退出吗?',
            '温馨提示',
            {
                confirmButtonText: '确认',
                cancelButtonText: '取消',
                type: 'warning',
            }
        )
            .then(async () => {
                //退出登录
                //1.清空pinia中存储的token以及个人信息
                tokenStore.removeToken()
                userInfoStore.removeInfo()
                clearInterval(gu)
                //2.跳转到登录页面
                await router.push('/login')
                ElMessage({
                    type: 'success',
                    message: '退出登录成功',
                })

            })
            .catch((err) => {
                console.log(err)
                ElMessage({
                    type: 'info',
                    message: '用户取消了退出登录',
                })
            })
    }else{
        //路由
        router.push('/user/'+command)
    }
}

const platformList=ref([])

const userInfo = ref({...userInfoStore.info})

const getPlatformList = async () => {
    let params={
        search:""
    };
    await platformListService(params).then(result=>{
        platformList.value=result.data;
    }).catch(err=>{
        console.log(err)
    })
}

const unread = ref(0)
const dialogVisible = ref(false)
const messageList=ref([])

const messageModel=ref({
    content:'',
    createTime:'',
    sendName:'',
})

const getUnread = async () => {
    await unReadService().then(result=>{
        unread.value=result.data;
    }).catch(err=>{
        console.log(err)
    })
}

let gu=null

onMounted(()=>{
    getUserInfo();
    getUnread()
    gu=setInterval(()=>{
        getUnread()
    },60000)
})

onUnmounted(()=>{
    clearInterval(gu)
})

const showDialog=()=>{
    dialogVisible.value=true;
    listMessage();
}

const listMessage=async(search)=>{
    let params={
        search:search
    }
    await listService(params).then(result=>{
        messageList.value=result.data;
        debugger
    }).catch(err=>{
        console.log(err)
    })
}

const setRead=async(id)=>{
    await setReadService(id).then(result=>{
        getUnread()
        listMessage()
    }).catch(err=>{
        console.log(err)
    })
}

const allRead=async()=>{
    await setAllReadService().then(result=>{
        getUnread()
        listMessage()
        ElMessage.success('全部已读');
    }).catch(err=>{
        console.log(err)
    })
}

</script>

<template>
  <el-container class="layout-container">
    <el-aside width="200px">
      <div class="el-aside__logo"></div>
      <el-menu active-text-color="#ffd04b" background-color="#232323"  text-color="#fff" :router>
          <el-sub-menu index="1">
              <template #title>
                  <el-icon>
                      <EditPen />
                  </el-icon>
                  <span>种类管理</span>
              </template>
              <el-menu-item index="/label">
                  <el-icon>
                      <EditPen />
                  </el-icon>
                  <span>标签管理</span>
              </el-menu-item>
              <el-menu-item index="/platform">
                  <el-icon>
                      <EditPen />
                  </el-icon>
                  <span>平台管理</span>
              </el-menu-item>
          </el-sub-menu>

          <el-sub-menu index="2">
              <template #title>
                  <el-icon>
                      <Management />
                  </el-icon>
                  <span>问题管理</span>
              </template>
              <el-menu-item index="/everyday">
                  <img src="../assets/0x3f.png" style="width: 20px;margin-right: 10px"  alt=""/>
                  <span>每日一题</span>
              </el-menu-item>
              <el-menu-item v-for="(item,index) in platformList" :key="index" :index="'/question/'+item.id+'/'+item.name">
                  <img v-if="item.logo" :src="item.logo" style="width: 20px;margin-right: 10px"  alt=""/>
                  <el-icon v-else>
                      <Management />
                  </el-icon>
                  <span>{{item.name}}</span>
              </el-menu-item>
          </el-sub-menu>

          <el-sub-menu index="3">
              <template #title>
                  <el-icon>
                      <Promotion />
                  </el-icon>
                  <span>竞赛管理</span>
              </template>
              <el-menu-item v-for="(item,index) in platformList" :key="index" :index="'/contest/'+item.id+'/'+item.name">
                  <img v-if="item.logo" :src="item.logo" style="width: 20px;margin-right: 10px"  alt=""/>
                  <el-icon v-else>
                      <Promotion />
                  </el-icon>
                  <span>{{item.name}}</span>
              </el-menu-item>
          </el-sub-menu>

        <el-menu-item index="/topic">
          <el-icon>
            <Star />
          </el-icon>
          <span>题单管理</span>
        </el-menu-item>
          <el-menu-item index="/blog">
              <el-icon>
                  <MessageBox />
              </el-icon>
              <span>个人博客</span>
          </el-menu-item>
          <el-sub-menu index="4">
              <template #title>
                  <el-icon>
                      <UserFilled />
                  </el-icon>
                  <span>个人中心</span>
              </template>
              <el-menu-item index="/user/info">
                  <el-icon>
                      <User />
                  </el-icon>
                  <span>基本资料</span>
              </el-menu-item>
              <el-menu-item index="/user/avatar">
                  <el-icon>
                      <Crop />
                  </el-icon>
                  <span>更换头像</span>
              </el-menu-item>
              <el-menu-item index="/user/resetPassword">
                  <el-icon>
                      <EditPen />
                  </el-icon>
                  <span>修改密码</span>
              </el-menu-item>
              <el-menu-item index="/user/manage" v-if="userInfo.power==='SUPER_ADMIN'">
                  <el-icon>
                      <Star/>
                  </el-icon>
                  <span>用户管理</span>
              </el-menu-item>
          </el-sub-menu>

      </el-menu>
    </el-aside>
    <el-container>
        <el-header>
          <div style="font-size: 20px">欢迎您：<strong style="color: #ae1717">{{ userInfoStore.info.username }}</strong>  !</div>
          <!-- 下拉菜单 -->
          <!-- command: 条目被点击后会触发,在事件函数上可以声明一个参数,接收条目对应的指令 -->
          <div>
              <el-badge :value="unread" :offset="[-20, 5]" :show-zero="false">
                  <el-button circle :icon="Bell" @click="showDialog"  style="width: 40px;height: 40px;margin-right: 20px">

                  </el-button>
              </el-badge>

              <el-dropdown placement="bottom-end" @command="handleCommand">
                    <span class="el-dropdown__box">
                        <el-avatar :src="userInfoStore.info.url? userInfoStore.info.url:avatar" />
                        <el-icon>
                            <CaretBottom />
                        </el-icon>
                    </span>
                  <template #dropdown>
                      <el-dropdown-menu>
                          <el-dropdown-item command="info" :icon="User">基本资料</el-dropdown-item>
                          <el-dropdown-item command="avatar" :icon="Crop">更换头像</el-dropdown-item>
                          <el-dropdown-item command="resetPassword" :icon="EditPen">修改密码</el-dropdown-item>
                          <el-dropdown-item command="logout" :icon="SwitchButton">退出登录</el-dropdown-item>
                      </el-dropdown-menu>
                  </template>
              </el-dropdown>
          </div>

        </el-header>
        <el-main>
        <router-view></router-view>
        </el-main>
        <el-footer>
          2025©github.com/yfsun2
            <el-link href="https://beian.miit.gov.cn/" type="primary" target="_blank" :underline="false">
                皖ICP备2025074952号-1
            </el-link>
        </el-footer>

        <el-dialog v-model="dialogVisible" title="消息列表" width="60%" style="height: 500px;">
            <el-input placeholder="关键词搜索" v-model="search" @input="listMessage" style="width: 50%;"></el-input>
            <div v-if="messageList.length" style="height: 350px;overflow: auto">
                <div v-for="row in messageList" @click="setRead(row.id)" :class="row.status===0?'is_select':'unselect'">
                    <el-text size="large" style="color: black">
                        {{row.content}}
                    </el-text>
                    <p style="text-align: right">
                        <el-text type="info">
                            {{row.updateTime}}
                        </el-text>
                    </p>
                    <el-divider border-style="dotted" style="margin: 0"/>
                </div>
            </div>

            <div v-else>
                <ElEmpty description="没有数据" />
            </div>
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="dialogVisible = false">关闭</el-button>
                    <el-button type="primary" @click="allRead()"> 全部已读 </el-button>
                </span>
            </template>
        </el-dialog>
    </el-container>
    </el-container>
</template>

<style lang="scss" scoped>

.is_select{
  background-color: #f6f6f6;
}
.is_select:hover{
  background-color: #f6f6f6;
}
.unselect{
    background-color: white;
}
.unselect:hover{
    background-color:  #f6f6f6;
}
.layout-container {
  height: 100vh;

  .el-aside {
    background-color: #232323;

    &__logo {
      height: 120px;
      background: url('@/assets/logo.svg') no-repeat center / 80px auto;
    }

    .el-menu {
      border-right: none;
    }
  }

  .el-header {
    background-color: #fff;
    display: flex;
    align-items: center;
    justify-content: space-between;

    .el-dropdown__box {
      display: flex;
      align-items: center;

      .el-icon {
        color: #999;
        margin-left: 10px;
      }

      &:active,
      &:focus {
        outline: none;
      }
    }
  }

  .el-footer {
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
    color: #666;
  }
}
</style>
