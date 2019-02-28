import request from '@/utils/request'

export default {
    // 每日日志
    everyDayLog(data) {
        return request.post('/rest/processInfoLog/everyDayLog', data)
    },
    // 监理日志列表
    everyDayLogPageList(data) {
        return request.post('/rest/processInfoLog/everyDayLogPageList', data)
    },

}


