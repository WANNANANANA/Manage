<template>
  <div class="params">
    <Navigator level1="商品管理" level2="分类参数"></Navigator>
    <!-- 卡片视图 -->
    <el-card>
      <el-alert
        title="注意：只允许为第三级分类设置相关参数"
        type="warning"
        :closable="false"
        show-icon
      ></el-alert>
      <el-row class="cat_option">
        <el-col>
          <span>选择商品分类：</span>
          <!-- 级联选择框 -->
          <el-cascader
            v-model="selectedKeys"
            :options="cateList"
            :props="cateProps"
            @change="onCascaderChange"
            clearable
          >
          </el-cascader>
        </el-col>
      </el-row>
      <el-tabs v-model="activeTabName" @tab-click="onTabClick">
        <el-tab-pane label="动态参数" name="many">
          <el-button
            type="primary"
            size="mini"
            :disabled="disableKey"
            @click="onAddParams"
            style="margin-bottom: 10px"
          >
            添加参数
          </el-button>
          <el-table :data="manyParamsData" border stripe>
            <el-table-column type="expand">
              <template v-slot="scope">
                <!-- 循环渲染tag标签 -->
                <el-tag
                  v-for="(item, index) in scope.row.attr_vals"
                  :key="index"
                  closable
                  @close="onCloseTag(index, scope)"
                  >{{ item }}
                </el-tag>
                <!-- 添加按钮 -->
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="onHandleInputConfirm(scope)"
                  @blur="onHandleInputConfirm(scope)"
                >
                </el-input>
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="onShowInput(scope)"
                >
                  + New Tag
                </el-button>
              </template>
            </el-table-column>
            <el-table-column type="index"></el-table-column>
            <el-table-column label="参数名称" prop="attr_name">
            </el-table-column>
            <el-table-column label="操作" v-slot="scope">
              <el-button
                type="primary"
                icon="el-icon-edit"
                size="mini"
                @click="onEditParams(scope)"
              >
                编辑
              </el-button>
              <el-button
                type="danger"
                icon="el-icon-delete"
                size="mini"
                @click="onDeleteParams(scope)"
              >
                删除
              </el-button>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="静态属性" name="only">
          <el-button
            type="primary"
            size="mini"
            :disabled="disableKey"
            @click="onAddParams"
            style="margin-bottom: 10px"
          >
            添加参数
          </el-button>
          <el-table :data="onlyParamsData" border stripe>
            <el-table-column type="expand">
              <template v-slot="scope">
                <!-- 循环渲染tag标签 -->
                <el-tag
                  v-for="(item, index) in scope.row.attr_vals"
                  :key="index"
                  closable
                  @close="onCloseTag(index, scope)"
                  >{{ item }}
                </el-tag>
                <!-- 添加按钮 -->
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="onHandleInputConfirm(scope)"
                  @blur="onHandleInputConfirm(scope)"
                >
                </el-input>
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="onShowInput(scope)"
                >
                  + New Tag
                </el-button>
              </template>
            </el-table-column>
            <el-table-column type="index"></el-table-column>
            <el-table-column
              label="属性名称"
              prop="attr_name"
            ></el-table-column>
            <el-table-column label="操作" v-slot="scope">
              <el-button
                type="primary"
                icon="el-icon-edit"
                size="mini"
                @click="onEditParams(scope)"
              >
                编辑
              </el-button>
              <el-button
                type="danger"
                icon="el-icon-delete"
                size="mini"
                @click="onDeleteParams(scope)"
              >
                删除
              </el-button>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>
    <!-- 添加动态参数/静态属性的对话框 -->
    <el-dialog
      :title="'添加' + dialogTitle"
      :visible.sync="addDialogVisiable"
      @close="onAddDialogClosed"
    >
      <el-form
        :model="addForm"
        :rules="addFormRules"
        ref="addForm"
        label-width="80px"
      >
        <el-form-item :label="dialogTitle" prop="attr_name">
          <el-input v-model="addForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="onAddParamsCancel">取 消</el-button>
        <el-button type="primary" @click="onAddParamsConfirm">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改动态参数/静态属性的对话框 -->
    <el-dialog
      :title="'修改' + dialogTitle"
      :visible.sync="editDialogVisiable"
      @close="onEditDialogClosed"
    >
      <el-form
        :model="editForm"
        :rules="editFormRules"
        ref="editForm"
        label-width="80px"
      >
        <el-form-item :label="dialogTitle" prop="attr_name">
          <el-input v-model="editForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="onEditParamsCancel">取 消</el-button>
        <el-button type="primary" @click="onEditParamsConfirm">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import Navigator from "../pubilc/Navigator";

