<template>
    <div class="p20">
        <!-- 新增 -->
        <el-button type="primary">新增</el-button>
        <!-- 列表 -->
        <div>
            <tree-table :data="data" :eval-func="func" :eval-args="args" :expand-all="expandAll" border>
                <el-table-column label="事件">
                </el-table-column>

                <el-table-column label="时间线">
                </el-table-column>

                <el-table-column label="操作" width="200">
                    <template slot-scope="scope">
                        <el-button type="text">点击</el-button>
                    </template>
                </el-table-column>
            </tree-table>
        </div>
    </div>
</template>

<script>
import treeTable from "@/components/TreeTable";
import treeToArray from "../treeTable/customEval.js";
import api from "@/api/resource.js";
export default {
  name: "CustomTreeTableDemo",
  components: { treeTable },
  data() {
    return {
      menuList: [],
      func: treeToArray,
      expandAll: false,
      data: {
        id: 1,
        event: "事件1",
        timeLine: 100,
        comment: "无",
        children: [
          {
            id: 2,
            event: "事件2",
            timeLine: 10,
            comment: "无"
          },
          {
            id: 3,
            event: "事件3",
            timeLine: 90,
            comment: "无",
            children: [
              {
                id: 4,
                event: "事件4",
                timeLine: 5,
                comment: "无"
              },
              {
                id: 5,
                event: "事件5",
                timeLine: 10,
                comment: "无"
              },
              {
                id: 6,
                event: "事件6",
                timeLine: 75,
                comment: "无",
                children: [
                  {
                    id: 7,
                    event: "事件7",
                    timeLine: 50,
                    comment: "无",
                    children: [
                      {
                        id: 71,
                        event: "事件71",
                        timeLine: 25,
                        comment: "xx"
                      },
                      {
                        id: 72,
                        event: "事件72",
                        timeLine: 5,
                        comment: "xx"
                      },
                      {
                        id: 73,
                        event: "事件73",
                        timeLine: 20,
                        comment: "xx"
                      }
                    ]
                  },
                  {
                    id: 8,
                    event: "事件8",
                    timeLine: 25,
                    comment: "无"
                  }
                ]
              }
            ]
          }
        ]
      },
      args: [null, null, "timeLine"]
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
