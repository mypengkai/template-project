<template>
  <div class="p20">
    <!-- 新增 -->
    <el-button type="primary">新增</el-button>
    <!-- 列表 -->
    <div>
      <!-- 头部 -->
      <div>
        <span>1</span>
        <span>2</span>
        <span>3</span>
        <span>4</span>
        <span>5</span>        
      </div>
      <!-- 树 -->
      <el-tree :data="listByTree" show-checkbox node-key="id" default-expand-all :expand-on-click-node="false">
        <div class="custom-tree-node" slot-scope="{ node, data }">
          <span>{{ data.label }}</span>
          <span>{{ data.label }}</span>
          <span>{{ data.label }}</span>
          <span>{{ data.label }}</span>
          <span>{{ data.label }}</span>
        </div>
      </el-tree>
    </div>
  </div>
</template>

<script>
import api from "@/api/resource.js";
export default {
  name: "CustomTreeTableDemo",
  data() {
    return {
      menuList: [],
      listByTree: [
        {
          id: 1,
          label: "一级 1",
          children: [
            {
              id: 4,
              label: "二级 1-1",
              children: [
                {
                  id: 9,
                  label: "三级 1-1-1"
                },
                {
                  id: 10,
                  label: "三级 1-1-2"
                }
              ]
            }
          ]
        },
        {
          id: 2,
          label: "一级 2",
          children: [
            {
              id: 5,
              label: "二级 2-1"
            },
            {
              id: 6,
              label: "二级 2-2"
            }
          ]
        },
        {
          id: 3,
          label: "一级 3",
          children: [
            {
              id: 7,
              label: "二级 3-1"
            },
            {
              id: 8,
              label: "二级 3-2"
            }
          ]
        }
      ]
    };
  },
  created() {
    this.resourceList();
  },
  methods: {
    resourceList() {
      api.menuList().then(res => {
        console.log(res.data.data);
        this.menuList = res.data.data;
      });
    }
  }
};
</script>

<style lang="scss" scoped>
</style>
