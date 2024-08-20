<script setup>
import {
    Management,
    Promotion,
    User,
    EditPen,
} from '@element-plus/icons-vue'
import {platformListService} from "@/api/platform.js";
import {useRouter} from 'vue-router'
import {ref} from 'vue'

const router = useRouter();

const platformList=ref([])

const getPlatformList = async () => {
    let params={
        search:""
    };
    let res=await platformListService(params);
    platformList.value=res.data;
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
            <User />
          </el-icon>
          <span>题单管理</span>
        </el-menu-item>
      </el-menu>
    </el-aside>
    <el-container>
      <el-header>
        力扣
      </el-header>
      <el-main>
        <router-view></router-view>
      </el-main>
      <el-footer>
        力扣
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
