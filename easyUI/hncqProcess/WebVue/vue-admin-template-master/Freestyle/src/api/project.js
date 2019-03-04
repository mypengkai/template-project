import request from '@/utils/request'

export default {
    // 新增
    projectAdd(data) {
        return request.post('/rest/projectItemInfo/projectadd', data)
    },
    // 列表 
    projectList(data) {
        return request.post('/rest/projectItemInfo/getList', data)
    },
    // 删除
    projectDelete(id) {
        return request.get(`/rest/projectItemInfo/delete/${id}`)
    },
    // 查询
    projectCheck(id) {
        return request.post(`/rest/projectItemInfo/chakan/${id}`)
    },
    // 批量导入
    projectaddbyList(id) {
        return request.post(`/rest/projectItemInfo/addbyList/${id}`)
    }
}

// export function getUser(params) {
//   return request.get('/rest/user', {params})
// }


