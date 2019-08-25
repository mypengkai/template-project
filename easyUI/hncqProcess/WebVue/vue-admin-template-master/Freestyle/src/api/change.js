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
  },
  //查询会议记要（全部）
  getChangeApplyList(data){
      return request.post("/rest/meetingsummary/meetingList",data)
  },
  //会议记要创建
  applyAddList(data){
    return request.post("/rest/meetingsummary/addMeetingApply",data)
  },
  // 我的会议记要
  applyMyList(data){
    return request.post("/rest/meetingsummary/examineList",data)
  },
  // 记要详情查看
  getApplySee(data){
    return request.post("/rest/meetingsummary/searchMeetingDetails",data)
  }
}
