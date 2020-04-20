<template>
  <div class="users">
    <!-- navigator封装组件 -->
    <Navigator level1="用户管理" level2="用户列表"></Navigator>
    <!-- 卡片视图 -->
    <el-card class="box-card">
      <!-- 搜索区域 -->
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input v-model="queryInfo.query" placeholder="请输入内容" clearable @clear="getUserList">
            <el-button slot="append" icon="el-icon-search" @click="onSearchUser"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="onAddUser">添加用户</el-button>
        </el-col>
      </el-row>
      <!-- 用户列表区域 -->
      <el-table :data="userList" border stripe>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column label="姓名" prop="username"></el-table-column>
        <el-table-column label="邮箱" prop="email"></el-table-column>
        <el-table-column label="电话" prop="tel"></el-table-column>
        <el-table-column label="角色" prop="role_name"></el-table-column>
        <el-table-column label="状态" prop="mg_state">
          <!-- 作用域插槽 -->
          <template v-slot="scope">
            <el-switch v-model="scope.row.mg_state" @change="onUserStateChange(scope.row)"></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180px">
          <template v-slot="scope">
            <el-tooltip class="item" effect="dark" content="编辑" placement="top" :enterable="false">
              <el-button type="primary" icon="el-icon-edit" size="mini" @click="onEditUser(scope)"></el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="删除" placement="top" :enterable="false">
              <el-button
                type="danger"
                icon="el-icon-delete"
                size="mini"
                @click="onDeleteUser(scope)"
              ></el-button>
            </el-tooltip>
            <el-tooltip
              class="item"
              effect="dark"
              content="分配角色"
              placement="top"
              :enterable="false"
            >
              <el-button
                type="warning"
                icon="el-icon-setting"
                size="mini"
                @click="onAssignRoles(scope)"
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页区域 -->
      <el-pagination
        @size-change="onSizeChange"
        @current-change="onCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[1, 2, 5, 10]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>
    <!-- 添加用户对话框 -->
    <el-dialog title="添加用户" :visible.sync="addDialogVisible" width="50%" @close="onCloseAddDialog">
      <el-form :model="addForm" :rules="addRules" ref="addForm" label-width="70px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addForm.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addForm.email"></el-input>
        </el-form-item>
        <el-form-item label="电话" prop="mobile">
          <el-input v-model="addForm.mobile"></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="onAddUserCancel">取 消</el-button>
        <el-button type="primary" @click="onAddUserConfirm">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 编辑用户对话框 -->
    <el-dialog
      title="编辑用户"
      :visible.sync="editDialogVisible"
      width="50%"
      @close="onCloseEditDialog"
    >
      <el-form :model="editForm" :rules="addRules" ref="editForm" label-width="70px">
        <el-form-item label="用户名">
          <el-input v-model="editForm.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editForm.email"></el-input>
        </el-form-item>
        <el-form-item label="电话" prop="mobile">
          <el-input v-model="editForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="onEditUserCancel">取 消</el-button>
        <el-button type="primary" @click="onEditUserConfirm">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 分配角色对话框 -->
    <el-dialog
      title="分配角色"
      :visible.sync="assignDialogVisible"
      width="50%"
      @close="onCloseAssginDialog"
    >
      <div>
        <p>当前的用户： {{assignForm.username}}</p>
        <p>当前的角色：{{assignForm.role_name}}</p>
        <p>分配新角色：</p>
        <el-select v-model="selectedRoleId" placeholder="请选择">
          <el-option
            v-for="item in rolesList"
            :key="item.id"
            :label="item.roleName"
            :value="item.id"
          ></el-option>
        </el-select>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="onAssignRoleCancel">取 消</el-button>
        <el-button type="primary" @click="onAssignRoleConfirm">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import Navigator from "../pubilc/Navigator";

