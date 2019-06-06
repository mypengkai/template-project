import { login, getUser, logout, getinit, queryPermissionsByUser, queryButtonPermissionsByUser } from '@/api/login';
import { getToken, setToken, removeToken } from '@/utils/auth';
import Cookies from 'js-cookie'

const user = {
  state: {
    token: getToken(),
    userInfo: '',
    avatar: '',//废弃
    roles: [],
    name:Cookies.get('names'),
    permissionList: [],
    buttonList:[]
  },

  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_USERINFO: (state, userInfo) => {
      state.userInfo = userInfo
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
    },
    SET_PERMISSIONLIST: (state, permissionList) => {
      state.permissionList = permissionList
    },
    SET_BUTTONLIST: (state, buttonList) =>{
      state.buttonList=buttonList;
    }
  },
  actions: {
    // 登录
    Login({ commit }, userInfo) {
      return new Promise((resolve, reject) => {
        login(userInfo).then(res => {
          let token = res.data;
          localStorage.setItem("myToken",token)
          setToken(token);
          commit('SET_TOKEN', token);//token
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 获取用户信息
    GetInfo({ commit, state }) {
      return new Promise((resolve, reject) => {
        getUser().then(res => {
          let data = res.data;
          commit('SET_USERINFO', data);
          resolve(res)
        }).catch(error => {
          reject(error)
        })
      })
    },


    // 登出
    LogOut({ commit, state }) {
      return new Promise((resolve, reject) => {
        logout(state.name).then((res) => {
          removeToken();
          location.reload();
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },


    // 前端 登出
    FedLogOut({ commit }) {
      return new Promise(resolve => {
        //清除token
        removeToken();
        //重置
        location.reload();
        resolve();
      })
    },



    //单点登录
    getinit({ commit }, userInfo) {
      return new Promise((resolve, reject) => {
        getinit(userInfo).then(res => {
          let token = res.data;
          localStorage.setItem("myToken",token)
          setToken(token);
          commit('SET_TOKEN', token);//token
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 获取用户信息
    GetPermissionList({ commit }) {
      return new Promise((resolve, reject) => {
        queryPermissionsByUser({Mark: '1'}).then(response => {
          const menuData = response.data.data;
          if (menuData && menuData.length > 0) {
            commit('SET_PERMISSIONLIST', menuData)
          } else {
            reject('getPermissionList: 权限列表不是一个空的数组 !')
          }
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },

    //获取权限按钮
    getButtonList({ commit }) {
      queryButtonPermissionsByUser({Mark: '1'}).then(response => {
        const buttonData = response.data.data;
        if (buttonData && buttonData.length > 0) {
          commit('SET_BUTTONLIST', buttonData);
        } else {
          reject('buttonList: button列表不是一个空的数组 !')
        }
        resolve(response)
      }).catch(error => {
        reject(error)
      })
    }
  }
}

export default user
