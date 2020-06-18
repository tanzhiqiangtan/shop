<template>
  <div class="goods-list">
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片区域 -->
    <el-card>
      <el-row>
        <!-- 搜索栏 -->
        <el-col :span="8">
          <el-input
            clearable
            @clear="getGoodsList"
            placeholder="请输入内容"
            v-model="listForm.query"
            class="input-with-select"
          >
            <el-button @click="getGoodsList" slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
        <el-col :span="2" class="add-goods-btn">
          <el-button @click="showAddpage" type="primary">添加商品</el-button>
        </el-col>
      </el-row>
      <!-- 表格区域 -->
      <el-table stripe border :data="goodsList" style="width: 100%">
        <el-table-column type="index" width="50"></el-table-column>
        <el-table-column prop="goods_name" label="商品名称"></el-table-column>
        <el-table-column prop="goods_price" label="商品价格(元)" width="110"></el-table-column>
        <el-table-column prop="goods_weight" label="商品质量" width="70"></el-table-column>
        <el-table-column label="创建时间" width="140">
          <template slot-scope="scope">{{scope.row.add_time|dateFormat}}</template>
        </el-table-column>
        <el-table-column label="操作" width="140">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" icon="el-icon-edit"></el-button>
            <el-button
              @click="deleteGoods(scope.row)"
              size="mini"
              type="danger"
              icon="el-icon-delete"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 列表分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="listForm.pagenum"
        :page-sizes="[3, 5, 10, 20]"
        :page-size="listForm.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="listTotal"
      ></el-pagination>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 商品列表请求数据
      listForm: {
        query: '',
        pagenum: 1,
        pagesize: 5
      },
      // 商品列表
      goodsList: [],
      listTotal: 0
    }
  },
  created() {
    this.getGoodsList()
  },
  computed: {},
  methods: {
    // 获取商品列表
    async getGoodsList() {
      console.log(123)
      const { data: res } = await this.$http.get('goods', {
        params: this.listForm
      })
      if (res.meta.status !== 200) {
        return this.$message.error('获取商品列表失败')
      }
      console.log(res)
      this.goodsList = res.data.goods
      this.listTotal = res.data.total
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`)
      this.listForm.pagesize = val
      this.getGoodsList()
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`)
      this.listForm.pagenum = val
      this.getGoodsList()
    },
    // 删除商品
    deleteGoods(goodsItem) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          const { data: res } = await this.$http.delete(
            `goods/${goodsItem.goods_id}`
          )
          if (res.meta.status !== 200) {
            return this.$message.error('删除商品失败')
          }
          this.$message({
            type: 'success',
            message: '删除商品成功!'
          })
          const yushu = this.listTotal % this.listForm.pagesize
          // console.log(yushu)
          this.listForm.pagenum =
            yushu === 1 ? this.listForm.pagenum - 1 : this.listForm.pagenum
          // 重新获取商品列表
          this.getGoodsList()
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    // 展示添加商品界面
    showAddpage() {
      this.$router.push('/goods/add')
    }
  }
}
</script>

<style lang="less" scoped>
.goods-list {
  padding: 20px;
}
.el-card {
  margin-top: 20px;
}
.add-goods-btn {
  margin-left: 20px;
}
.el-table {
  font-size: 12px;
  margin: 20px 0;
}
</style>