export default {
  name: "Users",
  components: { Navigator },
  data() {
    // 自定义验证规则
    let checkEmail = (rule, value, callback) => {
      const regEmail = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;
      if (regEmail.test(value)) {
        callback();
      } else {
        callback(new Error("请输入合法的邮箱"));
      }
    };
    let checkMobile = (rule, value, callback) => {
      const regMobile = /^[1]([3-9])[0-9]{9}$/;
      if (regMobile.test(value)) {
        callback(); // 验证通过
      } else {
        callback(new Error("请输入合法的手机号"));
      }
    };
    return {
      queryInfo: {
        query: "",
        pagenum: 1,
        pagesize: 2
      },
      userList: [],
      total: 0,
      addDialogVisible: false,
      addForm: {
        username: "",
        password: "",
        email: "",
        mobile: ""
      },
      addRules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          {
            min: 3,
            max: 8,
            message: "用户名的长度必须是3-8个字符之间",
            trigger: "blur"
          }
        ],
        password: [{ required: true, message: "请输入密码", trigger: "blur" }],
        email: [
          { required: true, message: "请输入邮箱", trigger: "blur" },
          { validator: checkEmail, trigger: "blur" }
        ],
        mobile: [
          { required: true, message: "请输入电话号码", trigger: "blur" },
          { validator: checkMobile, trigger: "blur" }
        ]
      },
      editDialogVisible: false,
      editForm: {},
      assignDialogVisible: false,
      assignForm: {},
      rolesList: [],
      selectedRoleId: ""
    };
  },
  created() {
    this.getUserList();
  },
  methods: {
    async getUserList() {
      let { data } = await this.$axios.get("users", {
        params: this.queryInfo
      });
      if (data.meta.status == 200) {
        this.userList = data.data.users;
        console.log(this.userList);
        this.total = data.data.total;
      } else {
        console.log(data.meta.msg);
      }
    },
    onSizeChange(pageSize) {
      // console.log(pageSize);
      this.queryInfo.pagesize = pageSize;
      this.getUserList();
    },
    onCurrentChange(currentPage) {
      // console.log(currentPage);
      this.queryInfo.pagenum = currentPage;
      this.getUserList();
    },
    async onUserStateChange(row) {
      let { id, mg_state } = row;
      let { data } = await this.$axios.put(`users/${id}/state/${mg_state}`);
      if (data.meta.status == 200) {
        this.$message({
          message: "更新用户状态成功",
          type: "success"
        });
      } else {
        console.log(data.meta.msg);
        row.mg_state = !mg_state;
      }
    },
    onSearchUser() {
      this.queryInfo.pagenum = 1;
      this.getUserList();
    },
    onAddUser() {
      this.addDialogVisible = true;
    },
    onCloseAddDialog() {
      this.$refs.addForm.resetFields();
    },
    onAddUserCancel() {
      this.addDialogVisible = false; // 然后触发对话框@close事件
    },
    onAddUserConfirm() {
      this.$refs.addForm.validate(async valid => {
        if (valid) {
          let { data } = await this.$axios.post("users", this.addForm);
          if (data.meta.status == 201) {
            this.$message({
              message: "添加成功",
              type: "success",
              onClose: () => {
                console.log(this);
                this.onAddUserCancel(); // 隐藏并重置表单
                this.getUserList(); // 重新刷新数据
              }
            });
          } else {
            this.$message({
              message: "添加失败",
              type: "error"
            });
            console.log(data.meta.msg);
          }
        }
      });
    },
    async onEditUser(scope) {
      this.editDialogVisible = true;
      let {
        row: { id }
      } = scope;
      // 这里之所以不用row中的数据而是重新发起请求是为了获取最新的数据
      let { data } = await this.$axios.get(`users/${id}`);
      if (data.meta.status == 200) {
        this.editForm = data.data;
      } else {
        this.$message({
          message: "查询用户信息失败",
          type: "error"
        });
      }
    },
    onCloseEditDialog() {
      this.$refs.editForm.resetFields();
    },
    onEditUserCancel() {
      this.editDialogVisible = false;
    },
    onEditUserConfirm() {
      this.$refs.editForm.validate(async valid => {
        if (valid) {
          let { id, email, mobile } = this.editForm;
          let { data } = await this.$axios.put(`/users/${id}`, {
            email,
            mobile
          });
          if (data.meta.status == 200) {
            // 刷新用户列表
            this.getUserList();
            // 提示修改成功
            this.$message({
              message: "更新用户列表成功",
              type: "success",
              onClose: () => {
                // 关闭对话框
                this.editDialogVisible = false;
              }
            });
          } else {
            console.log(data.meta.msg);
            this.$message({
              message: "更新用户信息失败",
              type: "error"
            });
          }
        }
      });
    },
    async onDeleteUser(scope) {
      let {
        row: { id }
      } = scope;
      let confirmResult = await this.$confirm(
        "确定要永久删除此用户吗？",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      ).catch(error => error); // 捕获了错误信息 这样控制台就不报错
      // console.log(confirmResult);
      if (confirmResult == "confirm") {
        let { data } = await this.$axios.delete(`users/${id}`);
        if (data.meta.status == 200) {
          this.$message({
            message: "删除用户成功",
            type: "success"
          });
          this.getUserList();
        } else {
          this.$message({
            message: "删除用户失败",
            type: "error"
          });
        }
      } else {
        this.$message({
          message: "已经取消了删除",
          type: "info"
        });
      }
    },
    onCloseAssginDialog() {
      this.selectedRoleId = "";
      this.assignForm = {};
    },
    async onAssignRoles(scope) {
      this.assignForm = scope.row;
      // 在展示对话框前获取所有的角色列表
      let { data } = await this.$axios.get("roles");
      if (data.meta.status == 200) {
        this.rolesList = data.data;
      } else {
        this.$message({
          message: "获取角色列表失败"
        });
      }
      this.assignDialogVisible = true;
    },
    onAssignRoleCancel() {
      this.assignDialogVisible = false;
    },
    async onAssignRoleConfirm() {
      let { id } = this.assignForm;
      if (this.selectedRoleId) {
        let { data } = await this.$axios.put(`users/${id}/role`, {
          rid: this.selectedRoleId
        });
        if (data.meta.status == 200) {
          this.getUserList();
          this.$message({
            message: "更新用户角色成功",
            type: "success"
          });
          this.assignDialogVisible = false;
        } else {
          this.$message({
            message: "分配角色失败",
            type: "error"
          });
        }
      } else {
        this.$message({
          message: "请选择要分配的角色",
          type: "error"
        });
      }
    }
  }
};
</script>
<style lang="less" scoped>
.users {
  .el-card {
    margin-top: 15px;
    box-shadow: 0px 1px 1px rgba(0, 0, 0, 0.2) !important;
    .el-table {
      margin-top: 15px;
    }
  }
  .el-dialog__body {
    p {
      margin: 0px 0px 20px;
    }
  }
}
</style>
