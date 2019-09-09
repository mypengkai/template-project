import request from '@/utils/request'

export default {
  // 指令查询列表
  getList(data) {
    return request.post('/rest/command/getList', data)
  },
  // 我发出的指令
  myCommandPerson(data) {
    return request.post('/rest/command/myCommandPerson', data)
  },
  // 我收到的指令
  myCommandReceive(data) {
    return request.post('/rest/command/myCommandReceive', data)
  },
  // 指令退回
  returnCommand(data) {
    return request.post('/rest/command/returnCommandPC', data)
  },
  // 指令复核
  finishCommand(data) {
    return request.post('/rest/command/finishCommandPC', data)
  },
  // 指令完成
  soonFinishCommand(data) {
    return request.post('/rest/command/soonFinishCommandPC', data)
  },
  // 指令详情
  searchOne(data) {
    return request.post('/rest/command/searchOne', data)
  },
  //修改
  modifyCommand(data) {
    return request.post('/rest/command/modifyCommandPC', data)
  },
  // 发送指令
  addCommand(data) {
    return request.post('/rest/command/addCommand', data)
  },
  // 转发指令
  InstructionCommand(data) {
    return request.post('/rest/command/InstructionCommand', data)
  },
  //文件上传
  uploadFile(data){
    return request.post("/rest/command/videoOrImageUpload",data)
  }
}


