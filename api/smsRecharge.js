import request from '@/utils/request'

export default {
  // 短信充值列表
  smsRechargeList(data) {
    return request.post('/rest/smsPay/datagrid', data)
  },
  //新增/修改短信充值
  saveOrUpdateSmsRecharge(data){
    return request.post('/rest/smsPay/saveOrUpdate', data)
  },
  // 删除
  smsRechargeDelete(id) {
    return request.get(`/rest/smsPay/delete/${id}`)
  },
  //查看短信充值
  getSmsRechargeById(id){
    return request.get(`/rest/smsPay/getSmsRechargeById/${id}`);
  },
  //查询历史短信记录
  getSmsInfoLogList(data){
    return request.post('/rest/smsInfo/datagrid', data)
  }
}


