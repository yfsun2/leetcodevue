import request from '@/utils/request.js'

export const questionPageService=(params)=>{
    return request.get('/question/page',{params:params});
}

export const questionListService=(params)=>{
    return request.get('/question/list',{params:params});
}

export const addQuestionService=(data)=>{
    return request.post('/question/add',data)
}

export const updateQuestionService=(data)=>{
    return request.post('/question/update',data)
}

export const updateQuestionState=(params)=>{
    return request.get('/question/updateState',{params:params});
}

export const deleteQuestionService=(id)=>{
    return request.delete('/question/delete/'+id)
}
