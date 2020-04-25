<template>
  <div class="report">
    <Navigator level1="数据统计" level2="数据报表"></Navigator>
    <!-- 卡片视图 -->
    <el-card>
      <div id="echarts" style="width: 600px;height:400px;"></div>
    </el-card>
  </div>
</template>

<script>
import Navigator from "../pubilc/Navigator";
import echarts from "echarts";

export default {
  name: "Report",
  components: { Navigator },
  async mounted() {
    // 基于准备好的dom，初始化echarts实例
    var myChart = echarts.init(document.getElementById("echarts"));

    // 指定图表的配置项和数据
    let { data } = await this.$axios.get("reports/type/1");
    if (data.meta.status == 200) {
      // 使用刚指定的配置项和数据显示图表
      myChart.setOption({...this.options, ...data.data });
    } else {
      this.$message({
        message: "获取数据失败",
        type: "error"
      });
    }
  },
  data() {
    return {
      // 需要合并的数据
      options: {
        title: {
          text: "用户来源"
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "cross",
            label: {
              backgroundColor: "#E9EEF3"
            }
          }
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true
        },
        xAxis: [
          {
            boundaryGap: false
          }
        ],
        yAxis: [
          {
            type: "value"
          }
        ]
      }
    };
  }
};
</script>

<style lang="less" scoped></style>
