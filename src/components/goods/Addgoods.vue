<template>
  <div class="add-goods">
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片区域 -->
    <el-card>
      <!-- //警号栏 -->
      <el-alert :closable="false" center title="添加商品信息" type="info" show-icon></el-alert>
      <!-- 步骤条 -->
      <el-steps align-center :active="active-0" finish-status="success">
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>
      <!-- 切换栏 -->
      <el-form
        :rules="addGoodsFormRules"
        label-position="top"
        ref="addGoodsFormRef"
        :model="addGoodsForm"
      >
        <el-tabs v-model="active" tab-position="left" :before-leave="isCatvalid">
          <!-- 基本信息页面 -->
          <el-tab-pane name="0" label="基本信息">
            <el-form-item prop="goods_name" label="商品名称">
              <el-input v-model="addGoodsForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item prop="goods_price" label="商品价格">
              <el-input v-model="addGoodsForm.goods_price"></el-input>
            </el-form-item>
            <el-form-item prop="goods_weight" label="商品重量">
              <el-input v-model="addGoodsForm.goods_weight"></el-input>
            </el-form-item>
            <el-form-item prop="goods_number" label="商品数量">
              <el-input v-model="addGoodsForm.goods_number"></el-input>
            </el-form-item>
            <el-form-item prop="goods_cat" label="商品分类">
              <el-cascader
                v-model="addGoodsForm.goods_cat"
                :options="catList"
                :props="{ expandTrigger: 'hover',
                value:'cat_id',
                label:'cat_name',
                children:'children'
                }"
                @change="handleChange"
              ></el-cascader>
            </el-form-item>
          </el-tab-pane>
          <!-- 商品参数面板 -->
          <el-tab-pane name="1" label="商品参数">
            <el-form-item :key="index" v-for="(item,index) in paramsList" :label="item.attr_name">
              <el-checkbox-group v-model="item.checkDList">
                <el-checkbox
                  size="mini"
                  border
                  :key="key"
                  v-for="(item1,key) in item.attr_vals"
                  :label="item1"
                ></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <!-- 商品属性面板 -->
          <el-tab-pane name="2" label="商品属性">
            <el-form-item
              :key="index2"
              v-for="(item2,index2) in staticList"
              :label="item2.attr_name"
            >
              <el-input v-model="item2.attr_vals"></el-input>
            </el-form-item>
          </el-tab-pane>
          <!-- 商品图片面板 -->
          <el-tab-pane name="3" label="商品图片">
            <el-upload
              :action="host"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              :on-success="handleSuccess"
              :file-list="fileList"
              list-type="picture"
              :headers="headers"
            >
              <el-button size="small" type="primary">点击上传</el-button>
              <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
            </el-upload>
          </el-tab-pane>
          <el-tab-pane name="4" label="商品内容">
            <!-- 富文本编辑器 -->
            <quill-editor v-model="addGoodsForm.goods_introduce"></quill-editor>
            <!-- 添加商品按钮 -->
            <el-button @click="addGoods" class="addDoodsBtn" type="primary">添加商品</el-button>
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>
    <!-- 照片对话框 -->
    <el-dialog title="图片预览" :visible.sync="dialogVisible" width="50%">
      <img :src="srcUrl" alt />
    </el-dialog>
  </div>
</template>

