import request from '@/utils/request'

export default {
    // 每日日志
    everyDayLog(data) {
        return request.post('/rest/processInfoLog/everyDayLog', data)
    },
    // 巡检列表
    PatrolList(data) {
        return request.post('/rest/Patrol/getList', data)
    },
    // 查看单个
    chakanList(id) {
        return request.post(`/rest/Patrol/chakan/${id}`)
    },
}


