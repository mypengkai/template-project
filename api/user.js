import request from '@/utils/request'

export default {
    // 新增
    sysuserAdd(data) {
        return request.post('/rest/sysuser/add', data)
    },
    // 列表 
    sysuserList(data) {
        return request.post('/rest/sysuser/getList', data)
    },
    // 删除
    sysuserDelete(id) {
        return request.get(`/rest/sysuser/delete/${id}`)
    },
    // 查询
    sysuserCheck(id) {
        return request.post(`/rest/sysuser/chakan/${id}`)
    }
}


