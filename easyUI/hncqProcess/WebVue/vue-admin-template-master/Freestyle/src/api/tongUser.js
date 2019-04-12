import request from '@/utils/request'
export default {
  user(params) {
    return request.get('/rest/sync/user', {
      params
    })
  },
  userData(data) {
    return request.post('/rest/sync/user/list', data)
  },
  updateUserData(data) {
    return request.post('/rest/sync/user/add',data)
  },
}
