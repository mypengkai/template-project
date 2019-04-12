import request from '@/utils/request'
export default {
  depart(params) {
    return request.get('/rest/sync/depart', {
      params
    })
  },
  treeData(params) {
    return request.get('/rest/sync/depart/list', {
      params
    })
  },
  updateData(data) {
    return request.post('/rest/sync/depart/verify',data)
  },
}
