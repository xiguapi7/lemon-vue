<template>
  <el-form :model="loginForm" :rules="fieldRules" class="demo-ruleForm login-container" label-position="left"
           label-width="0px"
           ref="loginForm">
    <span class="tool-bar">
    </span>
    <h2 class="title" style="padding-left:22px;">系统登录</h2>
    <el-form-item prop="account">
      <el-input auto-complete="off" placeholder="账号" type="text" v-model="loginForm.account"></el-input>
    </el-form-item>
    <el-form-item prop="password">
      <el-input auto-complete="off" placeholder="密码" type="password" v-model="loginForm.password"></el-input>
    </el-form-item>
    <el-form-item>
      <el-col :span="12">
        <el-form-item prop="captcha">
          <el-input auto-complete="off" placeholder="验证码, 单击图片刷新" style="width: 100%;" type="test"
                    v-model="loginForm.captcha">
          </el-input>
        </el-form-item>
      </el-col>
      <el-col :span="1" class="line">&nbsp;</el-col>
      <el-col :span="11">
        <el-form-item>
          <img :src="loginForm.src" @click="refreshCaptcha" class="pointer" style="width: 100%;">
        </el-form-item>
      </el-col>
    </el-form-item>
    <el-form-item style="width:100%;">
      <el-button @click.native.prevent="reset" style="width:48%;" type="primary">重 置</el-button>
      <el-button :loading="loading" @click.native.prevent="login" style="width:48%;" type="primary">登 录</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import Cookies from "js-cookie"

export default {
  name: 'Login',
  data() {
    return {
      loading: false,
      loginForm: {
        account: 'admin',
        password: 'admin',
        captcha: '',
        src: ''
      },
      fieldRules: {
        account: [
          {required: true, message: '请输入账号', trigger: 'blur'}
        ],
        password: [
          {required: true, message: '请输入密码', trigger: 'blur'}
        ]
      },
      checked: true
    }
  },
  methods: {
    login() {
      this.loading = true
      let userInfo = {
        account: this.loginForm.account, password: this.loginForm.password,
        captcha: this.loginForm.captcha
      }
      this.$api.login.login(userInfo).then((res) => {  // 调用登录接口
        if (res.msg != null) {
          this.$message({message: res.msg, type: 'error'})
        } else {
          Cookies.set('token', res.data.token) // 放置token到Cookie
          sessionStorage.setItem('user', userInfo.account) // 保存用户到本地会话
          this.$router.push('/')  // 登录成功，跳转到主页
        }
        this.loading = false
      }).catch((res) => {
        this.$message({message: res.message, type: 'error'})
      })
    },
    refreshCaptcha: function () {
      this.loginForm.src = this.global.baseUrl + "/captcha.jpg?t=" + new Date().getTime();
    },
    reset() {
      this.$refs.loginForm.resetFields()
    }
  },
  mounted() {
    this.refreshCaptcha()
  }
}
</script>

<style lang="scss" scoped>
.login-container {
  -webkit-border-radius: 5px;
  border-radius: 5px;
  -moz-border-radius: 5px;
  background-clip: padding-box;
  margin: 100px auto;
  width: 350px;
  padding: 35px 35px 15px 35px;
  background: #fff;
  border: 1px solid #eaeaea;
  box-shadow: 0 0 25px #cac6c6;

  .title {
    margin: 0px auto 30px auto;
    text-align: center;
    color: #505458;
  }
}
</style>
<template>
  <el-form :model="loginForm" :rules="fieldRules" class="demo-ruleForm login-container" label-position="left"
           label-width="0px"
           ref="loginForm">
    <span class="tool-bar">
    </span>
    <h2 class="title" style="padding-left:22px;">系统登录</h2>
    <el-form-item prop="account">
      <el-input auto-complete="off" placeholder="账号" type="text" v-model="loginForm.account"></el-input>
    </el-form-item>
    <el-form-item prop="password">
      <el-input auto-complete="off" placeholder="密码" type="password" v-model="loginForm.password"></el-input>
    </el-form-item>
    <el-form-item>
      <el-col :span="12">
        <el-form-item prop="captcha">
          <el-input auto-complete="off" placeholder="验证码, 单击图片刷新" style="width: 100%;" type="test"
                    v-model="loginForm.captcha">
          </el-input>
        </el-form-item>
      </el-col>
      <el-col :span="1" class="line">&nbsp;</el-col>
      <el-col :span="11">
        <el-form-item>
          <img :src="loginForm.src" @click="refreshCaptcha" class="pointer" style="width: 100%;">
        </el-form-item>
      </el-col>
    </el-form-item>
    <el-form-item style="width:100%;">
      <el-button @click.native.prevent="reset" style="width:48%;" type="primary">重 置</el-button>
      <el-button :loading="loading" @click.native.prevent="login" style="width:48%;" type="primary">登 录</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import Cookies from "js-cookie"

export default {
  name: 'Login',
  data() {
    return {
      loading: false,
      loginForm: {
        account: 'admin',
        password: 'admin',
        captcha: '',
        src: ''
      },
      fieldRules: {
        account: [
          {required: true, message: '请输入账号', trigger: 'blur'}
        ],
        password: [
          {required: true, message: '请输入密码', trigger: 'blur'}
        ]
      },
      checked: true
    }
  },
  methods: {
    login() {
      this.loading = true
      let userInfo = {
        account: this.loginForm.account, password: this.loginForm.password,
        captcha: this.loginForm.captcha
      }
      this.$api.login.login(userInfo).then((res) => {  // 调用登录接口
        if (res.msg != null) {
          this.$message({message: res.msg, type: 'error'})
        } else {
          Cookies.set('token', res.data.token) // 放置token到Cookie
          sessionStorage.setItem('user', userInfo.account) // 保存用户到本地会话
          this.$router.push('/')  // 登录成功，跳转到主页
        }
        this.loading = false
      }).catch((res) => {
        this.$message({message: res.message, type: 'error'})
      })
    },
    refreshCaptcha: function () {
      this.loginForm.src = this.global.baseUrl + "/captcha.jpg?t=" + new Date().getTime();
    },
    reset() {
      this.$refs.loginForm.resetFields()
    }
  },
  mounted() {
    this.refreshCaptcha()
  }
}
</script>

<style lang="scss" scoped>
.login-container {
  -webkit-border-radius: 5px;
  border-radius: 5px;
  -moz-border-radius: 5px;
  background-clip: padding-box;
  margin: 100px auto;
  width: 350px;
  padding: 35px 35px 15px 35px;
  background: #fff;
  border: 1px solid #eaeaea;
  box-shadow: 0 0 25px #cac6c6;

  .title {
    margin: 0px auto 30px auto;
    text-align: center;
    color: #505458;
  }
}
</style>