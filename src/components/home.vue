<template>
  <div>
    <div>这是home页面</div>
    <el-button type="info" @click="loginOut">退出</el-button>
  </div>
</template>

<script>
export default {
  methods: {
    loginOut() {
      window.sessionStorage.clear()
      this.$router.push('/login')
    }
  }

}
</script>

<style lang="less" scoped>

</style>
