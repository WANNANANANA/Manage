<template>
  <div class="categories">
    <Navigator level1="商品管理" level2="商品分类"></Navigator>
    <!-- 卡片视图 -->
    <el-card>
      <el-row>
        <el-button type="primary" @click="onAddCategoty">添加分类</el-button>
      </el-row>
      <!-- 表格区域 -->
      <el-table
        :data="cateList"
        style="width: 100%;margin-bottom: 20px;"
        row-key="cat_id"
        border
        :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
      >
        <el-table-column type="index" width="50">
          <!-- <template v-slot="scope">{{definedIndex(scope)}}</template> -->
        </el-table-column>
        <el-table-column
          prop="cat_name"
          label="分类名称"
          width="180"
        ></el-table-column>
        <el-table-column prop="cat_deleted" label="是否有效" width="180">
          <template v-slot="scope">
            <i
              class="el-icon-success"
              v-if="scope.row.cat_deleted === false"
              style="color: #3a8ee6"
            ></i>
            <i class="el-icon-error" v-else></i>
          </template>
        </el-table-column>
        <el-table-column prop="cat_level" label="排序">
          <template v-slot="scope">
            <el-tag size="mini" v-if="scope.row.cat_level == 0">一级</el-tag>
            <el-tag
              type="success"
              size="mini"
              v-else-if="scope.row.cat_level == 1"
              >二级</el-tag
            >
            <el-tag type="warning" size="mini" v-else>三级</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200px">
          <template v-slot="scope">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="onEditCategory(scope)"
              >编辑</el-button
            >
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="onDeleteCategory(scope)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页区域 -->
      <el-pagination
        @size-change="onSizeChange"
        @current-change="onCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[3, 5, 10, 15]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>
    <!-- 添加分类的对话框 -->
    <el-dialog
      title="添加分类"
      :visible.sync="addDialogVisible"
      width="50%"
      @close="onCloseAddDialog"
    >
      <el-form
        :model="addCategoryForm"
        :rules="addCategoryFormRules"
        ref="addCate"
      >
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="addCategoryForm.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类">
          <el-cascader
            v-model="selectedKeys"
            :options="parentCateList"
            :props="cateProps"
            @change="onParentCateChanged"
            clearable
          ></el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="onAddSubmitCancel">取 消</el-button>
        <el-button type="primary" @click="onAddSubmitConfirm">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 编辑分类的对话框 -->
    <el-dialog
      title="编辑分类"
      :visible.sync="editDialogVisible"
      width="50%"
      @close="onCloseEditDialog"
    >
      <el-form
        :model="editCategoryForm"
        :rules="editCategoryFormRules"
        ref="editCate"
      >
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="editCategoryForm.cat_name" clearable></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="onEditSubmitCancel">取 消</el-button>
        <el-button type="primary" @click="onEditSubmitConfirm">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import Navigator from "../pubilc/Navigator";

