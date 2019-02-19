import axios from 'axios'
import { Loading } from 'element-ui'
import { getToken } from '@/utils/auth'
import tool from '@/utils/common'
import qs from 'qs'

const service = axios.create({
  baseURL: tool.baseURL,
  timeout: 6000,// 请求超时时间,
  // headers: { "X-AUTH-TOKEN": "" },
  isloading: true,
  qs: true,
  ismessage: true,
  withCredentials: false,
})
var ismessage
var loadinginstace//laoding
// request拦截器
service.interceptors.request.use(config => {
  // console.log(config);
  // if(config.url=="/rest/sysuser/add"){
  //   config.headers["Content-Type"]="multipart/form-data";
  // }
  // config.method == 'post' && (config.headers["Content-Type"] = 'application/json');
  ismessage = config.ismessage;
  config.qs && (config.data = qs.stringify(config.data));
  getToken() && (config.headers["X-AUTH-TOKEN"] = getToken());

  config.isloading && (loadinginstace = Loading.service({ text: '使劲加载中...', background: 'rgba(0, 0, 0, 0.5)' }));
  return config
}, error => {
  loadinginstace && loadinginstace.close();
  ismessage && tool.messageErr('服务器开小差了!!!');
  return Promise.reject(error)
})

// respone拦截器
service.interceptors.response.use(
  res => {
    //loading
    loadinginstace && loadinginstace.close();
    //状态码
    //tool.checkStatus(ismessage, res.data.success, res.data.msg);
    //错误判断
    return res;
    if (res.data.success == 0) return res;
    else return Promise.reject('请求有误')
  },
  error => {
    loadinginstace && loadinginstace.close()
    ismessage && tool.messageErr('暂无数据!!!')
    return Promise.reject(error)
  }
)

export default service
