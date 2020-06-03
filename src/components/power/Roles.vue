<template>
  <div class="roles-template">
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 添加添加角色Dialog框 -->
    <el-dialog
      title="添加角色"
      :visible.sync="addRolesDialogVisible"
      width="50%"
      @close="resetAddRolesFrom"
    >
      <!-- 添加角色表单区域 -->
      <el-form :rules="addRolesRules" ref="addRolesRef" :model="addRolesFrom" label-width="80px">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="addRolesFrom.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="addRolesFrom.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addRolesDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addRoles">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 添加添加角色Dialog框 -->
    <el-dialog
      title="修改角色"
      :visible.sync="editRolesDialogVisible"
      width="30%"
      @close="clearValidate"
    >
      <!-- 修改角色表单区域 -->
      <el-form :rules="addRolesRules" ref="editRolesRef" :model="editRolesFrom" label-width="80px">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="editRolesFrom.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="editRolesFrom.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editRolesDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editRolesByid">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 展示权限的Dialog框 -->
    <el-dialog
      @close="resetKeyArry"
      title="分配权限"
      :visible.sync="showRightsDialogVisible"
      width="30%"
    >
      <el-tree
        node-key="id"
        :default-checked-keys="keyArry"
        default-expand-all
        show-checkbox
        @check-change="handleCheckChange"
        :data="rightTree"
        :props="defaultProps"
        @node-click="handleNodeClick"
        ref="treeRef"
      ></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="showRightsDialogVisible = false">取 消</el-button>
        <el-button @click="allotRights" type="primary">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 卡片主体内容区 -->
    <el-card>
      <!-- 添加角色按钮 -->
      <el-row>
        <el-button type="primary" @click="addRolesDialogVisible = true">添加角色</el-button>
      </el-row>

      <!-- <pre>{{rolesList}}</pre> -->
      <!-- 展示角色列表的表格 -->
      <el-table border stripe :data="rolesList" style="width: 100%">
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-row class="one-roles" v-for="item1 in scope.row.children" :key="item1.id">
              <el-col :span="6">
                <el-tag
                  @close="deleteRightsById(scope.row,item1.id)"
                  closable
                  type
                >{{item1.authName}}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <el-col :span="18">
                <el-row class="two-roles" v-for="item2 in item1.children" :key="item2.id">
                  <el-col :span="8">
                    <el-tag
                      @close="deleteRightsById(scope.row,item2.id)"
                      closable
                      type="success"
                    >{{item2.authName}}</el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="16">
                    <el-row class="three-roles">
                      <el-tag
                        v-for="item3 in item2.children"
                        :key="item3.id"
                        closable
                        type="warning"
                        @close="deleteRightsById(scope.row,item3.id)"
                      >{{item3.authName}}</el-tag>
                    </el-row>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column type="index"></el-table-column>
        <el-table-column prop="roleName" label="角色名称"></el-table-column>
        <el-table-column prop="roleDesc" label="角色描述"></el-table-column>
        <el-table-column label="操作" width="300">
          <template slot-scope="scope">
            <el-button
              @click="getRoleById(scope.row.id)"
              size="mini"
              type="primary"
              icon="el-icon-edit"
            >编辑</el-button>
            <el-button
              @click="deleteRolesById(scope.row.id)"
              size="mini"
              type="danger"
              icon="el-icon-delete"
            >删除</el-button>
            <el-button
              @click="showRights(scope.row)"
              size="mini"
              type="warning"
              icon="el-icon-setting"
            >分配权限</el-button>
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
      rolesList: [],
      rightTree: [],
      keyArry: [],
      defaultProps: {
        children: 'children',
        label: 'authName'
      },
      addRolesDialogVisible: false,
      editRolesDialogVisible: false,
      showRightsDialogVisible: false,
      editRolesdata: '',
      // 当前用户id
      rolesid: '',
      editRolesFrom: {
        roleName: '',
        roleDesc: ''
      },
      // 添加用户表单数据
      addRolesFrom: {
        roleName: '',
        roleDesc: ''
      },
      addRolesRules: {
        roleName: [
          { required: true, message: '请输入角色名称', trigger: 'blur' }
        ],
        roleDesc: [
          { required: true, message: '请输入角色描述', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.getRolesList()
  },
  methods: {
    // 获取角色列表
    async getRolesList() {
      const { data: res } = await this.$http.get('roles')
      if (res.meta.status !== 200) {
        return this.$message.error('请求角色列表失败')
      }
      this.rolesList = res.data
    },
    // 添加角色
    addRoles() {
      this.$refs.addRolesRef.validate(async valid => {
        if (!valid) return this.$message.error('参数不对')
        const { data: ret } = await this.$http.post('roles', this.addRolesFrom)
        if (ret.meta.status !== 201) return this.$message.error('角色添加失败')
        this.$message.success('角色添加成功')
        this.addRolesDialogVisible = false
        this.getRolesList()
        // this.$refs.addRolesRef.resetFields()
      })
    },
    resetAddRolesFrom() {
      this.$refs.addRolesRef.resetFields()
    },
    // 通过ID删除角色的权限
    async deleteRightsById(role, rightsId) {
      this.$confirm('此操作将永久删除该权限, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          const { data: ret } = await this.$http.delete(
            `roles/${role.id}/rights/${rightsId}`
          )
          if (ret.meta.status !== 200) {
            return this.$message.error('删除权限失败')
          }
          this.$message.success('删除权限成功')
          role.children = ret.data
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    // 通过id 查询角色
    async getRoleById(roleid) {
      const { data: ret } = await this.$http.get(`roles/${roleid}`)
      if (ret.meta.status !== 200) return this.$message.error('获取数据失败')
      this.editRolesFrom = ret.data
      this.editRolesdata = JSON.stringify(ret.data)
      this.editRolesDialogVisible = true
    },
    // 移除表单的校验效果
    clearValidate() {
      this.$refs.editRolesRef.clearValidate()
    },
    // 通过id修改角色
    async editRolesByid() {
      if (typeof this.editRolesdata === 'string') {
        this.editRolesdata = JSON.parse(this.editRolesdata)
      }
      if (
        this.editRolesdata.roleName === this.editRolesFrom.roleName &&
        this.editRolesdata.roleDesc === this.editRolesFrom.roleDesc
      ) {
        return this.$message.error('修改数据与原数据相同')
      }
      const { data: ret } = await this.$http.put(
        `roles/${this.editRolesFrom.roleId}`,
        this.editRolesFrom
      )
      if (ret.meta.status !== 200) return this.$message.error('修改角色失败')
      this.editRolesDialogVisible = false
      this.$message.success('修改角色成功')
      this.getRolesList()
    },
    // 通过ID删除角色
    deleteRolesById(id) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          const { data: ret } = await this.$http.delete(`roles/${id}`)
          if (ret.meta.status !== 200) return this.$message.error('删除失败')
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
          this.getRolesList()
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    // 获取keyArry
    getKeyArry(data, arry) {
      if (!data.children) {
        return arry.push(data.id)
      }
      data.children.forEach(element => {
        this.getKeyArry(element, arry)
      })
    },
    // 关闭时重置resetKeyArry
    resetKeyArry() {
      this.keyArry = []
    },
    // 展示权限列表
    async showRights(data) {
      this.showRightsDialogVisible = true
      const { data: ret } = await this.$http.get('rights/tree')
      if (ret.meta.status !== 200) return this.$message.error('获取权限失败')
      this.rightTree = ret.data
      this.getKeyArry(data, this.keyArry)
      this.rolesid = data.id
    },
    // 点击树的节点
    handleNodeClick(data) {
      console.log(data)
    },
    // 节点改变
    handleCheckChange(data, checked, indeterminate) {
      console.log(data, checked, indeterminate)
    },
    // 分配权限
    async allotRights() {
      const keys = [
        ...this.$refs.treeRef.getCheckedKeys(),
        ...this.$refs.treeRef.getHalfCheckedKeys()
      ]
      const idstr = keys.join(',')
      console.log(idstr)
      const { data: ret } = await this.$http.post(`roles/${this.rolesid}/rights`, { rids: idstr })
      if (ret.meta.status !== 200) return this.$message.erro('分配权限失败')
      this.$message.success('分配权限成功')
      this.showRightsDialogVisible = false
      this.getRolesList()
    }
  }
}
</script>

<style lang="less" scoped>
.roles-template {
  padding: 20px;
}
.el-card {
  margin-top: 20px;
}
.el-table {
  margin-top: 20px;
  font-size: 12px;
}
.one-roles {
  border-bottom: 1px solid #ccc;
  display: flex;
  align-items: center;
}
.two-roles {
  border-bottom: 1px solid #ccc;
  display: flex;
  align-items: center;
}
.one-roles .el-tag {
  margin: 10px 10px 10px 0 !important;
}

.two-roles:last-child {
  border-bottom: none;
}
.one-roles:first-child {
  border-top: 1px solid #ccc;
}
</style>
