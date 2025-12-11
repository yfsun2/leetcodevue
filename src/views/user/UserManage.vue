<script setup>

import {CircleClose, Close, Delete, Edit, Message} from "@element-plus/icons-vue";
import {ref} from 'vue'
import { updateUserInfoService,listUserService} from '@/api/user.js'
import {ElMessage,ElMessageBox} from 'element-plus'
import useUserInfoStore from '@/stores/userInfo.js'
import avatar from "@/assets/default.png";
import {sendAllService, sendService} from "@/api/message.js";
const userInfoStore = useUserInfoStore();

const userInfo = ref({...userInfoStore.info})

//模糊查询词
const search =ref('')

//table要用的列表
const userList=ref([])

//控制弹窗
const dialogVisible = ref(false)
const dlgVisible = ref(false)
const messageContent = ref('')
const receiveId = ref('')

//展示编辑弹窗
const showDialog = (row) => {
    dialogVisible.value = true;
    //数据拷贝
    userModel.value.username = row.username;
    userModel.value.email = row.email;
    userModel.value.power= row.power;
    userModel.value.url= row.url;
    //扩展id属性,将来需要传递给后台,完成修改
    userModel.value.id = row.id
}

//表单模型
const userModel = ref({
    id:0,
    username: '',
    email:'',
    power:'',
    url:'',
})

//模糊查询
const onSearch = async(val) => {
    let params = {
        search: search.value ? search.value : val,
    }
    await listUserService(params).then(result=>{
        //渲染视图
        userList.value = result.data;
    }).catch(err=>{
        console.log(err)
    })
}

onSearch();

//编辑分类
const updateUser = async () => {
    //调用接口
    let result = await updateUserInfoService(userModel.value);
    ElMessage.success(result.msg ? result.msg : '修改成功')
    //调用获取所有分类的函数
    await onSearch()
    //隐藏弹窗
    dialogVisible.value = false;
}

const isMultiple = ref(false)

const sendMessage = (row) => {
    dlgVisible.value = true;
    isMultiple.value = false;
    receiveId.value = row.id
}

const okClick = async () => {
    if(isMultiple.value){
        await sendAllService({content: messageContent.value}).then(res=>{
            ElMessage.success('发送成功')
            dlgVisible.value = false;
        }).catch(err=>{
            console.log(err)
        })
    }else{
        let params = {
            receiveId: receiveId.value,
            content: messageContent.value
        }
        await sendService(params).then(res=>{
            ElMessage.success('发送成功')
            dlgVisible.value = false;
        }).catch(err=>{
            console.log(err)
        })
    }

}

</script>

<template>
    <el-card class="page-container">
        <template #header>
            <div class="header">
                <span>用户管理</span>
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
                <el-button :icon="Message" type="success" @click="dlgVisible=true;isMultiple=true">
                    发送全体消息
                </el-button>
            </div>
        </template>

        <!-- 用户列表 -->
        <el-table :data="userList" max-height="380" style="width: 100%">
            <el-table-column label="用户Id" prop="id" align="center"></el-table-column>
            <el-table-column label="用户名" prop="username" align="center"></el-table-column>
            <el-table-column label="邮箱" prop="email" align="center"></el-table-column>
            <el-table-column label="状态" align="center">
                <template #default="{row}">
                    <el-tag v-if="row.power==='SUPER_ADMIN'" type="primary">超级管理员</el-tag>
                    <el-tag v-else-if="row.power==='USER'" type="success">用户正常</el-tag>
                    <el-tag v-else-if="row.power==='ADMIN'" type="warning">管理员</el-tag>
                    <el-tag v-else type="danger">用户被封禁</el-tag>
                </template>
            </el-table-column>
            <el-table-column label="头像"  align="center">
                <template #default="{row}" >
                    <img v-if="row.url" :src="row.url" style="width: 20px"/>
                    <img v-else :src="avatar" width="20px" />
                </template>
            </el-table-column>
            <el-table-column label="创建时间" prop="createTime" align="center"> </el-table-column>
            <el-table-column label="更新时间" prop="updateTime" align="center"> </el-table-column>
            <el-table-column label="操作" width="100" >
                <template #default="{ row }">
                    <el-button :icon="Edit" circle plain type="primary" @click="showDialog(row)" ></el-button>
                    <el-button :icon="Message" circle plain type="success" @click="sendMessage(row)" ></el-button>
                </template>
            </el-table-column>
            <template #empty>
                <el-empty description="没有数据" />
            </template>
        </el-table>
        <!-- 更新弹窗 -->
        <el-dialog v-model="dialogVisible" title="更新用户" width="30%">
            <el-form :model="userModel"  label-width="100px" style="padding-right: 30px">
                <el-form-item label="用户名" prop="username">
                    <el-input v-model="userModel.username"></el-input>
                </el-form-item>
                <el-form-item label="用户邮箱" prop="email">
                    <el-input v-model="userModel.email"></el-input>
                </el-form-item>
                <el-form-item label="用户状态" prop="power">
                    <el-select v-model="userModel.power">
                        <el-option value="1" label="普通用户">普通用户</el-option>
                        <el-option value="2" label="管理员">管理员</el-option>
                        <el-option value="3" label="封禁">封禁</el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="用户头像" prop="url">
                    <img v-if="userModel.url" :src="userModel.url" style="width: 20px"/>
                    <img v-else :src="avatar" width="20px" />
                </el-form-item>
            </el-form>
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="dialogVisible = false">取消</el-button>
                    <el-button type="primary" @click="updateUser"> 确认 </el-button>
                </span>
            </template>
        </el-dialog>
        <el-dialog v-model="dlgVisible" title="发送消息" width="50%">
            <el-form>
                <el-form-item label="消息内容">
                    <el-input type="textarea" v-model="messageContent" placeholder="请输入消息内容"></el-input>
                </el-form-item>
            </el-form>
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="dlgVisible = false">取消</el-button>
                    <el-button type="primary" @click="okClick"> 确认 </el-button>
                </span>
            </template>
        </el-dialog>
    </el-card>
</template>

<style scoped lang="scss">
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
