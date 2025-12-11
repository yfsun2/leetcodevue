import request from '@/utils/request.js'

export const uploadFile=(params)=>{
    return request.post('/file/upload',params);
}
