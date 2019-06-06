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

//根据token获取当前登录用户的菜单
export function queryPermissionsByUser(data) {
  return request.post('/rest/role/getFunctionByUserId', data)
}

//根据token获取当前登录用户下所有的按钮权限
export function queryButtonPermissionsByUser(buttonName) {
  return request.post('/rest/role/getButtonShiroByUserId', {Mark: '1', btnName: buttonName});
}

