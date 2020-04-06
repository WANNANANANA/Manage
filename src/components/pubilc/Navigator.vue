<template>
  <div class="navigator">
    <!-- 面包屑 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>{{ level1 }}</el-breadcrumb-item>
      <el-breadcrumb-item>{{ level2 }}</el-breadcrumb-item>
    </el-breadcrumb>
  </div>
</template>
<script>
export default {
  name: "Navigator",
  props: {
    level1: {
      type: String,
      required: true
    },
    level2: {
      type: String,
      required: true
    }
  }
};
</script>
<style lang="less" scoped>
.navigator {
  margin-bottom: 15px;
}
</style>
