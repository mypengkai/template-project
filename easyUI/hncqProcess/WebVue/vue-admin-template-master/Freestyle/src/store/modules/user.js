import { login, getUser, logout } from '@/api/login';
import { getToken, setToken, removeToken } from '@/utils/auth';

const user = {
  state: {
    token: getToken(),
    userInfo: '',
    avatar: '',//废弃
    roles: []
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
    }
  },

  actions: {
    // 登录
    Login({ commit }, userInfo) {
      return new Promise((resolve, reject) => {
        login(userInfo).then(res => {
          let token = res.data;
          // console.log(token)
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
        logout(state.token).then(() => {
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
    }
  }
}

export default user
