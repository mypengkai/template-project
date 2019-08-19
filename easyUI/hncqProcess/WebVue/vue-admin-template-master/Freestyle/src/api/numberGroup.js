import request from '@/utils/request'

export default {
  // 列表
  numberGroupList(data) {
    return request.post('/rest/NumberGroup/getPageList', data)
  },
  // 新增/修改
  addNumberGroup(data) {
    return request.post('/rest/NumberGroup/addgroup', data)
  },
  // 删除
  delNumberGroup(id) {
    return request.get(`/rest/NumberGroup/del/${id}`)
  }
/*
  // 查
  getSmsRechargeById(id) {
    return request.get(`/rest/NumberGroup/getSmsRechargeById/${id}`)
  }
*/

}


