<template>
  <div class="order">
    <Navigator level1="订单管理" level2="订单列表"></Navigator>
    <!-- 卡片视图 -->
    <el-card>
      <el-row>
        <el-col :span="8">
          <el-input icon="el-icon-search"> </el-input>
        </el-col>
      </el-row>

      <el-table :data="orderlist" border stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="订单编号" prop="order_number" width="220px">
        </el-table-column>
        <el-table-column label="订单价格" prop="order_price" width="80px">
        </el-table-column>
        <el-table-column label="是否付款" v-slot="scope" width="80px">
          <template>
            <el-tag type="success" v-if="scope.row.pay_status == '1'">
              已付款
            </el-tag>
            <el-tag type="danger" v-else>未付款</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="是否发货" prop="is_send" width="80px">
        </el-table-column>
        <el-table-column label="下单时间">
          <template v-slot="scope">
            {{ scope.row.create_time | dateFormat }}
          </template>
        </el-table-column>
        <el-table-column label="操作" v-slot="scope">
          <template>
            <el-button
              icon="el-icon-edit"
              size="mini"
              type="primary"
              @click="onEditAddress(scope)"
            >
            </el-button>
            <el-button
              icon="el-icon-location"
              size="mini"
              type="success"
              @click="onShowProgress(scope)"
            >
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页区域 -->
      <el-pagination
        @size-change="onHandlSizeChange"
        @current-change="onHandleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[5, 10, 15, 20]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>

      <!-- 修改地址对话框 -->
      <el-dialog
        title="修改地址"
        :visible.sync="addressVisible"
        width="50%"
        @close="onEditDialogClose"
      >
        <el-form
          :model="addressForm"
          ref="addressFormRef"
          :rules="addressFormRules"
          label-width="100px"
        >
          <el-form-item label="省市区/县" prop="address1">
            <el-cascader :options="cityOptions" v-model="addressForm.address1">
            </el-cascader>
          </el-form-item>
          <el-form-item label="详细地址" prop="address2">
            <el-input v-model="addressForm.address2"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer">
          <el-button @click="onEditAddressConfirm">确定</el-button>
          <el-button @click="onEditAddressCancel">取消</el-button>
        </span>
      </el-dialog>

      <!-- 显示物流对话框 -->
      <el-dialog title="物流状态" :visible.sync="progressVisible" width="50%">
        <el-timeline>
          <el-timeline-item
            v-for="(activity, index) in progressInfo"
            :key="index"
            :timestamp="activity.time"
          >
            {{ activity.context }}
          </el-timeline-item>
        </el-timeline>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
import Navigator from "../pubilc/Navigator";
import cityOptions from "@/assets/js/city_data.js";

export default {
  name: "Order",
  components: { Navigator },
  created() {
    this.getOrderList();
  },
  data() {
    return {
      queryInfo: {
        query: "",
        pagenum: 1,
        pagesize: 10
      },
      total: 0,
      orderlist: [],
      addressVisible: false,
      cityOptions,
      addressForm: {
        address1: "",
        address2: ""
      },
      addressFormRules: {
        address1: [
          { required: true, message: "请选择省市区", trigger: "blur" }
        ],
        address2: [
          { required: true, message: "请填写详细地址", trigger: "blur" }
        ]
      },
      progressVisible: false,
      progressInfo: []
    };
  },
  methods: {
    async getOrderList() {
      let { data } = await this.$axios.get("orders", {
        params: this.queryInfo
      });
      if (data.meta.status == 200) {
        console.log(data.data);
        this.total = data.data.total;
        this.orderlist = data.data.goods;
      } else {
        console.log(data.meta);
        this.$message({
          message: "获取订单失败",
          type: "error"
        });
      }
    },
    onHandlSizeChange(newSize) {
      this.queryInfo.pagesize = newSize;
      this.getOrderList();
    },
    onHandleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage;
      this.getOrderList();
    },
    onEditAddress(scope) {
      this.addressVisible = true;
    },
    onEditDialogClose() {
      this.$refs.addressFormRef.resetFields();
    },
    onEditAddressConfirm() {},
    onEditAddressCancel() {
      this.addressVisible = false;
    },
    async onShowProgress() {
      let { data } = await this.$axios.get("/kuaidi/1106975712662");
      if (data.meta.status == 200) {
        console.log(data.data);
        this.progressInfo = data.data;
      } else {
        console.log(data.meta);
        this.$message({
          message: "获取物流状态失败",
          type: "error"
        });
      }
      this.progressVisible = true;
    }
  }
};
</script>
<style lang="less" scoped>
.el-pagination {
    margin-top: 20px;
}
.el-cascader {
  width: 100%;
}
</style>
