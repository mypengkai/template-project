import request from '@/utils/request'

export default {
    // 指令查询列表
    getList(data) {
        return request.post('/rest/command/getList', data)
    },
    // 指令详情
    searchOne(data) {
        return request.post('/rest/command/searchOne', data)
    },
    // 发送指令
    addCommand(data) {
        return request.post('/rest/command/addCommand', data)
    },
    // 转发指令
    InstructionCommand(data) {
        return request.post('/rest/command/InstructionCommand', data)
    },
}


