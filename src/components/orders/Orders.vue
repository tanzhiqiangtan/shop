<template>
  <div class="orders">
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片区域 -->
    <el-card>
      <el-row>
        <!-- 搜索栏 -->
        <el-col :span="8">
          <el-input placeholder="请输入内容" v-model="queryInfo.query" class="input-with-select">
            <el-button slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
      </el-row>
      <!-- 表格区域 -->
      <el-table stripe border :data="ordersList" style="width: 100%">
        <el-table-column type="index"></el-table-column>
        <el-table-column width="280px" prop="order_number" label="订单编号"></el-table-column>
        <el-table-column prop="order_price" label="订单价格"></el-table-column>
        <el-table-column label="是否付款">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.order_pay==='0'" type="warning">未付款</el-tag>
            <el-tag v-else type="success">已付款</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="is_send" label="是否发货"></el-table-column>
        <el-table-column label="下单时间">
          <template slot-scope="scope">{{scope.row.create_time|dateFormat}}</template>
        </el-table-column>
        <el-table-column label="操作">
          <template>
            <el-button @click="showBox" size="mini" type="primary" icon="el-icon-edit"></el-button>
            <el-button @click="showBox1" size="mini" type="success" icon="el-icon-map-location
"></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页组件 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[3, 5, 10, 20]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>
    <!-- Dialog框 -->
    <el-dialog
      title="修改地址"
      :visible.sync="AddressdialogVisible"
      width="50%"
      :before-close="handleAddressClose"
    >
      <el-form ref="editAddressFormRef" :model="editAddressForm" label-width="80px">
        <el-form-item label="省市区/县">
          <el-cascader
            v-model="editAddressForm.selectAddress"
            :options="citydata"
            :props="{ expandTrigger: 'hover' }"
          ></el-cascader>
        </el-form-item>
        <el-form-item label="详细地址">
          <el-input v-model="editAddressForm.address"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="AddressdialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="AddressdialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 物流Dialog框 -->
    <el-dialog title="查看物流进度" :visible.sync="dialogVisible" width="50%">
      <el-timeline :reverse="false">
        <el-timeline-item
          v-for="(kuaidi, index) in kuaidis"
          :key="index"
          :timestamp="kuaidi.time"
        >{{kuaidi.context}}</el-timeline-item>
      </el-timeline>
    </el-dialog>
  </div>
</template>

<script>
import citydata from './citydata.js'
export default {
  data() {
    return {
      // 订单列表请求参数
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 5
      },
      // 城市数据
      // 快递数据
      kuaidis: [],
      citydata,
      // 订单列表数据
      ordersList: [],
      // 订单总数
      total: 0,
      AddressdialogVisible: false,
      dialogVisible: false,
      editAddressForm: {
        selectAddress: [],
        address: ''
      }
    }
  },
  created() {
    this.getOrdersList()
  },
  computed: {},
  methods: {
    // 获取订单列表
    async getOrdersList() {
      const { data: ret } = await this.$http.get('orders', {
        params: this.queryInfo
      })
      if (ret.meta.status !== 200) return this.$message.error('订单获取失败')
      this.ordersList = ret.data.goods
      this.total = ret.data.total
      console.log(ret.data)
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`)
      this.queryInfo.pagesize = val
      this.getOrdersList()
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`)
      this.queryInfo.pagenum = val
      this.getOrdersList()
    },
    showBox() {
      this.AddressdialogVisible = true
    },
    handleAddressClose(done) {
      console.log(this.$refs)
      this.$refs.editAddressFormRef.resetFields()
      this.AddressdialogVisible = false
    },
    // 查看物流进度
    async showBox1() {
      console.log(1)
      const { data: ret } = await this.$http.get('/kuaidi/1106975712662')
      if (ret.meta.status !== 200) return this.$message.error('获取物流信息失败')
      console.log(ret)
      this.kuaidis = ret.data
      this.dialogVisible = true
    }
  }
}
</script>

<style lang="less" scoped>
.orders {
  padding: 20px;
}
.el-card {
  margin-top: 20px;
}
.el-table {
  margin: 20px 0;
  font-size: 12px;
}
</style>
