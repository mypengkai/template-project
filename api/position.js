import request from '@/utils/request'

export default {
  // 新增岗位
  positionAdd(data) {
    return request.post('/rest/job/add', data)
  },
  // 列表
  positionPageList(data) {
    return request.post('/rest/job/getPageList', data)
  },
  // 删除
  postionDeleteById(id) {
    return request.get(`/rest/job/del/${id}`)
  },
  // 查询
  getList(data) {
    return request.post('/rest/job/getList', data)
  },
  getPositionById(data){
    return request.get(`/rest/job/getPositionById/${data}`);
  }
}
