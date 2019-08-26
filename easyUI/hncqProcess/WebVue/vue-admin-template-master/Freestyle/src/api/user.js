import request from '@/utils/request'

export default {
  // 新增
  sysuserAdd(data) {
    return request.post('/rest/sysuser/add', data)
  },
  // 修改
  sysusermodify(data) {
    return request.post('/rest/sysuser/modify', data)
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
  sysuserCheck(data) {
    return request.post('/rest/sysuser/chakan', data)
  },
  // 巡检查询
  getListByUser(data) {
    return request.post('/rest/sysuser/getListByUser', data)
  },
  getUserListByDepartId(data){  //根据组织机构获取没有得到的用户
    return request.post('/rest/processCheck/notDeletedUser', data)
  },
  getNextJobUserByCurrentId(data){  //根据当前用户获取下一级审核人
    return request.post('/rest/change/NextJobUser', data)
  },
  // 下一级审核人
  getNextmeetUser(data){
     return request.post("/rest/meetingsummary/NextJobUser",data)
  }
}


