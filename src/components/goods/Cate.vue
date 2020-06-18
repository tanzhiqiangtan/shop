<template>
  <div class="cate-template">
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片区域 -->
    <el-card>
      <!-- 添加分类按钮 -->
      <el-row>
        <el-button type="primary" @click="showaddCateDialog">添加分类</el-button>
      </el-row>
      <!-- 分类的表格区域 -->
      <!-- ref="treeRef" -->
        <!-- @checkbox-click="getArry" -->
        <!-- :selection-type="true" -->
      <tree-table
        :selection-type="false"
        border
        class="tree-table"
        index-text="#"
        show-index
        :data="cataList"
        :columns="columns"
        :expand-type="false"
      >
        <template slot="isvalid" slot-scope="scope">
          <i v-if="!scope.row.cat_deleted" class="el-icon-success"></i>
          <i v-else class="el-icon-error"></i>
        </template>
        <template slot="sort" slot-scope="scope">
          <el-tag v-if="scope.row.cat_level===0">一级</el-tag>
          <el-tag v-else-if="scope.row.cat_level===1" type="success">二级</el-tag>
          <el-tag v-else type="warning">三级</el-tag>
        </template>
        <template slot="operate" slot-scope="scope">
          <el-button
            size="mini"
            type="primary"
            icon="el-icon-edit"
            @click="showEditCate(scope.row)"
          >编辑</el-button>
          <el-button
            size="mini"
            type="danger"
            icon="el-icon-delete"
            @click="deletecate(scope.row)"
          >删除</el-button>
        </template>
      </tree-table>
      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="cataInfo.pagenum"
        :page-sizes="[3, 5, 10, 15]"
        :page-size="cataInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="cataTotal"
      ></el-pagination>
    </el-card>
    <!-- 添加分类diglog框 -->
    <el-dialog
      @close="resetFields('addCateRef')"
      title="添加分类"
      :visible.sync="addCateDialogVisible"
      width="50%"
    >
      <!-- 添加表单区域 -->
      <el-form :rules="addCateRules" ref="addCateRef" :model="addCateFrom" label-width="80px">
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="addCateFrom.cat_name"></el-input>
        </el-form-item>
        <!-- // 级联框 -->
        <el-form-item label="父级分类">
          <el-cascader
            change-on-select
            clearable
            size="medium"
            v-model="selectcateId"
            :options="Cateoptions"
            :props="{
            expandTrigger: 'hover',
            value:'cat_id',
            label:'cat_name',
            children:'children',
           }"
          ></el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addCateDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCate()">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 添加分类diglog框 -->
    <el-dialog
      @close="resetFields('editCateRef')"
      title="修改分类"
      :visible.sync="editCateDialogVisible"
      width="50%"
    >
      <!-- 修改分类表单区域 -->
      <el-form :rules="addCateRules" ref="editCateRef" :model="editFrom" label-width="80px">
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="editFrom.cat_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editCateDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="eidtCate()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      cataList: [],
      // 分类列表请求参数
      cataInfo: {
        type: '',
        pagenum: 1,
        pagesize: 5
      },
      // 分类总数
      cataTotal: 0,
      addCateDialogVisible: false,
      editCateDialogVisible: false,
      // 编辑分类的ID
      editFrom: {
        cat_name: ''
      },
      // 添加分类表单
      addCateFrom: {
        cat_name: ''
      },
      // 级联框数据
      Cateoptions: [],
      selectcateId: '',
      // 验证规则
      addCateRules: {
        cat_name: [
          { required: true, message: '请输入分类名称', trigger: 'blur' }
        ]
      },
      // 树型表 列的配置
      columns: [
        {
          label: '分类名称',
          prop: 'cat_name'
        },
        {
          label: '是否有效',
          type: 'template',
          template: 'isvalid'
        },
        {
          label: '排序',
          type: 'template',
          template: 'sort'
        },
        {
          label: '操作',
          type: 'template',
          template: 'operate'
        }
      ]
    }
  },
  created() {
    this.getCateList()
  },
  methods: {
    // 获取分类列表
    async getCateList() {
      const { data: res } = await this.$http.get('categories', {
        params: this.cataInfo
      })
      console.log(res)
      if (res.meta.status !== 200) {
        return this.$message.error('获取分类数据失败')
      }
      this.cataList = res.data.result
      this.cataTotal = res.data.total
    },
    handleSizeChange(val) {
      // console.log(`每页 ${val} 条`)
      this.cataInfo.pagesize = val
      this.getCateList()
    },
    handleCurrentChange(val) {
      // console.log(`当前页: ${val}`)
      this.cataInfo.pagenum = val
      this.getCateList()
    },
    // 展示添加分类表单
    async showaddCateDialog() {
      this.addCateDialogVisible = true
      const { data: res } = await this.$http.get('categories', {
        params: { type: 2 }
      })
      if (res.meta.status !== 200) {
        return this.$message.error('获取商品分类数据失败')
      }
      this.Cateoptions = res.data
    },
    // 验证表单
    // checkFrom(ref) {
    //   const ret = this.$refs[ref].validate().then(val => val).catch(erro => erro)
    //   console.log(ret.PromiseValue)
    // }
    // 重置表单
    resetFields(ref) {
      this.$refs[ref].resetFields()
      this.selectcateId = []
      // console.log('清楚表单了')
    },
    // 添加分类
    async addCate() {
      const valid = await this.$refs.addCateRef.validate().catch(erro => erro)
      if (!valid) return
      // console.log(valid)
      // const catPid = this.selectcateId.length === 0 ? 0 : this.selectcateId[this.selectcateId.length - 1]
      // console.log(this.addCateFrom.cat_name)
      // const catlevel = this.selectcateId.length + 1
      const { data: ret } = await this.$http.post('categories', {
        cat_pid:
          this.selectcateId.length === 0
            ? 0
            : this.selectcateId[this.selectcateId.length - 1],
        cat_name: this.addCateFrom.cat_name,
        cat_level: this.selectcateId.length
      })
      if (ret.meta.status !== 201) return this.$message.error('新增分类失败')
      console.log(ret)
      this.getCateList()
      this.addCateDialogVisible = false
    },
    // 通过id获取分类数据
    async getCateById(cate) {
      const { data: res } = await this.$http.get(`categories/${cate.cat_id}`)
      console.log(res)
      if (res.meta.status !== 200) {
        return this.$message.error('获取分类数据失败')
      }
      this.editFrom = res.data
    },
    // 展示修改分类
    showEditCate(cate) {
      console.log(cate)
      this.getCateById(cate)
      this.editCateDialogVisible = true
    },
    // 修改分类
    async eidtCate() {
      const valid = await this.$refs.editCateRef.validate().catch(erro => erro)
      if (!valid) return
      const { data: ret } = await this.$http.put(
        `categories/${this.editFrom.cat_id}`,
        {
          cat_name: this.editFrom.cat_name
        }
      )
      if (ret.meta.status !== 200) {
        return this.$message.error('修改分类数据失败')
      }
      this.getCateList()
      this.editCateDialogVisible = false
    },
    // 删除分类
    deletecate(catenode) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          console.log(catenode)
          const { data: ret } = await this.$http.delete(
            `categories/${catenode.cat_id}`
          )
          if (ret.meta.status !== 200) this.$message.error('删除分类失败')
          console.log(ret)
          this.$message.success('删除分类成功')
          if (catenode.cat_level === 0 && catenode._childrenLen === 0) {
            const yushu = this.cataTotal % this.cataInfo.pagesize
            // console.log(yushu)
            this.cataInfo.pagenum =
              yushu === 1 ? this.cataInfo.pagenum - 1 : this.cataInfo.pagenum
          }
          this.getCateList()
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    }
    // test
    // getArry() {
    //   console.log(this.$refs.treeRef.getCheckedProp('cat_id'))
    // }
  }
}
</script>

<style lang="less" scoped>
.cate-template {
  padding: 20px;
}
.el-card {
  margin-top: 20px;
}
.tree-table {
  margin: 20px 0;
}
.el-icon-success {
  color: rgb(32, 178, 170);
}
.el-icon-error {
  color: orange;
}
.el-cascader {
  width: 100%;
}
</style>
