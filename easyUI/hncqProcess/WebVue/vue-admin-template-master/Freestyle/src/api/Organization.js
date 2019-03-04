import request from '@/utils/request'

export default {
    // 列表 
    organizateTree(params) {
        return request.get('/rest/organizate/depart', { params })
    },
}


