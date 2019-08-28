import request from '@/utils/request'

export default {
  // 查统一回复查询不分页
  searchUnifiedApply(data) {
    return request.post('/rest/Unified/searchUnifiedApply', data)
  },
  // 新增
  addUnifiedApply(data) {
    return request.post('/rest/Unified/addUnifiedApply', data)
  },
  // 删除
  deleteUnifiedApply(data) {
    return request.post('/rest/Unified/deleteUnifiedApply', data)
  },
  // 查统一回复查询分页
  searchUnifiedApplyPage(data) {
    return request.post('/rest/Unified/searchUnifiedApplyPage', data)
  }
}


