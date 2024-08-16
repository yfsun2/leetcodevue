import request from '@/utils/request.js'

export const getTypeListByTopicService=(topicId)=>{
    return request.get('/topic-question/list/'+topicId);
}

export const getQuestionPageByTopicAndTypeService=(params)=>{
    return request.get('/topic-question/page',{params:params});
}

export const addTopicQuestionService=(data)=>{
    return request.post('/topic-question/add',data)
}

export const updateTopicQuestionService=(data)=>{
    return request.post('/topic-question/update',data)
}

export const deleteTopicQuestionService=(id)=>{
    return request.delete('/topic-question/delete/'+id)
}
