import request from '@/utils/request.js'

export const platformListService=(params)=>{
    return request.get('/platform/list',{params:params});
}

export const addPlatformService=(data)=>{
    return request.post('/platform/add',data)
}

export const updatePlatformService=(data)=>{
    return request.post('/platform/update',data)
}

export const deletePlatformService=(id)=>{
    return request.delete('/platform/delete/'+id)
}

export const queryByIdService=(params)=>{
    return request.get('/platform/queryById',{params:params});
}
