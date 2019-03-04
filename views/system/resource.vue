<template>
        <div class="container">
            <div class="row">
                <div class="col-xs-12 col-sm-8 col-sm-offset-2 col-md-6 col-md-offset-3">
                  <input type="radio" name="Fruit" ref="koi" @click="fn">
                  <button @click="cli">点我</button>
                </div>
            </div>
        </div>
</template>

<script>
  export default {
    methods: {
      cli() {
        console.log()
        // this.fn()
      },
      fn(){
        addEventListener('click',function fn(e){
          console.log(e)
        })
      }
    }
  }
</script>   
