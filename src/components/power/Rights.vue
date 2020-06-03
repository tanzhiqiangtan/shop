<template>
  <div class="rights-template">
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片主体内容区 -->
    <el-card>
      <!-- <pre>{{rightsList}}</pre> -->
      <!-- 展示权限列表的表格 -->
      <el-table border stripe :data="rightsList" style="width: 100%">
        <el-table-column type="index"></el-table-column>
        <el-table-column prop="authName" label="权限名称"></el-table-column>
        <el-table-column prop="path" label="路径"></el-table-column>
        <el-table-column label="权限等级">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.level==0">一级</el-tag>
            <el-tag v-else-if="scope.row.level==1" type="success">二级</el-tag>
            <el-tag v-else type="warning">三级</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 权限列表
      rightsList: []
    }
  },
  created() {
    // 调用获取权限列表
    this.getRightsList()
  },
  methods: {
    // 获取权限列表
    async getRightsList() {
      // 发送请求
      const { data: ret } = await this.$http.get('rights/list')
      if (ret.meta.status !== 200) {
        return this.$message.error('权限列表请求失败')
      }
      this.rightsList = ret.data
    }
  }
}
</script>

<style lang="less" scoped>
.rights-template {
  padding: 20px;
}
.el-card {
  margin-top: 20px;
}
.el-table {
  margin-top: 20px;
  font-size: 12px;
}
</style>
