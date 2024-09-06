import request from '@/utils/request.js'

export const topicListService=(params)=>{
    return request.get('/topic/list',{params:params});
}

export const addTopicService=(data)=>{
    return request.post('/topic/add',data)
}

export const updateTopicService=(data)=>{
    return request.post('/topic/update',data)
}

export const deleteTopicService=(id)=>{
    return request.delete('/topic/delete/'+id)
}
