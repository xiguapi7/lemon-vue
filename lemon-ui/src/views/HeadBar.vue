<template>
  <div :class="collapse?'position-collapse-left':'position-left'" :style="{'background':themeColor}"
       class="headbar">
    <!-- 导航收缩 -->
    <span class="hamburg">
      <el-menu :active-text-color="themeColor" :background-color="themeColor" class="el-menu-demo"
               mode="horizontal" text-color="#fff">
        <el-menu-item @click="onCollapse" index="1">
          <hamburger :isActive="collapse"></hamburger>
        </el-menu-item>
      </el-menu>
    </span>
    <!-- 导航菜单 -->
    <span class="navbar">
      <el-menu :background-color="themeColor" :default-active="activeIndex"
               @select="selectNavBar()" active-text-color="#ffd04b" class="el-menu-demo" mode="horizontal"
               text-color="#fff">
        <el-menu-item @click="$router.push('/')" index="1">{{ $t("common.home") }}</el-menu-item>
        <el-menu-item @click="openWindow('https://gitee.com/liuge1988/kitty/wikis/Home')"
                      index="2">{{ $t("common.doc") }}</el-menu-item>
        <el-menu-item @click="openWindow('https://www.cnblogs.com/xifengxiaoma/')"
                      index="3">{{ $t("common.blog") }}</el-menu-item>
      </el-menu>
    </span>
    <!-- 工具栏 -->
    <span class="toolbar">
      <el-menu :active-text-color="themeColor" :background-color="themeColor" class="el-menu-demo"
               mode="horizontal" text-color="#14889A">
        <el-menu-item index="1">
          <!-- 主题切换 -->
          <theme-picker :default="themeColor" @onThemeChange="onThemeChange"
                        class="theme-picker">
          </theme-picker>
        </el-menu-item>
        <el-menu-item index="2" v-popover:popover-lang>
          <!-- 语言切换 -->
          <li class="fa fa-language fa-lg" style="color:#fff;"></li>
          <el-popover placement="bottom-start" ref="popover-lang" trigger="click" v-model="langVisible">
            <div @click="changeLanguage('zh_cn')" class="lang-item">简体中文</div>
            <div @click="changeLanguage('en_us')" class="lang-item">English</div>
          </el-popover>
        </el-menu-item>
        <el-menu-item index="3" v-popover:popover-message>
          <!-- 我的私信 -->
          <el-badge :max="99" :value="5" class="badge" type="error">
            <li class="fa fa-envelope-o fa-lg" style="color:#fff;"></li>
          </el-badge>
          <el-popover placement="bottom-end" ref="popover-message" trigger="click">
            <message-panel></message-panel>
          </el-popover>
        </el-menu-item>
        <el-menu-item index="4" v-popover:popover-notice>
          <!-- 系统通知 -->
          <el-badge :max="99" :value="4" class="badge" type="error">
            <li class="fa fa-bell-o fa-lg" style="color:#fff;"></li>
          </el-badge>
          <el-popover placement="bottom-end" ref="popover-notice" trigger="click">
            <notice-panel></notice-panel>
          </el-popover>
        </el-menu-item>
        <el-menu-item index="5" v-popover:popover-personal>
          <!-- 用户信息 -->
          <span class="user-info"><img :src="user.avatar"/>{{ user.name }}</span>
          <el-popover :visible-arrow="false" placement="bottom-end" ref="popover-personal" trigger="click">
            <personal-panel :user="user"></personal-panel>
          </el-popover>
        </el-menu-item>
      </el-menu>
    </span>
  </div>
</template>

<script>
import {mapState} from 'vuex'
import Hamburger from "@/components/Hamburger"
import ThemePicker from "@/components/ThemePicker"
import NoticePanel from "@/views/Core/NoticePanel"
import MessagePanel from "@/views/Core/MessagePanel"
import PersonalPanel from "@/views/Core/PersonalPanel"

export default {
  components: {
    Hamburger,
    ThemePicker,
    NoticePanel,
    MessagePanel,
    PersonalPanel
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
    openWindow(url) {
      window.open(url)
    },
    selectNavBar(key, keyPath) {
      console.log(key, keyPath)
    },
    // 折叠导航栏
    onCollapse: function () {
      this.$store.commit('onCollapse')
    },
    // 切换主题
    onThemeChange: function (themeColor) {
      this.$store.commit('setThemeColor', themeColor)
    },
    // 语言切换
    changeLanguage(lang) {
      lang === '' ? 'zh_cn' : lang
      this.$i18n.locale = lang
      this.langVisible = false
    }
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
      themeColor: state => state.app.themeColor,
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

.hamburg {
  float: left;
}

.navbar {
  float: left;
}

.toolbar {
  float: right;
}

.lang-item {
  font-size: 16px;
  padding-left: 8px;
  padding-top: 8px;
  padding-bottom: 8px;
  cursor: pointer;
}

.lang-item:hover {
  font-size: 18px;
  background: #b0d6ce4d;
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

.badge {
  line-height: 18px;
}

.position-left {
  left: 200px;
}

.position-collapse-left {
  left: 65px;
}
</style>