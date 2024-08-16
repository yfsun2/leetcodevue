import request from '@/utils/request.js'

export const typePageService=(params)=>{
    return request.get('/type/page',{params:params});
}

export const typeListService=(params)=>{
    return request.get('/type/list',{params:params});
}

export const addTypeService=(params)=>{
    return request.get('/type/add',{params:params})
}

export const updateTypeService=(data)=>{
    return request.post('/type/update',data)
}

export const deleteTypeService=(id)=>{
    return request.delete('/type/delete/'+id)
}
