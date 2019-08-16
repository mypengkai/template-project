<template>
  <div>
    <el-form class="reverseBox" ref="userFrom" :model="user" label-width="130px" :rules="rules">
      <div style="width:50%">
        <el-form-item label="用户姓名:" prop="realname">
          <el-input v-model="user.realname"></el-input>
        </el-form-item>

        <el-form-item v-if="nowItem=='add'" label="登录名:" prop="username">
          <el-input v-model="user.username"></el-input>
        </el-form-item>

        <el-form-item v-if="nowItem!='add'" label="登录名:" prop="username">
          <el-input v-model="user.username" :disabled="true"></el-input>
        </el-form-item>

        <el-form-item v-if="nowItem=='add'" label="密码:" prop="password">
          <el-input show-password v-model="user.password"></el-input>
        </el-form-item>

        <el-form-item label="组织机构:">
          <select-tree
            clearable
            :options="orgTree"
            :props="defaultProps"
            node-key="id"
            :default-expand-all="true"
            v-on:noDe="handleCheckChange"
            v-model="userGroupName"
            ref="userInfo_userGroup"
          />
        </el-form-item>

        <el-form-item label="角色:" prop="userkey">
          <el-select v-model="user.userkey" multiple placeholder="请选择角色">
            <el-option
              v-for="item in roleList"
              :key="item.id"
              :label="item.rolename"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="用户类型:" prop="personType">
          <el-select v-model="user.personType" placeholder="请选择用户类型">
            <el-option
              v-for="item in personTypeList"
              :key="item.id"
              :label="item.value"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="职位：" prop="zhiwei">
          <el-select v-model="user.zhiwei" placeholder="请选择职位">
            <el-option
              v-for="item in positionList"
              :key="item.id"
              :label="item.job_name_cn"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="是否授权手机：" prop="peopleOnPhone">
          <el-switch
            v-model="user.peopleOnPhone"
            active-color="#13ce66"
            inactive-color="#ff4949"
            active-value="1"
            inactive-value="0">
          </el-switch>
        </el-form-item>


        <el-form-item label="手机号码：" prop="mobilePhone">
          <el-input class="numInput" type="number"
            onkeypress="return( /[\d]/.test(String.fromCharCode(event.keyCode) ) )"
            v-model="user.mobilePhone"></el-input>
        </el-form-item>

      </div>
    </el-form>
    <div class="tar">
      <el-button @click="$emit('cancel')">取 消</el-button>
      <el-button type="primary" @click="_comfirm">保 存</el-button>
    </div>
  </div>
</template>

<script>
import user from "@/api/user";
import position from '@/api/position'
import api from "@/api/role";
import Organization from "@/api/Organization";
import SelectTree from "@/components/SelectTree/selectTree";
export default {
  inject: ["reload"],
  props: ["nowItem",'conentList'],
  components: {
    SelectTree
  },
  data() {
    var checkPhone = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("手机号不能为空"));
      } else {
        const reg = /^1(?:3\d|4[4-9]|5[0-35-9]|6[67]|7[013-8]|8\d|9\d)\d{8}$/;
        if (reg.test(value)) {
          callback();
        } else {
          return callback(new Error("请输入正确的手机号"));
        }
      }
    };
    return {
      orgTree: [],
      userGroupName: '',   //用于组织机构回选
      defaultProps: {
        children: "children",
        label: "name",
        value: "id",
        parent: "parentdepartid",
      },
      rules: {
        username: [{ required: true, message: "请输入登录名", trigger: "blur" }, { pattern: /^[a-zA-Z]+$/, message: '只能输入英文' }],
        realname: [{ required: true, message: "请输入用户名", trigger: "blur" }, { pattern: /^[\u4E00-\u9FA5]+$/, message: '角色名称只能为中文'}],
        password: [
          { required: true, message: "必填项", trigger: "blur" },
          { min: 6, max: 12, message: "长度在 6 到 12 个字符", trigger: "blur" }
        ],
        userkey: [{ required: true, message: "必填项", trigger: "blur" }],
        mobilePhone: { required: true, validator: checkPhone, trigger: "blur" },
        departid: [{ required: true, message: "必填项", trigger: "blur" }]
      }, //表单校验规则
      user: {
        id: "",
        password: "",
        realname: "",
        username: "",
        userkey: [],
        zhiwei: "",
        departName: "",
        mobilePhone: "",
        personType: '',  //用户类型
        departid: "",
        peopleOnPhone: "0"  //默认不是一人一机
      },
      roleList: [],
      positionList: [],  //职位列表
      personTypeList: [{
        id: '1',
        value: '业主'
      },{
        id: '2',
        value: '监理'
      },{
        id: '3',
        value: '施工单位'
      }]
    };
  },
  created() {
    this._roleList();
    this._orgTree();
    this.initForm();
    this.initPositionList();
  },
  mounted() {},
  methods: {
    initForm() {
      if (this.nowItem == "add"){   //添加时不需要初始化
        return;
      }else {
        this.user={};  //清空内容
        user.sysuserCheck({id: this.nowItem.id}).then(res => {
          this.user = res.data.data;
          //赋值角色
          let userkeys = [];
          for (let key of res.data.data.userkey) {
            userkeys.push(key.id);
          }
          this.user.userkey = userkeys;
          this.$refs.userInfo_userGroup.labelModel=res.data.data.departName;
        })
      }
    },
    // 新增用户
    _comfirm() {
      this.$refs['userFrom'].validate((valid) => {
        if(this.user.departid==="" || this.user.departid===undefined){
          this.$message({
            message: "所属组织机构未选择",
            type: 'warning'
          });
          return;
        }
        if(valid){
          let userkeys='';
          for(let key of this.user.userkey){
            userkeys+=key+',';
          }
          //处理一下
          userkeys=userkeys.substring(0, userkeys.length-1);
          user.sysuserAdd({
            id: this.user.id,
            userName: this.user.username,
            realName: this.user.realname,
            password: this.user.password,
            departid: this.user.departid,
            userKey: userkeys,
            zhiwei: this.user.zhiwei,
            email: '',
            personType: this.user.personType,
            mobilePhone: this.user.mobilePhone,
            peopleOnPhone: this.user.peopleOnPhone
          }).then(res=>{
            this.$message({
              message: "添加用户成功",
              type: "success"
            });
            this.$emit("cancel");   //关闭弹框
            this.$emit("comfirm");   //确认
          })
        }
      });
    },
    // 角色请求列表
    _roleList() {
      api.roleList().then(res => {
        this.roleList = res.data.data;
      });
    },
    // 组织机构树
    _orgTree() {
      Organization.organizateTree().then(res => {
        this.orgTree = res.data.data;
      });
    },
    // 组织机构选择后的数据
    handleCheckChange(data, checked, indeterminate) {
      this.user.departid = data.id;
      this.user.departName = data.name;
      this.innerVisible = false;
    },
    initPositionList(){
      position.getList(null).then(res=>{
        this.positionList=res.data.data;
      })
    }
  }
};
</script>

<style lang="scss" scoped>
.reverseBox {
  height: 60vh;
  overflow-y: auto;
  /deep/.el-form-item__label {
    font-size: 0.7vw;
  }
  /deep/.el-input {
    font-size: 0.7vw;
  }
  /deep/.el-form-item__label{
    font-size: 14px;
  }
}
.numInput {
  .el-input__inner {
    input::-webkit-outer-spin-button,
    input::-webkit-inner-spin-button {
      -webkit-appearance: none !important;
    }
    margin: 20px !important;
  }
  .el-input__inner:hover {
    margin: 20px !important;
  }
}
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>
