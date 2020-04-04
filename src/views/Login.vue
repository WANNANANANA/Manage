<template>
  <div class="login">
    <div class="login-box">
      <!-- 头像区域 -->
      <div class="avatar">
        <img src="../assets/logo.png" alt="" />
      </div>
      <!-- 登陆表单区域 -->
      <el-form ref="loginFormRef" :model="loginForm" :rules="loginRules">
        <el-form-item prop="username">
          <el-input
            v-model="loginForm.username"
            prefix-icon="iconfont icon-zhanghao"
          ></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            v-model="loginForm.password"
            show-password
            prefix-icon="iconfont icon-zhanghaoanquan"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onLogin('loginFormRef')"
            >登陆</el-button
          >
          <el-button @click="onReset('loginFormRef')">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
export default {
  name: "Login",
  data() {
    return {
      loginForm: {
        username: "admin",
        password: "123456"
      },
      loginRules: {
        // 这里的key值要和表单绑定的key值相同
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" }
        ],
        password: [{ required: true, message: "请输入密码", trigger: "blur" }]
      }
    };
  },
  methods: {
    onLogin(name) {
      this.$refs[name].validate(async val => {
        if (val) {
          let { data } = await this.$axios.post("login", this.loginForm);
          console.log(data);
          if (data.meta.status == 200) {
            this.$message({
                message: '登陆成功',
                type: 'success',
                onClose: () => {
                    this.$router.push('/home');
                }
            });
            window.sessionStorage.setItem("token", data.data.token);
          } else {
            this.$message.error("用户名或密码错误");
          }
        }
      });
    },
    onReset(name) {
      // console.log(this); // 可以查看this.$refs查看到每一个form的ref名
      this.$refs[name].resetFields();
    }
  }
};
</script>
<style lang="less" scoped>
@import "../assets/style/basis.less";

.login {
  position: relative;
  .boxSet();
  background-color: @blueBg;
  .login-box {
    .absolute();
    .boxSet(450px, 300px);
    background-color: #fff;
    border-radius: 3px;
    .avatar {
      .absolute(@top: 0);
      .boxSet(120px, 120px);
      padding: 10px;
      border: 1px solid #eee;
      border-radius: 50%;
      background-color: #fff;
      img {
        .boxSet();
        background-color: #eee;
        border-radius: 50%;
      }
    }
    form {
      position: absolute;
      bottom: 0px;
      width: 100%;
      padding: 0px 20px;
      .el-form-item {
        text-align: right;
      }
    }
  }
}
</style>
