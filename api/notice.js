import request from '@/utils/request'

export default {
  // 查询通知列表
  getList(data) {
    return request.post('/rest/notice/noticeList', data)
  },
  // 新增通知
  createNotice(data) {
    return request.post('/rest/notice/createNotice', data)
  },
  // 查看通知详情
  getNoticeDetail(data) {
    return request.post('/rest/notice/noticeQuery', data)
  },
  // 查询通知用户
  getUser(data) {
    return request.post('/rest/processCheck/notDeletedUser', data)
  },
  // 查询用户
  getListByUser(data) {
    return request.post('/rest/sysuser/getListByUser', data)
  }
}


