<template>
  <div class="tags-view-container" style="width:100%">
    <scroll-pane ref="scrollPane" class="tags-view-wrapper">
      <div class="fhBox" @click="$router.push('/')"  v-if="flag" >
        <i class="el-icon-d-arrow-left"></i>
        首页
        <span class="el-icon-close"  />  
        
      </div>
      <router-link
        v-for="tag in Array.from(visitedViews)"
        ref="tag"
        :class="isActive(tag)?'active':''"
        :to="tag"
        :key="tag.path"
        tag="span"
        class="tags-view-item"
        @click.middle.native="closeSelectedTag(tag)"
        @contextmenu.prevent.native="openMenu(tag,$event)"
      >
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
import ScrollPane from "@/components/ScrollPane";
//import { generateTitle } from '@/utils/i18n'

export default {
  inject: ["reload"],
  components: { ScrollPane },
  data() {
    return {
      visible: false,
      top: 0,
      left: 0,
      selectedTag: {},
      flag: true,
    };
  },
  computed: {
    visitedViews() {
      return this.$store.state.tagsView.visitedViews;
    }
  },
  watch: {
    $route() {
      this.addViewTags();
      this.moveToCurrentTag();
      // if (this.$route.path == "/dashboard") {
      //   this.flag = false;
      // }
      // if (this.$route.path != "/dashboard") {
      //   this.flag = true;
      // }
    },
    visible(value) {
      if (value) {
        document.body.addEventListener("click", this.closeMenu);
      } else {
        document.body.removeEventListener("click", this.closeMenu);
      }
    }
  },
  mounted() {
    this.addViewTags();
  },
  methods: {
    //generateTitle, // generateTitle by vue-i18n
    isActive(route) {
      return route.path === this.$route.path;
    },
    addViewTags() {
      const { name } = this.$route;
      if (name) {
        this.$store.dispatch("addView", this.$route);
      }
      return false;
    },
    moveToCurrentTag() {
      const tags = this.$refs.tag;
      this.$nextTick(() => {
        for (const tag of tags) {
          if (tag.to.path === this.$route.path) {
            this.$refs.scrollPane.moveToTarget(tag.$el);

            // when query is different then update
            if (tag.to.fullPath !== this.$route.fullPath) {
              this.$store.dispatch("updateVisitedView", this.$route);
            }

            break;
          }
        }
      });
    },
    refreshSelectedTag(view) {
      // this.$store.dispatch('delCachedView', view).then(() => {
      //   const { fullPath } = view
      //   this.$nextTick(() => {
      //     this.$router.replace({
      //       path: '/redirect' + fullPath
      //     })
      //   })
      // })
      this.reload();
    },
    closeSelectedTag(view) {
      this.$store.dispatch("delView", view).then(({ visitedViews }) => {
        if (this.isActive(view)) {
          const latestView = visitedViews.slice(-1)[0];
          if (latestView) {
            this.$router.push(latestView);
          } else {
            this.$router.push("/");
          }
        }
      });
    },
    closeOthersTags() {
      this.$router.push(this.selectedTag);
      this.$store.dispatch("delOthersViews", this.selectedTag).then(() => {
        this.moveToCurrentTag();
      });
    },
    closeAllTags() {
      this.$store.dispatch("delAllViews");
      this.$router.push("/");
    },
    openMenu(tag, e) {
      this.visible = true;
      this.selectedTag = tag;
      const offsetLeft = this.$el.getBoundingClientRect().left; // container margin left
      this.left = e.clientX - offsetLeft + 15; // 15: margin right
      this.top = e.clientY;
    },
    closeMenu() {
      this.visible = false;
    },
  }
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped type="text/scss">
.tags-view-container {
  height: 4vh;
  background: #fff;
  border-bottom: 1px solid #d8dce5;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.12), 0 0 3px 0 rgba(0, 0, 0, 0.04);
  position: relative;
  .tags-view-wrapper {
    width: 100%;
    display: inline-block;
    white-space: nowrap;
    position: relative;
    overflow: hidden;

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
        margin-left: 5px;
      }
      &:last-of-type {
        margin-right: 15px;
      }
      &.active {
        background-color: #3a71a8;
        color: #fff;
        border-color: #3a71a8;
        &::before {
          content: "";
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
    box-shadow: 2px 2px 3px 0 rgba(0, 0, 0, 0.3);
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
.fhBox {
  text-align: center;
  display: inline-block;
  cursor: pointer;
  height: 3vh;
  line-height: 3vh;
  border-bottom: 1px solid #d8dce5;
  box-shadow: 0 1px 0 0 rgba(0, 0, 0, 0.12), 0 0 0 0 rgba(0, 0, 0, 0);
  background-color: #3a71a8;
  color: #fff;
  padding: 0 8px;
  font-size: 0.5vw;
  margin-left: 15px;
  margin-top: 4px;
     .el-icon-close {
      opacity: 0; 
      width: 16px;
      height: 16px;
      vertical-align: 2px;
      border-radius: 50%;
      text-align: center;
      transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
      transform-origin: 100% 50%;
      &:before {
        transform: scale(0.6);
        display: inline-block;
        vertical-align: -3px;
      }
    }
}
/deep/.el-scrollbar__thumb {
  position: relative;
  display: block;
  width: 0;
  height: 0;
  cursor: pointer;
  -webkit-transition: 0.3s background-color;
  transition: 0.3s background-color;
  background-color: rgb(255, 255, 255);
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
      transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
      transform-origin: 100% 50%;
      &:before {
        transform: scale(0.6);
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
