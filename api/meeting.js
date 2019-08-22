import request from '@/utils/request'

export default {
  myApplyMeeting(params) {  // 我申会议纪要列表
    return request.post('/rest/meetingsummary/myApplyMeeting', params)
  },
  addMeetingApply(params) {  // 创建会议纪要申请
    return request.post('/rest/meetingsummary/addMeetingApply', params)
  },
  updateMeetingApply(params) {  // 修改会议纪要申请
    return request.post('/rest/meetingsummary/updateMeetingApply', params)
  },
  getMytask(params) {
    return request.post('/rest/command/waitHandle', params)
  },
  // 查询所有
  meetingList(params) {
    return request.post('/rest/change/meetingList', params)
  },
  meetingDetails(param) {
    return request.post('/rest/meetingsummary/meetingDetails', param)
  },
  // 搜索会议纪要详情
  searchMeetingDetails(param) {
    return request.post('/rest/meetingsummary/searchMeetingDetails', param)
  }
}
