<template>
  <el-submenu :index="'' + menu.id" v-if="menu.children && menu.children.length >= 1">
    <template slot="title">
      <i :class="menu.icon"></i>
      <span slot="title">{{ menu.name }}</span>
    </template>
    <MenuTree :key="item.id" :menu="item" v-for="item in menu.children"></MenuTree>
  </el-submenu>
  <el-menu-item :index="'' + menu.id" @click="handleRoute(menu)" v-else>
    <i :class="menu.icon"></i>
    <span slot="title">{{ menu.name }}</span>
  </el-menu-item>
</template>

<script>

export default {
  name: 'MenuTree',
  props: {
    menu: {
      type: Object,
      required: true
    }
  },
  methods: {
    handleRoute(menu) {
      // 通过菜单URL跳转至指定路由
      this.$router.push("/" + menu.url)
    }
  }
}
</script>

<style lang="scss" scoped>

</style>