<script>
// 官方推荐将lodash导入为_
import _ from 'lodash'
export default {
  data() {
    return {
      active: '0',
      // 商品列表
      catList: [],
      // 级联框选中的值
      // selectList: [],
      // 动态参数数据
      paramsList: [],
      // 静态属性
      staticList: [],
      // 动态参数的选择列表
      // checkDList: [],
      // 上传图片地址
      host: 'http://127.0.0.1:8888/api/private/v1/upload',
      // 文件上传的请求头部信息
      headers: {
        Authorization: window.sessionStorage.getItem('token')
      },
      // 添加商品的表单
      addGoodsForm: {
        goods_name: '',
        goods_cat: [],
        goods_price: '',
        goods_number: '',
        goods_weight: '',
        goods_introduce: '',
        pics: [],
        attrs: []
      },
      // 图片文件上传列表
      fileList: [],
      // 图片地址
      psrc: '',
      // 图片展示的对话框
      dialogVisible: false,
      // 上传图片地址
      srcUrl: '',
      // 添加商品表单验证规则
      addGoodsFormRules: {
        goods_name: [
          { required: true, message: '请输入商品名称', trigger: 'blur' }
        ],
        goods_price: [
          { required: true, message: '请输入商品价格', trigger: 'blur' }
        ],
        goods_weight: [
          { required: true, message: '请输入商品重量', trigger: 'blur' }
        ],
        goods_number: [
          { required: true, message: '请输入商品数量', trigger: 'blur' }
        ],
        goods_cat: [
          {
            type: 'array',
            required: true,
            message: '请选择一个三类商品分类',
            trigger: 'change'
          }
        ]
      }
    }
  },
  created() {
    this.getCatList()
  },
  // 计算属性
  computed: {
    // 获取三级分类的ID
    cateId() {
      if (this.addGoodsForm.goods_cat.length === 3) {
        return this.addGoodsForm.goods_cat[
          this.addGoodsForm.goods_cat.length - 1
        ]
      }
      return null
    }
  },
  methods: {
    // 获取分类列表
    async getCatList() {
      const { data: res } = await this.$http.get('categories')
      if (res.meta.status !== 200) {
        return this.$message.error('获取商品分类失败')
      }
      console.log(res)
      this.catList = res.data
      console.log(this.catList)
    },
    // 判断是否为三级分类
    handleChange() {
      if (this.addGoodsForm.goods_cat.length !== 3) {
        this.addGoodsForm.goods_cat = []
      }
      console.log(this.addGoodsForm.goods_cat)
    },
    // 切换tabs时判断是否选中了三级分类
    isCatvalid(activeName, oldActiveName) {
      console.log(activeName)
      console.log(oldActiveName)
      if (this.addGoodsForm.goods_cat.length !== 3) {
        this.$message.error('请选择一个三级分类')
        return false
      }
      console.log(this.addGoodsForm.goods_cat)
      if (activeName === '1' && this.addGoodsForm.goods_cat.length === 3) {
        // 如果已请求到数据就不再重新请求数据，以保存用户选择的数据，提升用户体验
        if (this.paramsList.length !== 0) return
        console.log('你运行了吗动')
        this.getParamsList(activeName)
      }
      if (activeName === '2' && this.addGoodsForm.goods_cat.length === 3) {
        // 如果已请求到数据就不再重新请求数据，以保存用户选择的数据，提升用户体验
        if (this.staticList.length !== 0) return
        console.log('你运行了吗静')
        this.getParamsList(activeName)
      }
    },
    // 获取参数列表
    async getParamsList(activeName) {
      const sel = activeName === '1' ? 'many' : 'only'
      const { data: res } = await this.$http.get(
        `categories/${this.cateId}/attributes`,
        {
          params: { sel }
        }
      )
      if (res.meta.status !== 200) return this.$message.error('请求参数失败')
      // console.log(res.data)
      // console.log(sel)
      if (sel === 'many') {
        res.data.forEach(item => {
          item.attr_vals = item.attr_vals ? item.attr_vals.split(' ') : []
          item.checkDList = []
        })
        this.paramsList = res.data
        console.log(this.paramsList)
      } else {
        this.staticList = res.data
        console.log(this.staticList)
      }
    },
    // 当删除上传图片是触发
    handleRemove(file, fileList) {
      const index = this.addGoodsForm.pics.findIndex(value => {
        return value.pic === file.response.data.tmp_path
      })
      this.addGoodsForm.pics.splice(index, 1)
    },
    // 点击上传列表触发的函数
    handlePreview(file) {
      console.log(file)
      this.dialogVisible = true
      this.srcUrl = file.response.data.url
    },
    // 上传文件成功的函数
    handleSuccess(response, file, fileList) {
      this.addGoodsForm.pics.push({ pic: response.data.tmp_path })
    },
    // 添加商品
    addGoods() {
      this.$refs.addGoodsFormRef.validate(async(valid) => {
        if (!valid) return this.$message.error('请填写必填的数据')
        this.paramsList.forEach(item => {
          this.addGoodsForm.attrs.push({ attr_id: item.attr_id, attr_value: item.checkDList.join(' ') })
        })
        this.staticList.forEach(item => {
          this.addGoodsForm.attrs.push({ attr_id: item.attr_id, attr_value: item.attr_vals })
        })
        const form = _.cloneDeep(this.addGoodsForm)
        form.goods_cat = form.goods_cat.join(',')
        console.log(form)
        const { data: ret } = await this.$http.post('goods', form)
        if (ret.meta.status !== 201) return this.$message.error('添加商品失败')
        // this.$refs.addGoodsFormRef.resetFields()
        // this.addGoodsForm.attrs = []
        this.$message.success('添加商品成功')
        this.$router.push('/goods')
      })
    }
  }
}
</script>

<style lang="less" scoped>
.add-goods {
  padding: 20px;
}
.el-card {
  margin-top: 20px;
}
.el-steps {
  margin: 20px 0;
}
.el-checkbox {
  margin: 0 20px 0 0 !important;
}
.el-dialog {
  img {
    width: 100%;
  }
}
.addDoodsBtn {
  margin-top: 30px;
}
</style>
