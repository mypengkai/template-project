import request from '@/utils/request'

export default {
    // 列表 
    roleList(data) {
        return request.post('/rest/role/getList', data, )
    },
}


