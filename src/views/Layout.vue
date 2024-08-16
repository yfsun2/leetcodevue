<script setup>
import {
  Management,
  Promotion,
  UserFilled,
  User,
  Crop,
  EditPen,
  SwitchButton,
  CaretBottom
} from '@element-plus/icons-vue'


//条目被点击后,调用的函数
import {useRouter} from 'vue-router'
const router = useRouter();
</script>

<template>
  <el-container class="layout-container">
    <el-aside width="200px">
      <div class="el-aside__logo"></div>
      <el-menu active-text-color="#ffd04b" background-color="#232323"  text-color="#fff"
      :router>
        <el-menu-item index="/type">
          <el-icon>
            <EditPen />
          </el-icon>
          <span>类型管理</span>
        </el-menu-item>
        <el-menu-item index="/question">
          <el-icon>
            <Management />
          </el-icon>
          <span>问题管理</span>
        </el-menu-item>
        <el-menu-item index="/contest">
          <el-icon>
            <Promotion />
          </el-icon>
          <span>竞赛管理</span>
        </el-menu-item>
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
