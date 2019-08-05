import request from '@/utils/request'

export default {
  getUserMessage(params) {
    return request.get('/rest/homePage/getUserMessage', {params})
  },
  getPicMessage(params) {
    return request.get('/rest/homePage/getPicMessage', {params})
  },
  getOrgNumber(params) {
    return request.get('/rest/homePage/getOrgNumber', {params})
  },
  getMytask(params) {
    return request.post('/rest/command/waitHandle', {params})
  }
}



