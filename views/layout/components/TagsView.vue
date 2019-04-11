<template>
  <div class="tags-view-container" style="width:80%">
    
    <scroll-pane ref="scrollPane" class="tags-view-wrapper">
      <div class="fhBox"><el-button type="success" size="mini"  id="deteilButton" icon="el-icon-arrow-left" @click="detileLog" v-if="flag">返回首页</el-button></div>
      <router-link
        v-for="tag in Array.from(visitedViews)"
        ref="tag"
        :class="isActive(tag)?'active':''"
        :to="tag"
        :key="tag.path"
        tag="span"
        class="tags-view-item"
        @click.middle.native="closeSelectedTag(tag)"
        @contextmenu.prevent.native="openMenu(tag,$event)">
       {{ tag.title }}
        <span class="el-icon-close" @click.prevent.stop="closeSelectedTag(tag)"/>
      </router-link>
    </scroll-pane>
    <ul v-show="visible" :style="{left:left+'px',top:top+'px'}" class="contextmenu">
      <li @click="refreshSelectedTag(selectedTag)">重置</li>
      <li @click="closeSelectedTag(selectedTag)">关闭</li>
      <li @click="closeOthersTags">关闭其他</li>
      <li @click="closeAllTags">关闭所有</li>
    </ul>
  </div>
</template>

<script>
  import ScrollPane from '@/components/ScrollPane'
  //import { generateTitle } from '@/utils/i18n'

  export default {
    components: { ScrollPane },
    data() {
      return {
        visible: false,
        top: 0,
        left: 0,
        selectedTag: {},
        flag:true
      }
    },
    computed: {
      visitedViews() {
        return this.$store.state.tagsView.visitedViews
      }
    },
    watch: {
      $route() {
        this.addViewTags()
        this.moveToCurrentTag()
        // console.log(this.$route.path,'this.$route.path')
        if(this.$route.path == '/dashboard'){
               this.flag = false
          }
          if(this.$route.path != '/dashboard'){
               this.flag = true
          }
      },
      visible(value) {
        if (value) {
          document.body.addEventListener('click', this.closeMenu)
        } else {
          document.body.removeEventListener('click', this.closeMenu)
        }
      }
    },
    mounted() {
      this.addViewTags()
    },
    methods: {
      //generateTitle, // generateTitle by vue-i18n
      isActive(route) {
        return route.path === this.$route.path
      },
      addViewTags() {
        const { name } = this.$route
        if (name) {
          this.$store.dispatch('addView', this.$route)
        }
        return false
      },
      moveToCurrentTag() {
        const tags = this.$refs.tag
        this.$nextTick(() => {
          for (const tag of tags) {
            if (tag.to.path === this.$route.path) {
              this.$refs.scrollPane.moveToTarget(tag.$el)

              // when query is different then update
              if (tag.to.fullPath !== this.$route.fullPath) {
                this.$store.dispatch('updateVisitedView', this.$route)
              }

              break
            }
          }
        })
      },
      refreshSelectedTag(view) {
        this.$store.dispatch('delCachedView', view).then(() => {
          const { fullPath } = view
          this.$nextTick(() => {
            this.$router.replace({
              path: '/redirect' + fullPath
            })
          })
        })
      },
      closeSelectedTag(view) {
        this.$store.dispatch('delView', view).then(({ visitedViews }) => {
          if (this.isActive(view)) {
            const latestView = visitedViews.slice(-1)[0]
            if (latestView) {
              this.$router.push(latestView)
            } else {
              this.$router.push('/')
            }
          }
        })
      },
      closeOthersTags() {
        this.$router.push(this.selectedTag)
        this.$store.dispatch('delOthersViews', this.selectedTag).then(() => {
          this.moveToCurrentTag()
        })
      },
      closeAllTags() {
        this.$store.dispatch('delAllViews')
        this.$router.push('/')
      },
      openMenu(tag, e) {
        this.visible = true
        this.selectedTag = tag
        const offsetLeft = this.$el.getBoundingClientRect().left // container margin left
        this.left = e.clientX - offsetLeft + 15 // 15: margin right
        this.top = e.clientY
      },
      closeMenu() {
        this.visible = false
      },
      detileLog(){
          this.$router.push('/')
          this.flag = false
      }
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss" scoped type="text/scss">
  .tags-view-container {
    height: 4vh;
    width: 100%;
    background: #fff;
    border-bottom: 1px solid #d8dce5;
    box-shadow: 0 1px 3px 0 rgba(0, 0, 0, .12), 0 0 3px 0 rgba(0, 0, 0, .04);
  .tags-view-wrapper {
  .tags-view-item {
    display: inline-block;
    position: relative;
    cursor: pointer;
    height: 3vh;
    line-height: 3vh;
    border: 1px solid #d8dce5;
    color: #495060;
    background: #fff;
    padding: 0 8px;
    font-size: 0.5vw;
    margin-left: 5px;
    margin-top: 4px;
  &:first-of-type {
     margin-left: 15px;
   }
  &:last-of-type {
     margin-right: 15px;
   }
  &.active {
     background-color: #42b983;
     color: #fff;
     border-color: #42b983;
  &::before {
     content: '';
     background: #fff;
     display: inline-block;
     width: 8px;
     height: 8px;
     border-radius: 50%;
     position: relative;
     margin-right: 2px;
   }
  }
  }
  }
  .contextmenu {
    margin: 0;
    background: #fff;
    z-index: 100;
    position: absolute;
    list-style-type: none;
    padding: 5px 0;
    border-radius: 4px;
    font-size: 12px;
    font-weight: 400;
    color: #333;
    box-shadow: 2px 2px 3px 0 rgba(0, 0, 0, .3);
  li {
    margin: 0;
    padding: 7px 16px;
    cursor: pointer;
  &:hover {
     background: #eee;
   }
  }
  }
  }
  .fhBox{
    width:20%;
    padding: 0;
    margin: 0;
    height: 4vh;
    line-height: 4vh;
    position: fixed;
    top:8.5vh;
    right:0;
    background: #fff;
    border-bottom: 1px solid #d8dce5;
    box-shadow: 0 1px 0 0 rgba(0, 0, 0, 0.12), 0 0 0 0 rgba(0, 0, 0, 0);
    #deteilButton{
     float: right;
     margin-top:0.3vw;
 }
  }
 
</style>

<style rel="stylesheet/scss" lang="scss">
  //reset element css of el-icon-close
  .tags-view-wrapper {
  .tags-view-item {
  .el-icon-close {
    width: 16px;
    height: 16px;
    vertical-align: 2px;
    border-radius: 50%;
    text-align: center;
    transition: all .3s cubic-bezier(.645, .045, .355, 1);
    transform-origin: 100% 50%;
  &:before {
     transform: scale(.6);
     display: inline-block;
     vertical-align: -3px;
   }
  &:hover {
     background-color: #b4bccc;
     color: #fff;
   }
  }
  }
  }
</style>
