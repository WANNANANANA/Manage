<template>
  <div class="home">
    <el-container class="home-container">
      <!-- 顶部导航栏 -->
      <el-header>
        <div>
          <img src="../assets/logo.png" alt="" />
          <span>后台管理系统</span>
        </div>
        <el-button type="info" @click="logout">退出</el-button>
      </el-header>

      <el-container>
        <!-- 侧边栏 -->
        <el-aside :width="collapseKey ? '64px' : '200px'">
          <div class="toggle-button" @click="toggleCollapse">|||</div>
          <el-menu
            :default-active="$route.path"
            class="el-menu-vertical-demo"
            background-color="#373d41"
            text-color="#fff"
            active-text-color="#409EFF"
            unique-opened
            :collapse="collapseKey"
            :collapse-transition="false"
            router
          >
            <el-submenu
              :index="item.id + ''"
              v-for="item in menuList"
              :key="item.id"
            >
              <template slot="title">
                <i :class="iconObj[item.id]"></i>
                <span>{{ item.authName }}</span>
              </template>
              <el-menu-item
                :index="'/' + subItem.path"
                v-for="subItem in item.children"
                :key="subItem.id"
              >
                <template slot="title">
                  <i class="el-icon-menu"></i>
                  <span>{{ subItem.authName }}</span>
                </template>
              </el-menu-item>
            </el-submenu>
          </el-menu>
        </el-aside>
        <!-- 主体内容区域 -->
        <el-main>
          <router-view />
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>
<script>
export default {
  name: "Home",
  data() {
    return {
      menuList: "",
      iconObj: {
        "125": "el-icon-s-home",
        "101": "el-icon-s-shop",
        "102": "el-icon-s-marketing",
        "103": "el-icon-s-custom",
        "145": "el-icon-s-data"
      },
      collapseKey: false
    };
  },
  created() {
    this.getMenuList();
  },
  methods: {
    async getMenuList() {
      const { data } = await this.$axios.get("menus");
    //   console.log(data);
      if (data.meta.status == 200) {
        this.menuList = data.data;
      } else {
        console.log(data.meta.msg);
      }
    },
    toggleCollapse() {
      this.collapseKey = !this.collapseKey;
    },
    logout() {
      sessionStorage.clear();
      this.$router.push("/login");
    }
  }
};
</script>
<style lang="less" scoped>
@import "../assets/style/basis.less";
.home {
  .boxSet();
  .home-container {
    .boxSet();
    .el-header {
      display: flex;
      justify-content: space-between;
      padding-left: 0px;
      align-items: center;
      background-color: @blueBg2;
      font-size: 20px;
      color: #fff;
      div {
        display: flex;
        align-items: center;
        height: 100%;
        img {
          height: 100%;
        }
      }
    }
    .el-aside {
      transition: all linear 0.2s;
      background-color: @blueBg2;
      .toggle-button {
        line-height: 24px;
        background-color: @blueBg3;
        color: #fff;
        text-align: center;
        cursor: pointer;
        letter-spacing: 0.2em;
      }
      .el-menu {
        border-right: none;
      }
    }
    main {
      background-color: #eaedf1;
    }
  }
}
</style>
