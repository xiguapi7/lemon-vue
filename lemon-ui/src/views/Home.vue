<template>
  <div class="page">
    <h2>Home Page</h2>
    <el-button @click="testAxios()" type="primary">测试Axios调用</el-button>
    <el-button @click="getUser()" type="primary">获取用户信息</el-button>
    <el-button @click="getMenu()" type="primary">获取菜单信息</el-button>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'Home',
  methods: {
    testAxios() {
      axios.get('http://localhost:8080').then(res => {
        alert(res.data)
      })
    },
    getUser() {
      axios.get('http://localhost:8080/user').then(res => {
        alert(JSON.stringify(res.data))
      })
    },
    getMenu() {
      axios.get('http://localhost:8080/menu').then(res => {
        alert(JSON.stringify(res.data))
      })
    }
  }
}
</script>