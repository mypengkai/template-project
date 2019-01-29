import request from '@/utils/request'

export default {
    projectAdd(data) {
        return request.post('/rest/ProjectItemInfoController/projectadd', data)
    }
}

// export function getUser(params) {
//   return request.get('/rest/user', {params})
// }

// export function logout(data) {
//   return request.post('/rest/tokens', data)
// }

