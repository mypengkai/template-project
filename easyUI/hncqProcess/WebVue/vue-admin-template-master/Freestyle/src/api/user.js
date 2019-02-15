import request from '@/utils/request'

export default {
    // 新增
    userAdd(data) {
        return request.post('/rest/user', data)
    },
    // 列表 
    getUser(params) {
        return request.get('/rest/user', {params})
    },
    // 删除
    userDelete(id) {
        return request.get(`/rest/user/${id}`)
    },
    // 查询
    userCheck(id) {
        return request.post(`/rest/user/${id}`)
    }
}


