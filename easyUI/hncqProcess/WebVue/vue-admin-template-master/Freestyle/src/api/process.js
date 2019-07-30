import request from '@/utils/request'

export default {
  // 查询验收人
  getCheckPerson(data) {
    return request.post('/rest/command/getCommandPerson', data)
  },
  // 查询图片信息
  getPictureDetail(data) {
    return request.post('/rest/processCheck/getPictureDetail', data)
  },
  getUsersByDepartId(data){  //根据组织机构获取未删除的用户
    return request.post('/rest/processCheck/notDeletedUser', data)
  }
}


