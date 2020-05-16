<template>
  <div class="login_container">
    <!-- 登陆盒子 -->
    <div class="login_box">
      <!-- 登陆头像 -->
      <div class="avatar_box">
        <img src="../assets/logo.png" alt />
      </div>
      <!-- 登陆表单区域 -->
      <el-form
        ref="LoginFormRef"
        :model="fromdata"
        :rules="rules"
        label-width="0"
        class="longin_form"
      >
        <el-form-item prop="username">
          <el-input
            v-model="fromdata.username"
            placeholder="请输入账号"
            prefix-icon="iconfont icon-user"
          ></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            show-password
            v-model="fromdata.password"
            placeholder="请输入密码"
            prefix-icon="iconfont icon-3702mima"
          ></el-input>
        </el-form-item>
        <el-form-item class="btns">
          <el-button type="primary" @click="login">登陆</el-button>
          <el-button type="info" @click="resetForm">重置</el-button>
        </el-form-item>
      </el-form>

    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      fromdata: {
        username: '',
        password: ''
      },
      rules: {
        username: [
          { required: true, message: '客户名称不能为空', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '客户名称不能为空', trigger: 'blur' },
          { min: 3, max: 15, message: '长度在 3 到 15 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    // 重置表单数据
    resetForm() {
      console.log(this)
      this.$refs.LoginFormRef.resetFields()
    },
    // 登陆
    login() {
      this.$refs.LoginFormRef.validate(async boolean => {
        console.log(boolean)
        if (!boolean) return
        const res = await this.$http.post('login', this.fromdata)
        if (res.data.meta.status !== 200) {
          return this.$message.error(res.data.meta.msg)
        }
        this.$message.success(res.data.meta.msg)
        // console.log(res.data.data.token)
        // 本地储存token
        window.sessionStorage.setItem('token', res.data.data.token)
        // console.log(this)
        this.$router.push('/home')
      })
    }
  }
}
</script>

<style lang="less" scoped>
.login_container {
  background-color: #2b5b6b;
  height: 100%;
  .login_box {
    width: 450px;
    height: 300px;
    background-color: #fff;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    border-radius: 5px;
    .avatar_box {
      width: 130px;
      height: 130px;
      background-color: #ccc;
      position: absolute;
      left: 50%;
      transform: translate(-50%, -50%);
      border-radius: 75px;
      border: 5px solid #fff;
      box-shadow: 0 0 10px #ddd;
      img {
        height: 100%;
        border-radius: 50%;
      }
    }
    .btns {
      display: flex;
      justify-content: flex-end;
    }
  }
}
.longin_form {
  position: absolute;
  bottom: 0;
  width: 100%;
  padding: 0 20px;
  box-sizing: border-box;
}
</style>
