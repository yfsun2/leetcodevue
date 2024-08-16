import request from '@/utils/request.js'

export const contestPageService=(params)=>{
    return request.get('/contest/page',{params:params});
}

export const contestListService=()=>{
    return request.get('/contest/list');
}

export const addContestService=(data)=>{
    return request.post('/contest/add',data)
}

export const updateContestService=(data)=>{
    return request.post('/contest/update',data)
}

export const deleteContestService=(id)=>{
    return request.delete('/contest/delete/'+id)
}
