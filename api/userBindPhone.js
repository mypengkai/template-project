/**
 *  用户绑定手机
**/
import request from '@/utils/request'

export default {
  // 用户绑定手机
  addUserMobileBind(data) {
    return request.post('/rest/mobilebind/add', data)
  },
  // 查询手机和用户绑定
  userBindMobileList(data) {
    return request.post('/rest/mobilebind/userList', data)
  },
  //根据用户id得到这个绑定信息
  getdBindMobileByUserId(data){
    return request.post('/rest/mobilebind/userQuery', data)
  }
}
