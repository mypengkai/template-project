<template>
     <div>
           我是平台转换模块
     </div>
</template>

<script>
import Vue from "vue";
import md5 from 'js-md5';
export default {
    data(){
        return{

        }
    },
    mounted(){
        let time = new Date().getTime();
        console.log(time,'time')
        //时间戳加密
        let password = md5('time')
        console.log( password,'password')
    }
}
</script>
