<template>
  <div class="app-container">
    <tree-table :data="menuList" :columns="columns" border/>
  </div>
</template>

<script>
import treeTable from '@/components/TreeTable';
import api from "@/api/resource.js";
export default {
  name: 'TreeTableDemo',
  components: { treeTable },
  data() {
    return {
      columns: [
        {
          text: '组织机构',
          value: 'sortorder',
          width: 200
        },
        {
          text: 'ID',
          value: 'id'
        },
        {
          text: '时间',
          value: 'level'
        },
        {
          text: '备注',
          value: 'name'
        }
      ],
     menuList:[]
    }
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
}
</script>
