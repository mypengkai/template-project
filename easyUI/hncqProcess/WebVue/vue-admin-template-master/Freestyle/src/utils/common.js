import { Message, MessageBox } from 'element-ui'
import store from '@/store'
import Vue from 'vue'
import { getToken } from '@/utils/auth'
import {queryButtonPermissionsByUser} from '@/api/login'

const tool = {
  //环境自动切换 适应域名
  baseURL: process.env.BASE_API,
};
tool._vue = new Vue();
tool.upload = {
  img: () => `${tool.baseURL}/upload/wsww/?X-AUTH-TOKEN=${getToken()}`//图片上传地址
}
tool.message = (msg, sec = 3) => {
  Message({
    message: msg,
    duration: sec * 1000
  });
};

tool.messageSuccess = (msg, sec = 3) => {
  Message.success({
    message: msg,
    duration: sec * 1000
  });
};

tool.messageErr = (msg, sec = 3) => {
  Message.error({
    message: msg,
    duration: sec * 1000
  });
};
//检查状态码!!19
tool.checkStatus = (ismessage, status, msg) => {
  //ismessage && status == 0 && tool.messageSuccess(msg || '请求成功!!!');
  ismessage && status != 0 && tool.messageErr(msg || '请求失败!!!');
};
tool.ObCopy = (data) => {
  return JSON.parse(JSON.stringify(data));
};
tool.ObCopyDeep = (obj) => {
  let proto = Object.getPrototypeOf(obj);
  return Object.assign({}, Object.create(proto), obj);
}
tool.getElement = (dom) => {
  return document.querySelector(dom)
}
tool.getAnyDate = (curDate, dayInterval = 0, isTime = false) => {
  //var curDate = new Date(Date.parse(fromDate.replace(/-/g, "/")));
  curDate.setDate(curDate.getDate() + dayInterval);
  let year = curDate.getFullYear();
  let month = (curDate.getMonth() + 1) < 10 ? "0" + (curDate.getMonth() + 1) : (curDate.getMonth() + 1);
  let day = curDate.getDate() < 10 ? "0" + curDate.getDate() : curDate.getDate();
  let hour = curDate.getHours() < 10 ? '0' + curDate.getHours() : '' + curDate.getHours();
  let minutes = curDate.getMinutes() < 10 ? '0' + curDate.getMinutes() : '' + curDate.getMinutes();
  let seconds = curDate.getSeconds() < 10 ? '0' + curDate.getSeconds() : '' + curDate.getSeconds();
  if (isTime) return `${year}-${month}-${day} ${hour}:${minutes}:${seconds}`;
  else return `${year}-${month}-${day}`;
}

tool.getColor = (max, base) => {
  let arr = [];
  let colori = base;
  for (var i = 0; i < max; i++) {
    colori += 25;
    let colors = `rgba(140,${colori},${colori})`
    arr.push(colors);
  }
  return arr;
}

tool.locGet = (item) => {
  if (localStorage.getItem(item)) return JSON.parse(localStorage.getItem(item))
  else return false;
}

tool.fullscreen = (callback) => {
  window.onresize = () => {
    let isfull = (document.body.scrollHeight == window.screen.height && document.body.scrollWidth == window.screen.width);
    callback(isfull)
  }
}
//跳转新窗口
tool.openView = (url) => {
  let { href } = router.resolve({ path: url });
  window.open(href, '_blank');
}
tool.Ltx=(btnName)=>{
  Vue.nextTick(function(btnName){
    queryButtonPermissionsByUser(binding.value).then(res=> {
      return res.data.data;
    });
  });
}

tool.getUrlKey=(name)=>{
  return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.href) || [, ""])[1].replace(/\+/g, '%20')) || null
}

/**
 * 判断字符串不能为空
 * @param str
 * @returns {boolean}
 */
tool.isNotEmptyStr = function (str) {
  if ((str !== '') && (str !== null) && (str !== undefined) && str.trim().length > 0) {
    return true
  } else {
    return false
  }
}

Vue.prototype.$tool = tool
export default tool;
