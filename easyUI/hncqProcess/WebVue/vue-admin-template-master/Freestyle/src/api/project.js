import request from '@/utils/request'

export default {
    projectAdd(data) {
        return request.post('/rest/ProjectItemInfoController/projectadd', data)
    },
    projectList(data) {
        return request.post('/rest/ProjectItemInfoController/getList', data)
    }
}

// export function getUser(params) {
//   return request.get('/rest/user', {params})
// }


