<template>
  <div class="add-goods">
    <Navigator level1="商品管理" level2="添加商品"></Navigator>
    <!-- 卡片视图 -->
    <el-card>
      <!-- 提示区域 -->
      <el-alert
        title="添加商品信息"
        type="info"
        center
        show-icon
        :closeable="false"
      >
      </el-alert>
      <!-- 步骤条 -->
      <el-steps
        :space="200"
        :active="activeIndex - 0"
        finish-status="success"
        align-center
      >
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>
      <!-- tab栏区域 -->
      <el-form
        :model="addForm"
        :rules="addFormRules"
        ref="addFormRef"
        label-width="100px"
        label-position="top"
      >
        <el-tabs
          tab-position="left"
          v-model="activeIndex"
          :before-leave="onBeforeTabLeave"
          @tab-click="onTabClick"
        >
          <el-tab-pane label="基本信息" name="0">
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="addForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
              <el-input v-model="addForm.goods_price" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight">
              <el-input v-model="addForm.goods_weight" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number">
              <el-input v-model="addForm.goods_number" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品分类" prop="goods_cat">
              <el-cascader
                v-model="addForm.goods_cat"
                :options="categories"
                :props="cateProps"
                @change="onHandleChange"
              ></el-cascader>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品参数" name="1">
            <el-form-item
              :label="item.attr_name"
              v-for="(item, index) in manyList"
              :key="index"
            >
              <!-- 复选框组 -->
              <el-checkbox-group v-model="item.attr_vals">
                <el-checkbox
                  border
                  v-for="(name, i) in item.attr_vals"
                  :key="i"
                  :label="name"
                ></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品属性" name="2">
            <el-form-item
              :label="item.attr_name"
              v-for="(item, index) in onlyList"
              :key="index"
            >
              <el-input v-model="item.attr_vals"></el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品图片" name="3">
            <!-- action 表示要上传到的后台地址 -->
            <el-upload
              :action="uploadUrl"
              :on-preview="onHandlePreview"
              :on-remove="onHandleRemove"
              list-type="picture"
              :headers="headersObj"
              :on-success="onHandleSuccess"
            >
              <el-button size="small" type="primary">点击上传</el-button>
            </el-upload>
          </el-tab-pane>
          <el-tab-pane label="商品内容" name="4">
            <quill-editor
              ref="myQuillEditor"
              v-model="addForm.goods_introduce"
            />
            <el-button type="primary" class="addBtn" @click="onAddGoods"
              >添加商品</el-button
            >
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>
    <!-- 图片预览 -->
    <el-dialog title="图片预览" :visible.sync="previewVisible" width="50%">
      <img :src="previewPic" class="preview-img" />
    </el-dialog>
  </div>
</template>
<script>
import Navigator from "../pubilc/Navigator";
import _ from "lodash";

