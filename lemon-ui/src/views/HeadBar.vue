<template>
  <div :class="collapse?'position-collapse-left':'position-left'" class="headbar"
       style="background:#FF6666">
    <!-- 导航收缩 -->
    <span class="hamburg">
      <el-menu active-text-color="#FF6666" background-color="#FF6666" class="el-menu-demo" mode="horizontal"
               text-color="#fff">
        <el-menu-item @click="onCollapse" index="1"><hamburger :isActive="collapse"></hamburger></el-menu-item>
      </el-menu>
    </span>
    <!-- 工具栏 -->
    <span class="toolbar">
      <el-menu active-text-color="#14889A" background-color="#14889A" class="el-menu-demo" mode="horizontal"
               text-color="#14889A">
        <el-menu-item index="1">
          <!-- 用户信息 -->
          <span class="user-info"><img :src="user.avatar"/>{{ user.name }}</span>
        </el-menu-item>
      </el-menu>
    </span>
  </div>
</template>

<script>
import {mapState} from 'vuex'
import Hamburger from "@/components/Hamburger"

export default {
  components: {
    Hamburger
  },
  data() {
    return {
      user: {
        name: "Louis",
        avatar: "",
        role: "超级管理员",
        registeInfo: "注册时间：2018-12-20 "
      },
      activeIndex: '1',
      langVisible: false
    }
  },
  methods: {
    selectNavBar(key, keyPath) {
      console.log(key, keyPath)
    },
    // 折叠导航栏
    onCollapse: function () {
      this.$store.commit('onCollapse')
    },
  },
  mounted() {
    var user = sessionStorage.getItem("user")
    if (user) {
      this.user.name = user
      this.user.avatar = require("@/assets/user.png")
    }
  },
  computed: {
    ...mapState({
      collapse: state => state.app.collapse
    })
  }
}
</script>

<style lang="scss" scoped>
.headbar {
  position: fixed;
  top: 0;
  right: 0;
  z-index: 1030;
  height: 60px;
  line-height: 60px;
  border-color: rgba(180, 190, 190, 0.8);
  border-left-width: 1px;
  border-left-style: solid;
}

.hamburg, .navbar {
  float: left;
}

.toolbar {
  float: right;
}

.user-info {
  font-size: 20px;
  color: #fff;
  cursor: pointer;

  img {
    width: 40px;
    height: 40px;
    border-radius: 10px;
    margin: 10px 0px 10px 10px;
    float: right;
  }
}

.position-left {
  left: 200px;
}

.position-collapse-left {
  left: 65px;
}
</style>