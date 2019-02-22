import request from '@/utils/request'

export default {
    // 新增
    menuAdd(data) {
        return request.post('/rest/menu/add', data,)
    },
    // 列表 
    menuList(data) {
        return request.post('/rest/menu/getList', data)
    },
    // 删除
    menuDelete(id) {
        return request.get(`/rest/menu/delete/${id}`)
    },
    // 查询
    menuCheck(id) {
        return request.post(`/rest/menu/chakan/${id}`)
    }
}