export default {
  name: "params",
  components: { Navigator },
  created() {
    this.getCateList();
  },
  data() {
    return {
      cateList: [],
      // 级联选择框的配置属性
      cateProps: {
        expandTrigger: "hover",
        value: "cat_id",
        label: "cat_name",
        children: "children"
      },
      // 级联选择框双向绑定的数组
      selectedKeys: [],
      activeTabName: "many",
      manyParamsData: [],
      onlyParamsData: [],
      addDialogVisiable: false,
      addForm: {
        attr_name: ""
      },
      addFormRules: {
        attr_name: [
          { required: true, message: "请输入参数名称", trigger: "blur" }
        ]
      },
      editDialogVisiable: false,
      editForm: {
        attr_id: "",
        attr_name: ""
      },
      editFormRules: {
        attr_name: [
          { required: true, message: "参数名称不能为空", trigger: "blur" }
        ]
      }
    };
  },
  computed: {
    disableKey() {
      if (this.selectedKeys.length == 3) {
        return false;
      } else {
        return true;
      }
    },
    activeCateId() {
      if (this.selectedKeys.length == 3) {
        return this.selectedKeys[2];
      }
    },
    dialogTitle() {
      return this.activeTabName == "many" ? "动态参数" : "静态属性";
    }
  },
  methods: {
    async getCateList() {
      let { data } = await this.$axios.get("categories");
      if (data.meta.status == 200) {
        // console.log(data.data);
        this.cateList = data.data;
      } else {
        this.$message({
          message: "获取商品分类失败",
          type: "error"
        });
      }
    },
    async getParamsData() {
      // 获取参数列表
      let { data } = await this.$axios.get(
        `categories/${this.activeCateId}/attributes`,
        {
          params: {
            sel: this.activeTabName
          }
        }
      );
      if (data.meta.status == 200) {
        data.data.forEach(item => {
          if (item.attr_vals == "") {
            item.attr_vals = [];
          } else {
            item.attr_vals = item.attr_vals.split(" ");
          }
          // 添加属性 控制文本框显示和隐藏以及文本框的内容
          item.inputVisible = false;
          item.inputValue = "";
        });
        console.log(data.data);
        if (this.activeTabName == "many") {
          this.manyParamsData = data.data;
        } else {
          this.onlyParamsData = data.data;
        }
      } else {
        console.log(data.meta.msg);
        this.$message({
          message: "获取参数失败",
          type: "error"
        });
      }
    },
    async onCascaderChange() {
      // 如果长度不为3就说明选中的不是第三级别的 就清空选择
      if (this.selectedKeys.length != 3) {
        this.selectedKeys = [];
        this.manyParamsData = [];
        this.onlyParamsData = [];
      } else {
        this.getParamsData();
      }
    },
    onTabClick() {
      this.getParamsData();
    },
    onAddParams() {
      this.addDialogVisiable = true;
    },
    onAddDialogClosed() {
      this.$refs.addForm.resetFields();
    },
    onAddParamsConfirm() {
      this.$refs.addForm.validate(async valid => {
        if (valid) {
          let { data } = await this.$axios.post(
            `categories/${this.activeCateId}/attributes`,
            {
              attr_name: this.addForm.attr_name,
              attr_sel: this.activeTabName
            }
          );
          if (data.meta.status == 201) {
            this.getParamsData();
            this.addDialogVisiable = false;
            this.$message({
              message: "添加参数成功",
              type: "success"
            });
          } else {
            console.log(data.meta.msg);
            this.$message({
              message: "添加参数失败",
              type: "error"
            });
          }
        }
      });
    },
    onAddParamsCancel() {
      this.addDialogVisiable = false;
    },
    async onEditParams(scope) {
      let {
        row: { cat_id, attr_id }
      } = scope;
      let { data } = await this.$axios(
        `categories/${cat_id}/attributes/${attr_id}`,
        {
          params: {
            attr_sel: this.activeTabName
          }
        }
      );
      if (data.meta.status == 200) {
        this.editForm.attr_name = data.data.attr_name;
        this.editForm.attr_id = attr_id;
        this.editDialogVisiable = true;
      } else {
        this.$message({
          message: "获取参数信息失败",
          type: "error"
        });
      }
    },
    onEditDialogClosed() {
      this.$refs.editForm.resetFields();
    },
    onEditParamsCancel() {
      this.editDialogVisiable = false;
    },
    onEditParamsConfirm() {
      this.$refs.editForm.validate(async valid => {
        if (valid) {
          let { data } = await this.$axios.put(
            `categories/${this.activeCateId}/attributes/${this.editForm.attr_id}`,
            {
              attr_name: this.editForm.attr_name,
              attr_sel: this.activeTabName
            }
          );
          if (data.meta.status == 200) {
            this.getParamsData();
            this.editDialogVisiable = false;
            this.$message({
              message: "修改成功",
              type: "success"
            });
          } else {
            console.log(data.meta.msg);
            this.$message({
              message: "修改失败",
              type: "error"
            });
          }
        }
      });
    },
    async onDeleteParams(scope) {
      let {
        row: { cat_id, attr_id }
      } = scope;
      let confirmResult = await this.$confirm(
        "确定要永久删除该属性吗",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      ).catch(error => error);
      if (confirmResult == "confirm") {
        let { data } = await this.$axios.delete(
          `categories/${cat_id}/attributes/${attr_id}`
        );
        if (data.meta.status == 200) {
          this.getParamsData();
          this.editDialogVisiable = false;
          this.$message({
            message: "删除成功",
            type: "success"
          });
        } else {
          console.log(data.meta.msg);
          this.$message({
            message: "删除失败",
            type: "error"
          });
        }
      } else {
        this.$message({
          message: "已取消删除",
          type: "info"
        });
      }
    },
    async saveAttrValues(row) {
      let { data } = await this.$axios.put(
        `categories/${this.activeCateId}/attributes/${row.attr_id}`,
        {
          attr_name: row.attr_name,
          attr_sel: row.attr_sel,
          attr_vals: row.attr_vals.join(" ")
        }
      );
      if (data.meta.status == 200) {
        this.$message({
          message: "修改参数项成功",
          type: "success"
        });
      } else {
        this.$message({
          message: "修改参数项失败",
          type: "error"
        });
      }
    },
    onHandleInputConfirm(scope) {
      let { row } = scope;
      if (row.inputValue.trim().length == 0) {
        row.inputValue = "";
      } else {
        row.attr_vals.push(row.inputValue.trim());
        row.inputValue = "";
        this.saveAttrValues(row);
      }
      row.inputVisible = false;
    },
    onShowInput(scope) {
      scope.row.inputVisible = true;
      this.$nextTick(_ => {
        // $nextTick当页面上重新渲染之后才会调用代码 否则inputVisible变成true 但是input还没有渲染完成 $refs就获取不到 会报错
        this.$refs.saveTagInput.$refs.input.focus(); // 自动获取焦点
      });
    },
    onCloseTag(index, scope) {
      let { row } = scope;
      console.log(row, index);
      row.attr_vals.splice(index, 1);
      this.saveAttrValues(row);
    }
  }
};
</script>
<style lang="less" scoped>
.cat_option {
  margin: 15px 0px;
}
.el-form-item__label {
  text-align: left !important;
}
.el-tag {
  margin: 8px;
}
.input-new-tag {
  width: 120px;
}
</style>
