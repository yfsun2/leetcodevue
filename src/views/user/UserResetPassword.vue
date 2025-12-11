<script setup>
import { ref } from 'vue'
import {useRouter} from "vue-router";
import useUserInfoStore from '@/stores/userInfo.js'
import {updatePasswordService} from '@/api/user.js'
import {ElMessage} from 'element-plus'

const userInfoStore = useUserInfoStore();

const userInfo = ref({...userInfoStore.info})

const form =ref()

const router = useRouter();

const passwordModel=ref({
    oldPassword:'',
    password:'',
    rePassword: '',
})

//校验密码的函数
const checkRePassword = (rule, value, callback) => {
    if (value === '') {
        callback(new Error('请再次确认密码'))
    } else if (value !== passwordModel.value.password) {
        callback(new Error('请确保两次输入的密码一样'))
    } else {
        callback()
    }
}

//定义表单校验规则
const rules = {
    oldPassword: [
        { required: true, message: '请输入旧密码', trigger: 'blur' },
        // { min: 2, max: 16, message: '长度为2~16位非空字符', trigger: 'blur' }
    ],
    password: [
        { required: true, message: '请输入新密码', trigger: 'blur' },
        // { min: 2, max: 16, message: '长度为2~16位非空字符', trigger: 'blur' }
    ],
    rePassword: [
        { required: true, message: '请再次确认密码', trigger: 'blur' },
        { validator: checkRePassword, trigger: 'blur' }
    ]
}

//修改个人密码


const updatePassword =  ()=>{
        form.value.validate((valid) => {
        if (valid) {
            //调用接口
             updatePasswordService(passwordModel.value.oldPassword, passwordModel.value.password).then(res=>{
                ElMessage.success(res.msg ? res.msg : '修改成功');
                router.push('/login')
            }).catch(err=>{
                // ElMessage.error(err.msg);
            })
        } else {
            ElMessage.error('表单无效');
        }
    })
}


</script>
<template>
    <el-card class="page-container">
        <template #header>
            <div class="header">
                <span>修改密码</span>
            </div>
        </template>
        <el-row>
            <el-col :span="12">
                <el-form ref="form" :model="passwordModel" :rules="rules" label-width="100px" size="large">
                    <el-form-item label="旧密码" prop="oldPassword">
                        <el-input type="password" v-model="passwordModel.oldPassword" ></el-input>
                    </el-form-item>
                    <el-form-item label="新密码" prop="password">
                        <el-input type="password" v-model="passwordModel.password" ></el-input>
                    </el-form-item>
                    <el-form-item label="再次输入新密码" prop="rePassword">
                        <el-input type="password" v-model="passwordModel.rePassword" ></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="updatePassword" >提交修改</el-button>
                    </el-form-item>
                </el-form>
            </el-col>
        </el-row>
    </el-card>
</template>
