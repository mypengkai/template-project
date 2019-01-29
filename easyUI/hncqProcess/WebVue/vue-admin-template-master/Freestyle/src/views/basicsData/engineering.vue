<template>
  <div class="engineeringLayout">
    <!-- 选择区域 -->
    <div class="selectArea">
      <div class="framework">
        组织机构:
        <el-select v-model="value" placeholder="请选择">
          <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
      </div>
      <!-- 上传 -->
      <div class="dataUp">
        <span style="padding-top: 1vw;">导入工程数据:</span>
        <span>
          <el-upload class="upload-demo" action="https://jsonplaceholder.typicode.com/posts/" :on-change="handleChange">
            <el-input v-model="input" placeholder="请选择需要上传的文件"></el-input>
          </el-upload>
        </span>
        <span style="padding-top: 0.7vw;">
          <el-upload class="upload-demo" action="https://jsonplaceholder.typicode.com/posts/" :on-change="handleChange">
            <el-button size="small" type="primary">点击上传</el-button>
          </el-upload>
        </span>
      </div>
    </div>
    <!-- 操作列表 -->
    <div class="app-container">
      <tree-table :data="data" :columns="columns" border>
        <el-table-column label="操作" width="200">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" circle></el-button>
            <el-button type="danger" icon="el-icon-delete" circle></el-button>
          </template>
        </el-table-column>
      </tree-table>
    </div>
  </div>
</template>

<script>
import treeTable from "@/components/TreeTable";
export default {
  name: "TreeTableDemo",
  components: { treeTable },
  data() {
    return {
      options: [
        {
          value: "选项1",
          label: "上海同望"
        },
        {
          value: "选项2",
          label: "研发部"
        },
        {
          value: "选项3",
          label: "工程部"
        },
        {
          value: "选项4",
          label: "一分部"
        },
        {
          value: "选项5",
          label: "二分部"
        }
      ],
      columns: [
        {
          text: "组织机构",
          value: "event",
          width: 200
        },
        {
          text: "代码",
          value: "id"
        },
        {
          text: "桩号",
          value: "timeLine"
        },
        {
          text: "工程类型",
          value: "comment"
        }
      ],
      data: [
        {
          id: "J",
          event: "上海同望",
          timeLine: "K0+503-K13+900",
          comment: "单位工程"
        },
        {
          id: "H1",
          event: "研发部",
          timeLine: "K0-K0",
          comment: "单位工程",
          children: [
            {
              id: "Q01",
              event: "一分部",
              timeLine: "K1+93-K1+93",
              comment: "单位工程"
            },
            {
              id: "Q02",
              event: "二分部",
              timeLine: "K3+274-K3+274",
              comment: "单位工程",
              children: [
                {
                  id: "Q03",
                  event: "事件4",
                  timeLine: "K6+740-K6+740",
                  comment: "单位工程"
                },
                {
                  id: "Q04",
                  event: "事件5",
                  timeLine: "K7+903-K7+903",
                  comment: "单位工程"
                },
                {
                  id: "Q05",
                  event: "事件6",
                  timeLine: "K10+797-K10+797",
                  comment: "单位工程",
                  children: [
                    {
                      id: 7,
                      event: "事件7",
                      timeLine: "K11+285-K11+285",
                      comment: "单位工程",
                      children: [
                        {
                          id: 71,
                          event: "事件71",
                          timeLine: 25,
                          comment: "单位工程"
                        },
                        {
                          id: 72,
                          event: "事件72",
                          timeLine: 5,
                          comment: "单位工程"
                        },
                        {
                          id: 73,
                          event: "事件73",
                          timeLine: 20,
                          comment: "单位工程"
                        }
                      ]
                    },
                    {
                      id: "S1",
                      event: "事件8",
                      timeLine: "K10+090-K26+034",
                      comment: "单位工程"
                    }
                  ]
                }
              ]
            }
          ]
        }
      ],
      value: "",
      input: ""
    };
  },
  methods: {
    handleChange(file, fileList) {
      this.fileList3 = fileList.slice(-3);
    }
  }
};
</script>

<style lang="scss" scoped >
.engineeringLayout {
  padding: 20px;
  .selectArea {
    height: 6vh;
    border: 1px solid #ccc;
    border-radius: 10px;
    .framework {
      padding-left: 20px;
      padding-top: 0.4vw;
      width: 20vw;
      height: 100%;
      float: left;
    }
    .dataUp {
      width: 35vw;
      height: 100%;
      float: left;

      margin-left: 15vw;
      span {
        display: block;
        float: left;
        padding-left: 20px;
        padding-top: 0.4vw;
      }
    }
  }
  .treeList {
    height: 70vh;
    margin-top: 20px;
    border-radius: 10px;
    border: 1px solid #ccc;
  }
}
</style>