export default {
  name: "Categories",
  components: { Navigator },
  created() {
    this.getCateList();
  },
  data() {
    return {
      // 商品分类的请求参数
      queryInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 5
      },
      cateList: [],
      total: 0,
      addDialogVisible: false,
      parentCateList: [],
      addCategoryForm: {
        cat_name: "",
        cat_pid: 0,
        cat_level: 0
      },
      addCategoryFormRules: {
        cat_name: [
          { required: true, message: "请输入分类名称", trigger: "blur" }
        ]
      },
      cateProps: {
        // 级联选择器的配置选项
        checkStrictly: true,
        expandTrigger: "hover",
        value: "cat_id",
        label: "cat_name",
        children: "children"
      },
      selectedKeys: [],
      editDialogVisible: false,
      editCategoryForm: {
        cat_id: "",
        cat_name: ""
      },
      editCategoryFormRules: {
        cat_name: [
          { required: true, message: "分类名称不能为空", trigger: "blur" }
        ]
      }
    };
  },
  computed: {},
  methods: {
    async getCateList() {
      let { data } = await this.$axios.get("categories", {
        params: this.queryInfo
      });
      // console.log(data);
      if (data.meta.status == 200) {
        this.cateList = data.data.result;
        this.total = data.data.total;
      } else {
        console.log(data.meta.msg);
        this.$message({
          message: "获取商品分类失败",
          type: "error"
        });
      }
    },
    definedIndex: (function() {
      let index = 0;
      return function(scope) {
        let {
          row: { cat_level }
        } = scope;
        if (cat_level == 0) {
          console.log(scope);
          return ++index;
        }
      };
    })(),
    onSizeChange(newSize) {
      this.queryInfo.pagesize = newSize;
      this.getCateList();
    },
    onCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage;
      this.getCateList();
    },
    onAddCategoty() {
      this.getParentCateList();
      this.addDialogVisible = true;
    },
    async getParentCateList() {
      let { data } = await this.$axios("categories", {
        params: {
          type: 2
        }
      });
      if (data.meta.status == 200) {
        console.log(data);
        this.parentCateList = data.data;
      } else {
        this.$message({
          type: "error",
          message: "获取数据失败"
        });
      }
    },
    onParentCateChanged() {
      // console.log(this.selectedKeys);
      let length = this.selectedKeys.length;
      if (length) {
        // 如果长度不为0 说明选择了分类
        this.addCategoryForm.cat_pid = this.selectedKeys[length - 1]; // 选中的父级ID
        this.addCategoryForm.cat_level = length; // 分类级别
      } else {
        // 问题：为什么这里都要重置为0???
        this.addCategoryForm.cat_pid = 0;
        this.addCategoryForm.cat_level = 0;
      }
    },
    onCloseAddDialog() {
      this.$refs.addCate.resetFields();
      this.selectedKeys = [];
      this.addCategoryForm.cat_level = 0;
      this.addCategoryForm.cat_pid = 0;
    },
    onAddSubmitCancel() {
      this.addDialogVisible = false;
    },
    onAddSubmitConfirm() {
      // console.log(this.addCategoryForm);
      this.$refs.addCate.validate(async valid => {
        if (valid) {
          let { data } = await this.$axios.post(
            "categories",
            this.addCategoryForm
          );
          if (data.meta.status == 201) {
            this.$message({
              message: "添加分类成功",
              type: "success"
            });
            this.addDialogVisible = false;
          } else {
            this.$message({
              message: "添加分类失败",
              type: "error"
            });
          }
        }
      });
    },
    async onEditCategory(scope) {
      let {
        row: { cat_id }
      } = scope;
      let { data } = await this.$axios.get(`categories/${cat_id}`);
      console.log(data);
      if (data.meta.status == 200) {
        this.editCategoryForm.cat_id = data.data.cat_id;
        this.editCategoryForm.cat_name = data.data.cat_name;
        this.editDialogVisible = true;
      } else {
        console.log(data.meta.msg);
        this.$message({
          message: "获取商品分类信息失败",
          type: "error"
        });
      }
    },
    onCloseEditDialog() {
      this.$refs.editCate.resetFields();
    },
    onEditSubmitCancel() {
      this.editDialogVisible = false;
    },
    onEditSubmitConfirm() {
      this.$refs.editCate.validate(async valid => {
        if (valid) {
          let { cat_id, cat_name } = this.editCategoryForm;
          let { data } = await this.$axios.put(`categories/${cat_id}`, {
            cat_name
          });
          if (data.meta.status == 200) {
            this.getCateList();
            this.$message({
              message: "更新成功",
              type: "success"
            });
            this.editDialogVisible = false;
          } else {
            console.log(data.meta);
            this.$message({
              message: "更新失败",
              type: "error"
            });
          }
        }
      });
    },
    async onDeleteCategory(scope) {
      let {
        row: { cat_id }
      } = scope;
      let confirmResult = await this.$confirm(
        "确定要永久删除此分类吗？",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      ).catch(error => error);
      if (confirmResult == "confirm") {
        let { data } = await this.$axios.delete(`categories/${cat_id}`);
        if (data.meta.status == 200) {
          this.getCateList();
          this.$message({
            message: "删除分类成功",
            type: "success"
          });
        } else {
          this.$message({
            message: "删除分类失败",
            type: "error"
          });
        }
      } else {
        this.$message({
          message: "已取消删除操作",
          type: "info"
        });
      }
    }
  }
};
</script>
<style lang="less" scoped>
.el-row {
  margin-bottom: 15px;
}

.el-form-item {
  &:last-child {
    text-align: right;
  }
}

.el-cascader {
  width: 100%;
}
</style>
