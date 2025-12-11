import request from "@/utils/request.js";

export const addSolutionService=(params)=>{
    return request.post('/solution/add',params)
}

export const queryListSolutionService=(params)=>{
    return request.get('/solution/list',{params:params});
}

export const updateSolutionService=(params)=>{
    return request.post('/solution/update',params)
}

export const deleteSolutionService=(id)=>{
    return request.delete('/solution/delete/'+id)
}

export const queryIdSolutionService=(id)=>{
    return request.get('/solution/queryId/'+id)
}
