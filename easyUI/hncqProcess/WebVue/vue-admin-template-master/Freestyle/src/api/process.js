import request from '@/utils/request'

export default {
    // 查询验收人
    getCheckPerson(data) {
        return request.post('/rest/processCheck/getCheckPerson', data)
    },
    // 查询图片信息
    getPictureDetail(data) {
        return request.post('/rest/processCheck/getPictureDetail', data)
    },
}