export default {
  name: "Add",
  components: { Navigator },
  created() {
    this.getCategories();
  },
  data() {
    let validateNum = (rule, value, callback) => {
      // console.log(value, typeof(value));
      if(value == 0) {
        callback(new Error('请输入大于0的数字'));
      }
    }
    return {
      activeIndex: 0,
      addForm: {
        goods_name: "",
        goods_price: 1,
        goods_weight: 1,
        goods_number: 1,
        goods_cat: "",
        pics: [],
        goods_introduce: "",
        attrs: []
      },
      addFormRules: {
        goods_name: [
          { required: true, message: "请输入商品名称", trigger: "blur" }
        ],
        goods_price: [
          { required: true, message: "请输入商品价格", trigger: "blur" },
          { validator: validateNum, trigger: 'blur'}
        ],
        goods_weight: [
          { required: true, message: "请输入商品重量", trigger: "blur" },
          { validator: validateNum, trigger: 'blur'}
        ],
        goods_number: [
          { required: true, message: "请输入商品数量", trigger: "blur" },
          { validator: validateNum, trigger: 'blur'}
        ],
        goods_cat: [
          { required: true, message: "请选择商品分类", trigger: "blur" }
        ]
      },
      categories: [], // 商品分类数组
      cateProps: {
        label: "cat_name",
        value: "cat_id",
        children: "children"
      },
      manyList: [], // 动态参数列表
      onlyList: [], // 静态参数列表
      uploadUrl: "http://timemeetyou.com:8889/api/private/v1/upload",
      headersObj: {
        // 图片上传的请求头
        Authorization: window.sessionStorage.getItem("token")
      },
      previewPic: "",
      previewVisible: false
    };
  },
  computed: {
    cateId() {
      if (this.addForm.goods_cat.length == 3) {
        return this.addForm.goods_cat[2];
      } else {
        return null;
      }
    }
  },
  methods: {
    async getCategories() {
      let { data } = await this.$axios("categories");
      if (data.meta.status == 200) {
        this.categories = data.data;
        console.log(this.categories);
      } else {
        console.log(data.meta);
        this.$message({
          message: "获取商品列表失败",
          type: "error"
        });
      }
    },
    onHandleChange() {
      if (this.addForm.goods_cat.length != 3) {
        // 控制只能选择第三级分类
        this.addForm.goods_cat = [];
      }
    },
    onBeforeTabLeave(activeName, oldActiveName) {
      // 标签页切换时的钩子
      // console.log(activeName, oldActiveName);
      if (oldActiveName == 0 && this.addForm.goods_cat.length != 3) {
        // 如果没有选择商品分类 则不允许切换
        this.$message({
          message: "请先选择商品分类",
          type: "error"
        });
        return false; // return false会阻止标签页的切换
      }
    },
    async onTabClick() {
      console.log(this.activeIndex);
      // 访问动态参数面板
      if (this.activeIndex == "1") {
        let { data } = await this.$axios.get(
          `categories/${this.cateId}/attributes`,
          {
            params: { sel: "many" }
          }
        );
        if (data.meta.status == 200) {
          data.data.forEach(item => {
            item.attr_vals =
              item.attr_vals == "" ? [] : item.attr_vals.split(",");
          });
          console.log(data);
          this.manyList = data.data;
        } else {
          console.log(data.meta);
          this.$message({
            message: "获取动态参数失败",
            type: "error"
          });
        }
      } else if (this.activeIndex == "2") {
        // 访问静态属性面板
        let { data } = await this.$axios.get(
          `categories/${this.cateId}/attributes`,
          {
            params: { sel: "only" }
          }
        );
        if (data.meta.status == 200) {
          console.log(data.data);
          this.onlyList = data.data;
        } else {
          console.log(data.meta);
          this.$message({
            message: "获取静态属性失败",
            type: "error"
          });
        }
      }
    },
    onHandlePreview(file) {
      // 处理图片预览效果
      console.log(file);
      this.previewPic = file.response.data.url;
      this.previewVisible = true;
    },
    onHandleRemove(file) {
      // 处理移除图片
      console.log(file);
      let path = file.response.data.tmp_path;
      let index = this.addForm.pics.findIndex(item => {
        return (item.pic = path);
      });
      this.addForm.pics.splice(index, 1);
      console.log(this.addForm);
    },
    onHandleSuccess(response) {
      // 监听服务器上传成功的事件
      console.log(response);
      let picObj = { pic: response.data.tmp_path };
      this.addForm.pics.push(picObj);
      console.log(this.addForm);
    },
    onAddGoods() {
      this.$refs.addFormRef.validate(async valid => {
        if (valid) {
          // console.log(this.addForm);
          let cloneAddForm = _.cloneDeep(this.addForm);
          cloneAddForm.goods_cat = cloneAddForm.goods_cat.join(",");
          // 处理动态参数和静态属性
          this.manyList.forEach(item => {
            let newInfo = {
              attr_id: item.attr_id,
              attr_value: item.attr_vals.join(' ')
            };
            this.addForm.attrs.push(newInfo);
          });
          this.onlyList.forEach(item => {
            console.log(item);
            let newInfo = {
              attr_id: item.attr_id,
              attr_value: item.attr_vals.join(' ')
            }
            this.addForm.attrs.push(newInfo);
          })
          cloneAddForm.attrs = this.addForm.attrs;
          console.log(cloneAddForm);

          // 发送请求
          let {data}  = await this.$axios.post('goods', cloneAddForm);
          if(data.meta.status == 201) {
              this.$message({
                message: '添加商品成功',
                type: 'success',
                onClose: () => {
                  this.$router.push('/goods');
                }
              })
          } else {
          console.log(data.meta);
            this.$message({
              message: "添加商品失败",
              type: 'error'
            })
          }
        } else {
          this.$message({
            message: "请填写必要的表单项",
            type: "error"
          });
        }
      });
    }
  }
};
</script>

<style lang="less" scoped>
.el-steps {
  margin: 15px 0px;
}
.el-checkbox {
  margin: 0px 10px 0px 0px !important;
}
.preview-img {
  width: 100%;
}
.addBtn {
  margin-top: 15px;
}
// 以下样式不生效 除非去掉scoped 不是很明白？为什么上述样式可以 下面的不行？？？
// 目前我将其写在了reset.css中
// .el-step__title {
//   font-size: 13px !important;
// }
// .ql-editor {
//   min-height: 300px;
// }
</style>
