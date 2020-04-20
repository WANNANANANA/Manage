<template>
  <div class="list">
    <Navigator level1="商品管理" level2="商品列表"></Navigator>
    <!-- 卡片视图 -->
    <el-card>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input
            placeholder="请输入内容"
            v-model="queryInfo.query"
            clearable
            @clear="getGoodsList"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="getGoodsList"
            >
            </el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="onGoAddPage">添加商品</el-button>
        </el-col>
      </el-row>
      <!-- table区域 -->
      <el-table :data="goodsList" border stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="商品名称" prop="goods_name"></el-table-column>
        <el-table-column label="商品价格" prop="goods_price" width="80px">
        </el-table-column>
        <el-table-column label="商品重量" prop="goods_weight" width="80px">
        </el-table-column>
        <el-table-column label="创建时间" width="180px">
          <template v-slot="scope">
            {{ scope.row.add_time | dateFormat }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="130px">
          <template v-slot="scope">
            <el-button type="primary" icon="el-icon-edit" size="mini">
            </el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="onDeleteGood(scope.row.goods_id)"
            >
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页区域 -->
      <el-pagination
        @size-change="onHandleSizeChange"
        @current-change="onHandleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[5, 10, 15, 20]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        background
      >
      </el-pagination>
    </el-card>
  </div>
</template>

<script>
import Navigator from "../pubilc/Navigator";

export default {
  name: "list",
  components: { Navigator },
  created() {
    this.getGoodsList();
  },
  data() {
    return {
      queryInfo: {
        query: "",
        pagenum: 1,
        pagesize: 5
      },
      goodsList: [],
      total: 0
    };
  },
  methods: {
    // 根据分页获取商品列表
    async getGoodsList() {
      let { data } = await this.$axios.get("goods", {
        params: this.queryInfo
      });
      if (data.meta.status == 200) {
        // console.log(data.data);
        this.$message({
          message: "获取商品列表成功",
          type: "success"
        });
        this.goodsList = data.data.goods;
        this.total = data.data.total;
      } else {
        this.$message({
          message: "获取商品列表失败",
          type: "error"
        });
      }
    },
    onHandleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize;
      this.getGoodsList();
    },
    onHandleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage;
      this.getGoodsList();
    },
    async onDeleteGood(goods_id) {
      console.log(goods_id);
      let confirmResult = await this.$confirm("是否永久删除该商品", "提示", {
        type: "warning",
        confirmText: "确定",
        cancelText: "取消"
      }).catch(error => error);
      if (confirmResult == "confirm") {
        let { data } = await this.$axios.delete(`goods/${goods_id}`);
        if (data.meta.status == 200) {
          this.$message({
            message: "删除商品成功",
            type: "success"
          });
          this.getGoodsList();
        } else {
          this.$message({
            message: "删除商品失败",
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
    onGoAddPage() {
      this.$router.push('/goods/add');
    }
  }
};
</script>

<style lang="less" scoped>
.el-table,
.el-pagination {
  margin-top: 20px;
}
</style>
