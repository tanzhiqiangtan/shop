<template>
  <!-- 容器 -->
  <el-container class="home-container">
    <!-- 头部区域 -->
    <el-header>
      <div>
        <img src="../assets/logo1.png" alt />
        <span>小鱼电商后台管理系统</span>
      </div>
      <el-button type="info" @click="loginOut">退出</el-button>
    </el-header>
    <el-container>
      <!-- 侧边栏区域 -->
      <el-aside :width="collapse? '64px':'200px'">
        <!-- 菜单栏 -->
        <el-menu :default-active="activepath" router :collapse-transition="false" :collapse="collapse" :unique-opened="true" background-color="#333744" text-color="#fff" active-text-color="#ffd04b">
          <!-- 切换菜单的盒子 -->
          <div class="toggleButton" @click="toggle">|||</div>
          <!-- 一级菜单 -->
          <el-submenu :index="submenu.id+''" v-for=" submenu in MenuList" :key="submenu.id">
            <template slot="title">
              <i :class="MenuIconObj[submenu.id]"></i>
              <span>{{submenu.authName}}</span>
            </template>
            <!-- 二级菜单 -->
            <el-menu-item @click="saveactivepath(items.path)"  :index="'/'+items.path" v-for=" items in submenu.children" :key="items.id">
              <template slot="title">
                <i class="el-icon-menu"></i>
                <span>{{items.authName}}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!-- 主体区域 -->
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  data() {
    return {
      MenuList: [],
      MenuIconObj: {
        125: 'iconfont icon-user',
        103: 'iconfont icon-tijikongjian',
        101: 'iconfont icon-shangpin',
        102: 'iconfont icon-danju',
        145: 'iconfont icon-baobiao'
      },
      // 切换数据
      collapse: false,
      // 当前点击的路径数据
      activepath: ''
    }
  },
  created() {
    // 执行左侧菜单栏的数据
    this.getMenuList()
    // 进入home页面给activepath赋值
    this.activepath = window.sessionStorage.getItem('activepath')
  },
  methods: {
    loginOut() {
      window.sessionStorage.clear()
      this.$router.push('/login')
    },
    // 请求左侧菜单栏的数据
    async getMenuList() {
      const { data: ret } = await this.$http.get('menus')
      // console.log(ret)
      // console.log(ret.data)
      // console.log(this)
      if (ret.meta.status !== 200) return this.$message.error('获取左侧菜单栏的数据失败')
      this.MenuList = ret.data
    },
    // 伸缩菜单导航
    toggle() {
      this.collapse = !this.collapse
    },
    // 保存当前菜单二级路径使其高亮的方法
    saveactivepath(path) {
      // console.log(path)
      const paths = '/' + path
      window.sessionStorage.setItem('activepath', paths)
      this.activepath = paths
    }
  }
}
</script>

<style lang="less" scoped>
.home-container {
  height: 100%;
}
.el-header {
  background-color: #fff;
  font-size: 22px;
  color: #cc3060;
  display: flex;
  justify-content: space-between;
  padding-left: 0;
  align-items: center;
  border: 1px solid #cc3060;
}
.el-header > div {
  display: flex;
  align-items: center;
  img {
    height: 59px;
  }
  span {
    padding-left: 10px;
  }
}

.el-aside {
  background-color: #333744;
  .iconfont {
    margin-right: 10px;
  }
}
.el-main {
  background-color: #eaedf1;
  padding: 0;
}
.toggleButton {
  background-color: #4A5064;
  font-size:12px;
  color: #fff;
  text-align: center;
  line-height: 25px;
  letter-spacing: 2px;
  cursor: pointer;
}
.el-menu {
  border-right: none;
}
</style>
