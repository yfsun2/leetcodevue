import request from '@/utils/request.js'

export const labelPageService=(params)=>{
    return request.get('/label/page',{params:params});
}

export const labelListService=(params)=>{
    return request.get('/label/list',{params:params});
}

export const addLabelService=(data)=>{
    return request.post('/label/add',data)
}

export const updateLabelService=(data)=>{
    return request.post('/label/update',data)
}

export const deleteLabelService=(id)=>{
    return request.delete('/label/delete/'+id)
}
