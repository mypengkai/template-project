
<template>
     <div class="platform"  v-loading.fullscreen.lock="loading">
           
     </div>
</template>



<script>
import md5 from 'js-md5';
import request from "@/utils/request";
export default {
   data(){
       return{
           loading:true,
       }
   },
   mounted(){
     // 当前时间戳
        let timestamp = new Date().getTime();
        console.log(timestamp,'timestamp')
        let password = md5('timestamp')
        console.log(password,'password')
        
   }
}
</script>

