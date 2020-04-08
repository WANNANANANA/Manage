<template>
  <div class="categories">
    <Navigator level1="商品管理" level2="商品分类"></Navigator>
    <!-- 卡片视图 -->
    <el-card>
      <el-row>
        <el-button type="primary">添加分类</el-button>
      </el-row>
      <!-- 表格区域 -->
      <el-table
        :data="cateList"
        style="width: 100%;margin-bottom: 20px;"
        row-key="cat_id"
        border
        :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
      >
        <el-table-column type="index" width="50">
          <template v-slot="scope">{{definedIndex(scope)}}</template>
        </el-table-column>
        <el-table-column prop="cat_name" label="分类名称" width="180"></el-table-column>
        <el-table-column prop="cat_deleted" label="是否有效" width="180">
          <el-button type="success" size="mini" icon="el-icon-check" circle></el-button>
        </el-table-column>
        <el-table-column prop="cat_level" label="排序"></el-table-column>
      </el-table>

      <!-- 分页区域 -->
    </el-card>
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
      tableData: [
        {
          id: 1,
          date: "2016-05-02",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄"
        },
        {
          id: 2,
          date: "2016-05-04",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1517 弄"
        },
        {
          id: 3,
          date: "2016-05-01",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1519 弄",
          children: [
            {
              id: 31,
              date: "2016-05-01",
              name: "王小虎",
              address: "上海市普陀区金沙江路 1519 弄",
              children: [
                {
                  id: 311,
                  date: "2016-05-01",
                  name: "王小虎",
                  address: "上海市普陀区金沙江路 1519 弄"
                },
                {
                  id: 312,
                  date: "2016-05-01",
                  name: "王小虎",
                  address: "上海市普陀区金沙江路 1519 弄"
                }
              ]
            },
            {
              id: 32,
              date: "2016-05-01",
              name: "王小虎",
              address: "上海市普陀区金沙江路 1519 弄"
            }
          ]
        },
        {
          id: 4,
          date: "2016-05-03",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1516 弄"
        }
      ]
    };
  },
  computed: {},
  methods: {
    async getCateList() {
      let { data } = await this.$axios.get("categories", {
        params: this.queryInfo
      });
      console.log(data);
      if (data.meta.status == 200) {
        this.cateList = data.data.result;
        this.total = data.data.total;
      } else {
        console.log(data.meta.msg);
        this.$message({
          message: "获取商品分类失败",
          type: "fail"
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
    })()
  }
};
</script>
<style lang="less" scoped>
.el-row {
  margin-bottom: 15px;
}
</style>