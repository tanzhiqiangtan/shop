<template>
  <div class="params-template">
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>参数列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片区域 -->
    <el-card>
      <!-- 警告框 -->
      <el-alert :closable="false" title="注意：只允许为第三级分类设置相关参数！" type="warning" show-icon></el-alert>
      <!-- 商品分类的级联选择框 -->
      <span>选择商品分类：</span>
      <el-cascader
        @change="getParamsById"
        v-model="selectcateId"
        :options="CateOptions"
        :props="{
            expandTrigger: 'hover',
            value:'cat_id',
            label:'cat_name',
            children:'children',
           }"
      ></el-cascader>
      <!-- Tabs 框内容 -->
      <el-tabs @tab-click="getParamsById" v-model="activeName">
        <!-- 动态参数 -->
        <el-tab-pane label="动态参数" name="many">
          <!-- 添加按钮 -->
          <el-row>
            <el-button @click="showAddParams" :disabled="BtnValid" size="mini" type="primary">添加参数</el-button>
          </el-row>
          <!-- 表格内容 -->
          <el-table border :data="paramsList" style="width: 100%">
            <!-- 扩展列 -->
            <el-table-column type="expand">
              <template slot-scope="scope">
                <el-tag
                  :key="index"
                  v-for="(item,index) in scope.row.attr_vals"
                  closable
                  :disable-transitions="false"
                  @close="handleClose(index,scope.row)"
                >{{item}}</el-tag>
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                ></el-input>
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(scope.row)"
                >+ 增加</el-button>
              </template>
            </el-table-column>
            <!-- 索引列 -->
            <el-table-column type="index"></el-table-column>
            <el-table-column prop="attr_name" label="参数名称" width="180"></el-table-column>
            <el-table-column label="操作" width="180">
              <template slot-scope="scope">
                <el-button
                  @click="showEditParams(scope.row)"
                  size="mini"
                  type="primary"
                  icon="el-icon-edit"
                >修改</el-button>
                <el-button
                  @click="deleteParam(scope.row)"
                  size="mini"
                  type="danger"
                  icon="el-icon-delete"
                >删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <!-- 静态参数 -->
        <el-tab-pane label="静态属性" name="only">
          <el-row>
            <el-button @click="showAddParams" :disabled="BtnValid" size="mini" type="primary">添加属性</el-button>
          </el-row>
          <!-- 表格内容 -->
          <el-table border :data="paramsList" style="width: 100%">
            <!-- 扩展列 -->
            <el-table-column type="expand">
              <template slot-scope="scope">
                <el-tag
                  :key="index"
                  v-for="(item,index) in scope.row.attr_vals"
                  closable
                  :disable-transitions="false"
                  @close="handleClose(index,scope.row)"
                >{{item}}</el-tag>
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                ></el-input>
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(scope.row)"
                >+ 增加</el-button>
              </template>
            </el-table-column>
            <!-- 索引列 -->
            <el-table-column type="index"></el-table-column>
            <el-table-column prop="attr_name" label="属性名称" width="180"></el-table-column>
            <el-table-column label="操作" width="180">
              <template slot-scope="scope">
                <el-button
                  @click="showEditParams(scope.row)"
                  size="mini"
                  type="primary"
                  icon="el-icon-edit"
                >修改</el-button>
                <el-button
                  @click="deleteParam(scope.row)"
                  size="mini"
                  type="danger"
                  icon="el-icon-delete"
                >删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>
    <!-- 添加参数diglog框 -->
    <el-dialog
      @close="resetFields('paramsRef')"
      :title="'添加'+labelValid"
      :visible.sync="paramsDialogVisible"
      width="50%"
    >
      <!-- 表单区域 -->
      <el-form :rules="paramsRules" ref="paramsRef" :model="paramsFrom" label-width="80px">
        <el-form-item :label="labelValid" prop="attr_name">
          <el-input v-model="paramsFrom.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="paramsDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addParams()">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改参数diglog框 -->
    <el-dialog
      @close="resetFields('editParamsRef')"
      :title="'修改'+labelValid"
      :visible.sync="editParamsDialogVisible"
      width="50%"
    >
      <!-- 表单区域 -->
      <el-form :rules="paramsRules" ref="editParamsRef" :model="editparamsFrom" label-width="80px">
        <el-form-item :label="labelValid" prop="attr_name">
          <el-input v-model="editparamsFrom.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editParamsDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editParam()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 级联框的分类数据
      CateOptions: [],
      // 级联框选中的分类ID
      selectcateId: [],
      // tab框的值
      activeName: 'many',
      // 三级参数列表
      paramsList: [],
      // 添加参数的diglog框是否显示
      paramsDialogVisible: false,
      // 修改参数的diglog框是否显示
      editParamsDialogVisible: false,
      // 添加参数表单的值
      paramsFrom: {
        attr_name: ''
      },
      // 修改参数表单的值
      editparamsFrom: {
        attr_name: ''
      },
      // 修改参数的数据
      editParams: {},
      // 添加参数验证规则
      paramsRules: {
        attr_name: [
          { required: true, message: '请输入分类名称', trigger: 'blur' }
        ]
      }
      // tag
      // dynamicTags: ['标签一', '标签二', '标签三'],
      // inputVisible: false,
      // inputValue: ''
    }
  },
  created() {
    this.getCateOptions()
  },
  computed: {
    // 按键是否显示的值
    BtnValid() {
      if (this.selectcateId.length !== 3) return true
      return false
    },
    // titleValid() {
    //   return this.activeName === 'only' ? '添加动态参数' : '添加静态属性'
    // },
    labelValid() {
      return this.activeName === 'only' ? '动态参数' : '静态属性'
    }
  },
  methods: {
    // 级联框的分类数据-3极
    async getCateOptions() {
      const { data: res } = await this.$http.get('categories', {
        params: { type: 3 }
      })
      if (res.meta.status !== 200) {
        return this.$message.error('获取商品分类数据失败')
      }
      this.CateOptions = res.data
      console.log(this.selectcateId)
    },
    // 通过三级id查询参数
    async getParamsById() {
      // console.log(res)
      if (this.selectcateId.length !== 3) {
        return (this.paramsList = [])
      }
      const { data: res } = await this.$http.get(
        `categories/${
          this.selectcateId[this.selectcateId.length - 1]
        }/attributes`,
        { params: { sel: this.activeName } }
      )
      console.log(JSON.stringify(res.data))
      if (res.meta.status !== 200) {
        return this.$message.error('获取商品参数失败')
      }
      console.log(res.data)
      res.data.forEach(item => {
        item.attr_vals = item.attr_vals ? item.attr_vals.split(' ') : []
        item.inputVisible = false
        item.inputValue = ''
      })
      this.paramsList = res.data
      console.log(this.paramsList)
    },
    // 重置表单
    resetFields(ref) {
      this.$refs[ref].resetFields()
      // this.selectcateId = []
      // console.log('清楚表单了')
    },
    // 添加参数
    addParams() {
      this.$refs.paramsRef.validate(async valid => {
        if (!valid) return
        const { data: ret } = await this.$http.post(
          `categories/${
            this.selectcateId[this.selectcateId.length - 1]
          }/attributes`,
          { attr_name: this.paramsFrom.attr_name, attr_sel: this.activeName }
        )
        if (ret.meta.status !== 201) return this.$message.error('添加参数失败')
        this.paramsDialogVisible = false
        this.getParamsById()
      })
    },

    // 展示添加参数框
    showAddParams() {
      // console.log('123')
      this.paramsDialogVisible = true
    },
    // 展示添加参数框
    showEditParams(data) {
      // console.log('123')
      this.editParamsDialogVisible = true
      this.editparamsFrom.attr_name = data.attr_name
      this.editParams = data
      console.log(this.editParams)
      console.log(data)
    },
    // 修改参数名称
    editParam() {
      this.$refs.editParamsRef.validate(async valid => {
        if (!valid) return
        const { data: ret } = await this.$http.put(
          `categories/${this.editParams.cat_id}/attributes/${this.editParams.attr_id}`,
          {
            attr_name: this.editparamsFrom.attr_name,
            attr_sel: this.editParams.attr_sel
            // attr_vals: this.editParams.attr_vals
          }
        )
        console.log(ret)
        if (ret.meta.status !== 200) return this.$message.error('修改参数失败')
        this.$message.success('修改参数成功')
        this.editParamsDialogVisible = false
        this.getParamsById()
      })
    },
    // 删除参数
    deleteParam(data) {
      this.$confirm('此操作将永久删除该参数, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          const { data: ret } = await this.$http.delete(
            `categories/${data.cat_id}/attributes/${data.attr_id}`
          )
          if (ret.meta.status !== 200) {
            return this.$message.error('删除参数失败')
          }
          this.$message.success('删除参数成功')
          console.log(123)
          this.getParamsById()
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    // tag 方法
    handleClose(index, row) {
      // console.log(index)
      // console.log(row)
      row.attr_vals.splice(index, 1)
      this.saveAttrVals(row)
    },

    showInput(row) {
      row.inputVisible = true
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },

    handleInputConfirm(row) {
      const inputValue = row.inputValue.trim()
      // console.log(inputValue.length)
      if (inputValue) {
        row.attr_vals.push(inputValue)
        this.saveAttrVals(row)
      }
      row.inputVisible = false
      row.inputValue = ''
    },
    // 保存参数的值
    async saveAttrVals(row) {
      const { data: result } = await this.$http.put(
        `categories/${row.cat_id}/attributes/${row.attr_id}`,
        {
          attr_name: row.attr_name,
          attr_sel: row.attr_sel,
          attr_vals: row.attr_vals.join(' ')
        }
      )
      if (result.meta.status !== 200) return this.$message.erro('设置参数失败')
      this.$message.success('设置参数成功')
    }
  }
}
</script>

<style lang="less" scoped>
.params-template {
  padding: 20px;
}
.el-alert {
  margin-bottom: 20px;
}
.el-card {
  margin-top: 20px;
}
.el-tabs {
  margin-top: 20px;
}
.el-table__body {
  width: 100% !important;
}
.el-table__header {
  width: 100% !important;
}
.el-table {
  font-size: 12px !important;
}
.el-tag + .el-tag {
  margin-left: 10px;
}
.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
.input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}
</style>
