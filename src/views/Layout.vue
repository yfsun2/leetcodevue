<script setup>
import {
    Management,
    Promotion,
    User,
    EditPen, CaretBottom, Crop, SwitchButton, UserFilled, Star,
} from '@element-plus/icons-vue'
import {platformListService} from "@/api/platform.js";
import {useRouter} from 'vue-router'
import {ref} from 'vue'

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
        userInfoStore.setInfo(result.data);
    }).catch(err=>{
        console.log(err)
    })
}

getUserInfo();
const router = useRouter();
//条目被点击后,调用的函数

import {ElMessage,ElMessageBox} from 'element-plus'
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

                //2.跳转到登录页面
                router.push('/login')
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

getPlatformList()


</script>

<template>
  <el-container class="layout-container">
    <el-aside width="200px">
      <div class="el-aside__logo"></div>
      <el-menu active-text-color="#ffd04b" background-color="#232323"  text-color="#fff"
      :router>
          <el-sub-menu index="1">
              <template #title>
                  <el-icon>
                      <EditPen />
                  </el-icon>
                  <span>种类管理</span>
              </template>
              <el-menu-item index="/type">
                  <el-icon>
                      <EditPen />
                  </el-icon>
                  <span>类型管理</span>
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
              <el-menu-item v-for="(item,index) in platformList" :key="index" :index="'/question/'+item.id">
                  <el-icon>
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
              <el-menu-item v-for="(item,index) in platformList" :key="index" :index="'/contest/'+item.id">
                  <el-icon>
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
                  <span>重置密码</span>
              </el-menu-item>
          </el-sub-menu>

      </el-menu>
    </el-aside>
    <el-container>
      <el-header>
          <div style="font-size: 20px">欢迎您：<strong style="color: #ae1717">{{ userInfoStore.info.username }}</strong>  !</div>
          <!-- 下拉菜单 -->
          <!-- command: 条目被点击后会触发,在事件函数上可以声明一个参数,接收条目对应的指令 -->
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
                      <el-dropdown-item command="resetPassword" :icon="EditPen">重置密码</el-dropdown-item>
                      <el-dropdown-item command="logout" :icon="SwitchButton">退出登录</el-dropdown-item>
                  </el-dropdown-menu>
              </template>
          </el-dropdown>
      </el-header>
      <el-main>
        <router-view></router-view>
      </el-main>
      <el-footer>
          2024©github.com/yfsun2
      </el-footer>
    </el-container>
  </el-container>
</template>

<style lang="scss" scoped>
.layout-container {
  height: 100vh;

  .el-aside {
    background-color: #232323;

    &__logo {
      height: 120px;
      background: url('@/assets/logo.png') no-repeat center / 60px auto;
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
