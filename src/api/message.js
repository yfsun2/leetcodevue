import request from '@/utils/request.js'

export const listService=(params)=>{
    return request.get('/message/list',{params:params});
}


export const unReadService=()=>{
    return request.get('/message/unread');
}


export const sendService=(params)=>{
    return request.get('/message/send',{params:params});
}

export const sendAllService=(params)=>{
    return request.get('/message/sendAll',{params:params});
}

export const setReadService=(id)=>{
    return request.get('/message/setRead/'+id);
}

export const setAllReadService=()=>{
    return request.get('/message/setAllRead');
}

export const deleteService=(id)=>{
    return request.delete('/message/delete/'+id);
}
