
const getters = {
  //自适应
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  //页面缓存
  visitedViews: state => state.tagsView.visitedViews,
  cachedViews: state => state.tagsView.cachedViews,
  avatar: state => state.user.avatar,/*暂时不用*/
  //user
  token: state => state.user.token,
  roles: state => state.user.roles,//暂时不用
  userInfo: state => state.user.userInfo,//暂时不用
  //頁面權限
  permissionList: state => state.user.permissionList,
  addRouters: state => state.permission.addRouters
}
export default getters
