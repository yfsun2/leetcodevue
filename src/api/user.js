//导入request.js请求工具
import request from '@/utils/request.js'

export const sendMail=(email)=>{
    let params={
        email:email
    }
    return request.get('/user/sendMail',{params:params})
}

//提供调用注册接口的函数
export const userRegisterService = (registerData)=>{
    return request.post('/user/register',registerData);
}

//提供调用登录接口的函数
export const userLoginService = (loginData)=>{
    return request.post('/user/login',loginData)
}

//获取用户详细信息
export const userInfoService = ()=>{
    return request.get('/user/userinfo')
}

//修改个人信息
export const userInfoUpdateService = (userInfoData)=>{
   return request.put('/user/update',userInfoData)
}

//修改头像
export const userAvatarUpdateService = (avatarUrl)=>{
    let params={
       avatarUrl:avatarUrl
    }
    return request.get('/user/updateAvatar',{params:params})
}
