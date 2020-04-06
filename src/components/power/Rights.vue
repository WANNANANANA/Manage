<template>
  <div class="rights">
    <!-- navigator封装组件 -->
    <Navigator level1="权限管理" level2="权限列表"></Navigator>
    <!-- 卡片视图 -->
    <el-card>
      <el-table :data="rightsList" stripe border>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="权限名称" prop="authName"></el-table-column>
        <el-table-column label="路径" prop="path"></el-table-column>
        <el-table-column label="权限等级" prop="level">
          <template v-slot="scope">
            <el-tag v-if="scope.row.level === '0'">一级</el-tag>
            <el-tag type="success" v-else-if="scope.row.level === '1'"
              >二级</el-tag
            >
            <el-tag type="warning" v-else>三级</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>
<script>
import Navigator from "../pubilc/Navigator";

export default {
  name: "Rights",
  components: { Navigator },
  created() {
    this.getRightsList();
  },
  data() {
    return {
      rightsList: []
    };
  },
  methods: {
    async getRightsList() {
      let { data } = await this.$axios.get("rights/list");
      if (data.meta.status == 200) {
        this.rightsList = data.data;
      } else {
        this.$message({
          message: "获取权限列表失败",
          type: "fail"
        });
      }
    }
  }
};
</script>
<style lang="less" scoped></style>
