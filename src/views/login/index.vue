<template>
  <div class="login-container">
    <div class="login-card">
      <div class="login-title">
        <div class="nest-logo">
          <svg-icon name="nest-logo"></svg-icon>
        </div>
        <div>自动化设备缺陷知识库</div>
      </div>
      <div class="login-content">
        <el-form ref="loginFormRef" :disabled="loading" :model="formData" :rules="loginFormRules">
          <el-form-item prop="account">
            <el-input v-model.trim="formData.account" size="large" placeholder="帐号"></el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input
              type="password"
              size="large"
              v-model="formData.password"
              placeholder="密码"
              @keyup.enter="loginEvent"
            ></el-input>
          </el-form-item>
          <el-button  :loading="loading"  size="large"   @click.prevent="loginEvent" plain> 登录 </el-button>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { useRoute, useRouter } from 'vue-router'

import { login, type LoginResult } from '../../api/user'
import { setToken } from '../../utils/cache'
import { setStorageExpire } from "../../utils/index"
import CryptoJS from 'crypto-js';

const formData = ref({
  account: '',
  password: ''
})
const loginFormRules = {
  account: [{ required: true, message: '请输入帐号', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }]
}

const loginFormRef = ref()
const loading = ref<boolean>(false)

const router = useRouter()
const route = useRoute()

const loginEvent = () => {


  if (loginFormRef.value) {
    loginFormRef.value.validate(async (valid: boolean) => {
      if (valid) {
        loading.value = true
        const res = await login(formData.value)
        loading.value = false
        if (res?.code === 200) {
          const data:any = res.data ;
          setStorageExpire('token',data.token,30)
          // setToken(data.accessToken, data.refreshToken)
          router.replace((route.query?.redirect || '/') as string)
        } else {
          ElMessage({ message: res?.msg || '网络异常，请稍后重试', type: 'error' })
        }
      }
    })
  }
}
</script>

<style  scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100vw;
  min-height: 100vh;

  background-image: url("../../assets/login1.jpg");
  background-size: 100% 100%;
 
}
 .login-card {
    width: 420px;
    border-radius: 20px;
    box-shadow: 0 0 10px #dcdfe6;
    background-color: rgba(0, 101, 105, 0.9);
    overflow: hidden;
  }
  .login-title {
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 28px;
      font-weight: 500;
      /* font-family: 'app-name-font'; */
      height: 88px;
    }
    .login-content {
      padding: 20px 50px 50px 50px;
    }
    .el-button {
      width: 100%;
      margin-top: 5px;
    }
    .nest-logo {
      margin: 24px 16px 0 0;
    }
</style>
