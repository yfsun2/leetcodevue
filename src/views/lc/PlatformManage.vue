<script setup>
import {Edit, Delete} from '@element-plus/icons-vue'
import {onMounted, ref} from 'vue'
import { platformListService,addPlatformService ,deletePlatformService,updatePlatformService} from '@/api/platform.js'
import {ElMessage,ElMessageBox} from 'element-plus'

import {useTokenStore} from '@/stores/token.js'
const tokenStore = useTokenStore();

import useUserInfoStore from '@/stores/userInfo.js'
import avatar from "@/assets/default.png";
const userInfoStore = useUserInfoStore();

const userInfo = ref({...userInfoStore.info})

//模糊查询词
const search =ref('')

//table要用的列表
const platformList=ref([])

//定义变量,控制标题的展示
const title = ref('')

//控制添加分类弹窗
const dialogVisible = ref(false)

//展示编辑弹窗
const showDialog = (row) => {
    dialogVisible.value = true;
    title.value = '编辑平台'
    //数据拷贝
    platformModel.value.name = row.name;
    platformModel.value.questionCount=row.questionCount;
    platformModel.value.logo=row.logo;
    //扩展id属性,将来需要传递给后台,完成分类的修改
    platformModel.value.id = row.id
}

//表单模型
const platformModel = ref({
    id:0,
    name: '',
    questionCount:0,
    logo:''
})

//模糊查询
const onSearch = async(val) => {
    let params = {
        search: search.value ? search.value : val,
    }
    await platformListService(params).then(result=>{
        //渲染视图
        platformList.value = result.data;
    }).catch(err=>{
        console.log(err)
    })
}

onMounted(()=>{
    onSearch();
})

const onAddPlatform=async()=>{
    let params = {
        name:platformModel.value.name,
        questionCount:platformModel.value.questionCount,
    }

   await addPlatformService(params).then(result=>{
       ElMessage.success(result.msg? result.msg:'添加成功');

       dialogVisible.value = false;

       //刷新当前列表
        onSearch()
   }).catch(err=>{
       console.log(err)
   })

}

//编辑分类
const updatePlatform = async () => {

    let params={
        id:platformModel.value.id,
        name:platformModel.value.name,
        questionCount:platformModel.value.questionCount,
        logo:platformModel.value.logo
    }
    //调用接口
    await updatePlatformService(params).then(result=>{
        ElMessage.success(result.msg ? result.msg : '修改成功')

        //调用获取所有分类的函数
         onSearch()

        //隐藏弹窗
        dialogVisible.value = false;
    }).catch(err=>{
        console.log(err)
    })
}

//清空模型的数据
const clearData = () => {
    platformModel.value.id=0;
    platformModel.value.name = '';
    platformModel.value.logo='';
}

//删除分类
const deletePlatform = (row) => {
    //提示用户  确认框
    ElMessageBox.confirm(
        '你确认要删除该平台吗?',
        '温馨提示',
        {
            confirmButtonText: '确认',
            cancelButtonText: '取消',
            type: 'warning',
        }
    ).then(async () => {
        //调用接口
        await deletePlatformService(row.id).then(()=>{
            ElMessage.success('删除成功');
            //刷新列表
            onSearch();
        }).catch(err=>console.log(err))
    }).catch(() => {
        ElMessage.info('用户取消了删除')
    })
}

//图片上传成功的回调函数
const uploadSuccess = (result)=>{
    platformModel.value.logo = result.data.fileUrl;
}

</script>

<template>
    <el-card class="page-container">
        <template #header>
            <div class="header">
                <span>平台管理</span>
                <!-- 搜索表单 -->
                <el-form inline style="max-height: 28px">
                    <el-form-item label="名称：">
                        <el-input  placeholder="名称" v-model="search" @input="onSearch"/>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="onSearch">搜索</el-button>
                        <el-button @click="search = '';">重置</el-button>
                    </el-form-item>
                </el-form>
                <div class="extra">
                    <el-button type="primary" @click="dialogVisible = true;title = '添加平台';clearData()">添加平台</el-button>
                </div>
            </div>
        </template>

        <!-- 类型列表 -->
        <el-table :data="platformList" style="width: 100%">
            <el-table-column label="平台名称" prop="name" align="center"></el-table-column>
            <el-table-column label="竞赛题目数" prop="questionCount" align="center"></el-table-column>
            <el-table-column label="平台logo" align="center">
                <template #default="{row}" >
                    <img v-if="row.logo" :src="row.logo" style="width: 20px"/>
                    <img v-else :src="avatar" width="20px" />
                </template>
            </el-table-column>
            <el-table-column label="上次修改时间" prop="updateTime" align="center"> </el-table-column>
            <el-table-column label="操作" width="100">
                <template #default="{ row }">
                    <el-button :icon="Edit" circle plain type="primary" @click="showDialog(row)"></el-button>
                    <el-button :icon="Delete" circle plain type="danger" @click="deletePlatform(row)"></el-button>
                </template>
            </el-table-column>
            <template #empty>
                <el-empty description="没有数据" />
            </template>
        </el-table>

        <!-- 添加分类弹窗 -->
        <el-dialog v-model="dialogVisible" :title="title" width="30%">
            <el-form :model="platformModel" label-width="100px" style="padding-right: 30px">
                <el-form-item label="平台名称" prop="name">
                    <el-input v-model="platformModel.name" minlength="1"></el-input>
                </el-form-item>
                <el-form-item label="竞赛题目数量" prop="questionCount">
                    <el-input-number v-model="platformModel.questionCount" :min="4" :max="10"></el-input-number>
                </el-form-item>
                <el-form-item label="平台logo">
                    <el-upload
                        ref="uploadRef"
                        class="avatar-uploader"
                        :show-file-list="false"
                        :auto-upload="true"
                        action="/api/file/upload"
                        name="file"
                        :headers="{'Authorization':tokenStore.token}"
                        :on-success="uploadSuccess"
                    >
                        <img v-if="platformModel.logo" :src="platformModel.logo" class="avatar" />
                        <img v-else :src="avatar" width="50" />
                    </el-upload>
                </el-form-item>

            </el-form>
            <template #footer>
                    <span class="dialog-footer">
                        <el-button @click="dialogVisible = false">取消</el-button>
                        <el-button type="primary" @click="title === '添加平台' ? onAddPlatform() : updatePlatform()"> 确认 </el-button>
                    </span>
            </template>
        </el-dialog>
    </el-card>
</template>

<style lang="scss" scoped>

.avatar {
    width: 50px;
    height: 50px;
    display: block;
}
.page-container {
    min-height: 100%;
    box-sizing: border-box;
    .header {
        display: flex;
        align-items: center;
        justify-content: space-between;
    }
}
</style>
