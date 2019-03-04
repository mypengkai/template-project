import request from '@/utils/request'

export default {
    // 指令查询列表
    getList(data) {
        return request.post('/rest/CommandController/getList', data)
    },

}


