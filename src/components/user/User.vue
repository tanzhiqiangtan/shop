<template>
  <div class="user-content">
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 用户列表卡片区域 -->
    <el-card class="box-card">
      <!-- 搜索框 -->

      <el-row :gutter="20">
        <el-col :span="8">
          <el-input
            clearable
            @clear="getUserList"
            placeholder="请输入搜索内容"
            class="input-with-select"
            v-model="queryInfo.query"
          >
            <el-button slot="append" icon="el-icon-search" @click="searchUsers"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="dialogVisible=true">添加用户</el-button>
        </el-col>
      </el-row>
      <!-- 用户表格区 -->
      <el-table stripe border :data="usersList" style="width: 100%">
        <el-table-column type="index"></el-table-column>
        <el-table-column prop="username" label="姓名" width="180"></el-table-column>
        <el-table-column prop="email" label="邮箱" width="180"></el-table-column>
        <el-table-column prop="mobile" label="电话"></el-table-column>
        <el-table-column prop="role_name" label="角色"></el-table-column>
        <el-table-column label="状态">
          <template slot-scope="scope">
            <el-switch
              @change="changeUserStatus(scope.row)"
              v-model="scope.row.mg_state"
              active-color="#13ce66"
              inactive-color="#ff4949"
            ></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="175px">
          <template slot-scope="scope">
            <el-button
              @click="showEditDialog(scope.row.id)"
              type="primary"
              icon="el-icon-edit"
              size="mini"
            ></el-button>

            <el-button
              @click="removeUserById(scope.row.id)"
              type="danger"
              icon="el-icon-delete"
              size="mini"
            ></el-button>
            <el-tooltip class="item" effect="dark" content="分配角色" placement="top">
              <el-button type="warning" icon="el-icon-s-tools" size="mini"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!-- 页码 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page.sync="queryInfo.pagenum"
        :page-sizes="[2,5,10]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>
    <!-- 对话框 -->
    <el-dialog
      @close="clearfromdata('AddUserRef')"
      title="添加用户"
      :visible.sync="dialogVisible"
      width="50%"
    >
      <!-- 添加用户表单区域 -->
      <div style="margin: 20px;"></div>
      <el-form
        ref="AddUserRef"
        :rules="AddUserRules"
        label-position="right"
        label-width="80px"
        :model="AddUserformData"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="AddUserformData.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input type="password" v-model="AddUserformData.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="AddUserformData.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="AddUserformData.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="AddUser">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改用户资料的弹出框 -->
    <el-dialog
      @close="clearfromdata('EditUserRef')"
      title="提示"
      :visible.sync="EditUserVisible"
      width="50%"
    >
      <el-form :rules="AddUserRules" ref="EditUserRef" :model="edituser" label-width="80px">
        <el-form-item label="用户名">
          <el-input v-model="edituser.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="edituser.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="edituser.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="EditUserVisible = false">取 消</el-button>
        <el-button type="primary" @click="Edituser">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    // 自定义验证规则
    var validateEmail = (rule, value, callback) => {
      const regEmail = /^\w+@\w+(\.\w+)+$/
      if (!regEmail.test(value)) {
        callback(new Error('请输入合法的邮箱'))
      }
      callback()
    }
    var validateMobile = (rule, value, callback) => {
      const regMobile = /^1[34578]\d{9}$/
      if (!regMobile.test(value)) {
        callback(new Error('请输入合法的手机号码'))
      }
      callback()
    }
    return {
      // 请求用户列表的参数
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 2
      },
      // 用户列表的数据
      total: 0,
      usersList: [],
      // 用过id查询的数据
      edituser: {},
      // 控制是否打开新增对话框的数据
      dialogVisible: false,
      // 控制是否打开修改用户对话框的数据
      EditUserVisible: false,
      // 新增用户的表单数据
      AddUserformData: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      // 新增用户验证规则
      AddUserRules: {
        username: [
          { required: true, message: '客户名称不能为空', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '客户名称不能为空', trigger: 'blur' },
          { min: 3, max: 15, message: '长度在 3 到 15 个字符', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '邮箱不能为空', trigger: 'blur' },
          { validator: validateEmail, trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '手机不能为空', trigger: 'blur' },
          { validator: validateMobile, trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    // 获取用户列表数据
    this.getUserList()
  },
  methods: {
    // 获取用户列表数据
    async getUserList() {
      const { data: ret } = await this.$http.get('users', {
        params: this.queryInfo
      })
      if (ret.meta.status !== 200) {
        return this.$message.error('请求用户列表数据失败')
      }
      console.log(ret)
      this.total = ret.data.total
      console.log(ret.data.users)
      this.usersList = ret.data.users
      console.log(this.usersList)
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`)
      this.queryInfo.pagesize = val
      this.getUserList()
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`)
      this.queryInfo.pagenum = val
      this.getUserList()
    },
    // 搜索用户
    searchUsers() {
      this.queryInfo.pagenum = 1
      this.queryInfo.pagesize = 2
      this.getUserList()
    },
    // 改变用户状态
    async changeUserStatus(val) {
      const { data: ret } = await this.$http.put(
        `users/${val.id}/state/${val.mg_state}`
      )
      if (ret.meta.status !== 200) {
        val.mg_state = !val.mg_state
        return this.$message.error('修改用户状态失败')
      }
      this.$message.success('修改用户状态成功')
    },
    // 对话框关闭清空表单数据
    clearfromdata(refName) {
      this.$refs[refName].resetFields()
    },
    // 添加用户
    AddUser() {
      this.$refs.AddUserRef.validate(async boolean => {
        console.log(boolean)
        if (!boolean) return
        const { data: ret } = await this.$http.post(
          'users',
          this.AddUserformData
        )
        console.log(ret)
        if (ret.meta.status !== 201) return this.$message.error('新增用户失败')
        this.$message.success('新增用户成功')
        this.dialogVisible = false
        this.getUserList()
      })
    },
    // 通过id查询用户
    async showEditDialog(id) {
      this.EditUserVisible = true
      console.log(id)
      const { data: ret } = await this.$http.get(`users/${id}`)
      if (ret.meta.status !== 200) { return this.$message.error('获取当前用户数据失败') }
      this.edituser = ret.data
    },
    // 修改用户信息
    Edituser() {
      this.$refs.EditUserRef.validate(async boolean => {
        if (!boolean) return
        this.EditUserVisible = false
        const { data: ret } = await this.$http.put(
          `users/${this.edituser.id}`,
          { email: this.edituser.email, mobile: this.edituser.mobile }
        )
        console.log(ret)
        if (ret.meta.status !== 200) { return this.$message.error('修改当前用户数据失败') }
        this.$message.success('修改当前用户数据成功')
        this.getUserList()
      })
    },
    // 通过ID删除用户
    // removeUserById(id) {
    //   this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
    //     confirmButtonText: '确定',
    //     cancelButtonText: '取消',
    //     type: 'warning'
    //   })
    //     .then(async() => {
    //       console.log(id)
    //       const { data: ret } = await this.$http.delete(`users/${id}`)
    //       if (ret.meta.status !== 200) return this.$message.error('删除用户失败用户失败')
    //       this.$message.success('删除当前用户成功')
    //       // this.getUserList()
    //       // console.log(1)
    //     })
    //     .catch(() => {
    //       this.$message({
    //         type: 'info',
    //         message: '已取消删除'
    //       })
    //     })
    // }
    // 通过ID删除用户
    removeUserById(id) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then((value) => {
        console.log(value)

        return this.$http.delete(`users/${id}`)
      }).then(
        value => {
          if (value.data.meta.status !== 200) {
            return this.$message({
              type: 'error',
              message: '删除成功!'
            })
          }
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
          // 删除的bug
          // console.log(this.total)
          // console.log(this.queryInfo.pagesize)
          const yushu = (this.total) % (this.queryInfo.pagesize)
          // console.log(yushu)
          this.queryInfo.pagenum = yushu === 1 ? this.queryInfo.pagenum - 1 : this.queryInfo.pagenum
          // console.log(this.queryInfo.pagenum)
          // 最后更新用户列
          this.getUserList()
        }
      )
        .catch((reason) => {
          console.log(reason)
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    }
  }
}
</script>

<style lang="less" scoped>
.el-breadcrumb {
  margin-bottom: 15px;
}
.user-content {
  padding: 15px;
}
.el-table {
  margin: 15px 0;
  font-size: 12px;
}
</style>
