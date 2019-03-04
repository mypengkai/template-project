const resizeEvt = 'orientationchange' in window ? 'orientationchange' : 'resize';
const initView = () => {
  // let clintWidth = document.body.clientWidth / 20
  let clintWidth = document.body.clientWidth;
  document.querySelector('html').style.fontSize = `${clintWidth}px`;
}
window.addEventListener(resizeEvt, initView);
document.addEventListener('DOMContentLoaded', initView);
