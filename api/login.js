import request from '@/utils/request'

export function login(data) {
  return request.post('/rest/tokens', data)
}

export function getUser(params) {
  return request.get('/rest/user', {params})
}

export function logout(data) {
  return request.delete('/rest/tokens/'+data)
}
//单点登录
export function getinit(data) {
  return request.post('/rest/tokens/loginFromWZ',data)
}

