<script setup>
import { ref } from 'vue'
import { useUserStore } from '@/stores/index.js'
import { userLoginService } from '@/api/user.js'
import { useRouter } from 'vue-router'
const form = ref({
  email: '',
  password: ''
}) // 绑定表单元素
const formRef = ref()
const userUserStore = useUserStore()
const router = useRouter()
const rules = {
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    {
      type: 'email',
      message: '请输入正确的邮箱地址',
      trigger: 'blur'
    }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, message: '密码长度不能小于6位', trigger: 'blur' }
  ]
} // 配置验证规则
const login = async () => {
  await formRef.value.validate()
  const res = await userLoginService({
    email: form.value.email,
    password: form.value.password
  })
  console.log(res)
  userUserStore.setToken(res.data.token)
  userUserStore.setUser(res.data.userinfo)
  await router.push('/')
}
</script>

<template>
  <el-container>
    <!--      一个表单，里面是一个用户邮箱，一个是密码，最下面是登录按钮-->
    <el-card>
      <el-form
        label-width="auto"
        :ref="
          (el) => {
            formRef = el
          }
        "
        :rules="rules"
        :model="form"
      >
        <el-form-item label="用户邮箱：" prop="email">
          <el-input v-model="form.email"></el-input>
        </el-form-item>
        <el-form-item label="密码：" prop="password">
          <el-input v-model="form.password"></el-input>
        </el-form-item>
      </el-form>
      <el-button type="primary" @click="login">登录</el-button>
    </el-card>
  </el-container>
</template>

<style scoped lang="scss">
.el-container {
  width: 100vw;
  height: 100vh;
  background: url('../../assets/adminPic.png');
  .el-card {
    margin: 100px auto;
    width: 400px;
    height: 400px;
    background-color: #fff;
    display: flex;
    flex-direction: column;
    border-radius: 10px;
  }
  .el-form {
    width: 300px;
    height: 150px;
    padding: 20px;
    .el-form-item {
      margin-bottom: 20px;
    }
  }
  .el-button {
    margin: 0 120px;
  }
}
</style>
