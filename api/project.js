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
    return request.post(`/rest/projectItemInfo/getProjectItemById/${id}`)
  },
  // 批量导入
  projectaddbyList(id) {
    return request.post(`/rest/projectItemInfo/addbyList/${id}`)
  },
  getProjectItemFromLayer(data){  //异步获取组织机构
    return request.post('/rest/projectItemInfo/getProjectBQItemById', data)
  }
}
