import request from '@/utils/request'

export default {
  // 列表
  roleList() {
    return request.post('/rest/role/getList')
  },
  //角色新增
  roleAdd(data) {
    return request.post('/rest/role/add', data)
  },
  // 删除
  roleDelete(id) {
    return request.get(`/rest/role/delete/${id}`)
  },
  //通过角色id获取PC端资源
  getResourceByRoleId(data){
    return request.post('/rest/role/functionList', data)
  },
  //根据筛选条件查询角色
  getRoleByName(data){
    return request.post('/rest/role/chakan', data)
  },
  //根据角色设置访问资源
  setRoleRelFunction(data){
    return request.post('/rest/role/updataFunction', data)
  },
  //角色关联资源的内容
  getFunctionByRoleId(data){
    return request.post('/rest/role/getFunctionByRoleId', data)
  }
}


