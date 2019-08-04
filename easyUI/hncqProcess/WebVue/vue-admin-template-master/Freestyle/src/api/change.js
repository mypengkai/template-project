import request from '@/utils/request'

export default {
  myApplyChangeList(params) {  //我申请的变更列表
    return request.post('/rest/change/myApplychange', params)
  },
  createChangeApply(params) {  // 创建变更申请
    return request.post('/rest/change/addChangeApply', params)
  },
  updateChangeApply(params) {  //修改变更申请
    return request.post('/rest/change/updateChangeApply', params)
  },
  getMytask(params) {
    return request.post('/rest/command/waitHandle', params)
  },
  changeListByParam(params){  //查询所有
    return request.post('/rest/change/changeList', params)
  },
  getChangeDetailById(param){
    return request.post('/rest/change/searchChangeDetails', param)
  }
}
