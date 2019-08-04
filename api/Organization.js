import request from '@/utils/request'

export default {
  //  组织机构树
  organizateTree(params) {
    return request.get('/rest/organizate/depart', { params })
  },
  asynchronousGetDepartTree(params){   //异步获取组织机构树
    return request.get('/rest/sysuser/departTree/'+params)
  }
}


