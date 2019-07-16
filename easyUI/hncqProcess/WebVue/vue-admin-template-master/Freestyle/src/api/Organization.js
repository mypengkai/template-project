import request from '@/utils/request'

export default {
  //  组织机构树
  organizateTree(params) {
    return request.get('/rest/organizate/depart', { params })
  },
}


