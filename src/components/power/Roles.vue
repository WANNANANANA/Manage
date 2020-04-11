<template>
  <div class="roles">
    <!-- navigator封装组件 -->
    <Navigator level1="权限管理" level2="角色列表"></Navigator>
    <!-- 卡片视图 -->
    <el-card>
      <el-row>
        <el-col>
          <el-button type="primary">添加角色</el-button>
        </el-col>
      </el-row>
      <el-table :data="rolesList" stripe border>
        <el-table-column type="expand">
          <template v-slot="scope">
            <el-row
              class="el-row1"
              v-for="item1 in scope.row.children"
              :key="item1.id"
            >
              <el-col :span="5">
                <el-tag closable @close="onDeleteRight(scope, item1)">
                  {{ item1.authName }}</el-tag
                >
                <i class="el-icon-caret-right"></i>
                <!-- 一级权限 -->
              </el-col>
              <el-col :span="19">
                <!-- 二级、三级权限 -->
                <el-row
                  class="el-row2"
                  v-for="item2 in item1.children"
                  :key="item2.id"
                >
                  <el-col :span="6">
                    <el-tag
                      closable
                      @close="onDeleteRight(scope, item2)"
                      type="success"
                      >{{ item2.authName }}</el-tag
                    >
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="18">
                    <el-tag
                      closable
                      type="warning"
                      v-for="item3 in item2.children"
                      :key="item3.id"
                      @close="onDeleteRight(scope, item3)"
                      >{{ item3.authName }}</el-tag
                    >
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="角色名称" prop="roleName"></el-table-column>
        <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
        <el-table-column label="操作" width="300px">
          <template v-slot="scope">
            <el-button type="primary" icon="el-icon-edit" size="mini"
              >编辑</el-button
            >
            <el-button type="danger" icon="el-icon-delete" size="mini"
              >删除</el-button
            >
            <el-button
              type="warning"
              icon="el-icon-setting"
              size="mini"
              @click="onAssignRights(scope)"
              >分配权限</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 分配权限的对话框 -->
    <el-dialog
      title="分配权限"
      :visible.sync="assignDialogVisible"
      @close="onCloseAssignDialog"
    >
      <el-tree
        ref="rightTree"
        :data="rightsList"
        :props="rightsListProps"
        show-checkbox
        node-key="id"
        default-expand-all
        :default-checked-keys="defaultKeys"
      ></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="onAssignRightsCancel">取 消</el-button>
        <el-button type="primary" @click="onAssignRightsConfirm"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
import Navigator from "../pubilc/Navigator";

export default {
  name: "Roles",
  components: { Navigator },
  created() {
    this.getRolesList();
  },
  data() {
    return {
      rolesList: [],
      assignDialogVisible: false,
      rightsList: [],
      rightsListProps: {
        children: "children",
        label: "authName"
      },
      defaultKeys: [], // 默认选择的权限
      roleId: "" // 当前即将分配角色的id
    };
  },
  methods: {
    async getRolesList() {
      let { data } = await this.$axios.get("roles");
      if (data.meta.status == 200) {
        // console.log(data.data);
        this.rolesList = data.data;
      } else {
        console.log(data.meta.msg);
        this.$message({
          $message: "获取角色列表失败",
          type: "fail"
        });
      }
    },
    async onDeleteRight(scope, item) {
      let confirmResult = await this.$confirm("是否要删除该权限", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).catch(error => error);
      if (confirmResult == "confirm") {
        // console.log(scope, item);
        let {
            row: { id: roleId }
          } = scope,
          { id: rightId } = item;
        let { data } = await this.$axios.delete(
          `roles/${roleId}/rights/${rightId}`
        );
        if (data.meta.status == 200) {
          //   this.getRolesList(); // 重新获取数据会导致页面重新渲染 然后导致当前打开的row关闭
          //   console.log(data); // 接口文档中有说明 返回的数据是当前角色下最新的权限数据
          scope.row.children = data.data; // 所以我们只需要替换下当前角色的数据即可 不必重新渲染整个数据
        } else {
          this.$message({
            message: "删除权限失败",
            type: "fail"
          });
        }
      } else {
        this.$message({
          message: "已取消删除操作",
          type: "info"
        });
      }
    },
    async onAssignRights(scope) {
      this.roleId = scope.row.id;
      let { data } = await this.$axios.get("rights/tree");
      if (data.meta.status == 200) {
        // console.log(data.data);
        this.rightsList = data.data;
        this.getDefaultKeys(scope.row, this.defaultKeys);
        this.assignDialogVisible = true;
      } else {
        this.$message({
          message: "获取权限数据失败",
          type: "fail"
        });
      }
    },
    onCloseAssignDialog() {
      // 关闭对话框的时候清空默认选择权限数组
      this.defaultKeys = [];
    },
    onAssignRightsCancel() {
      this.assignDialogVisible = false;
    },
    async onAssignRightsConfirm() {
      let keysIdArr = [
        ...this.$refs.rightTree.getCheckedKeys(),
        ...this.$refs.rightTree.getHalfCheckedKeys()
      ];
      //   console.log(keysIdArr);
      let keysIdStr = keysIdArr.join(",");
      let { data } = await this.$axios.post(`roles/${this.roleId}/rights`, {
        rids: keysIdStr
      });
      if (data.meta.status == 200) {
        this.getRolesList(); // 重新刷新列表
        this.assignDialogVisible = false;
        this.$message({
          message: "分配权限成功",
          type: "success"
        });
      } else {
        console.log(data.meta.msg);
        this.$message({
          message: "分配权限失败",
          type: "fail"
        });
      }
    },
    getDefaultKeys(node, arr) {
      if (!node.children) {
        // 选择出三级节点 并将其id添加至数组中
        arr.push(node.id);
      } else {
        node.children.forEach(item => {
          this.getDefaultKeys(item, arr);
        });
      }
    }
  }
};
</script>
<style lang="less" scoped>
.el-table {
  margin-top: 15px;
  .el-row {
    display: flex;
    align-items: center;
    &.el-row1 {
      border-bottom: 1px solid #eee;
      &:first-child {
        border-top: 1px solid #eee;
      }
    }
    &.el-row2 {
      border-top: 1px solid #eee;
      &:first-child {
        border-top: none;
      }
    }
  }
  .el-tag {
    margin: 8px;
  }
}
</style>
