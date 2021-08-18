<!--
 * @Author: 胡晨明
 * @Date: 2021-08-16 12:48:28
 * @LastEditTime: 2021-08-18 22:22:52
 * @Description: 登录页面组件
 * @FilePath: \bloge:\Vue_store\manager-fe\src\components\Login.vue
-->
<template>
  <div class="login-wrapper">
    <div class="model">
      <el-form ref="userForm" :model="user" status-icon :rules="rules">
        <div class="title">WT-团队项目管理</div>
        <el-form-item prop="userName">
          <el-input type="text" prefix-icon="el-icon-user" v-model="user.userName"/>
        </el-form-item>
        <el-form-item prop="userPwd">
          <el-input type="password" prefix-icon="el-icon-lock" v-model="user.userPwd"/>
        </el-form-item>
        <el-form-item>
          <n-button type="info" class="btn-login" size="large" @click="handleLoginClick">登录</n-button>
        </el-form-item>
        <el-form-item>
          <n-button type="info" class="btn-register" size="large" ghost>注册</n-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { NButton } from 'naive-ui'
export default {
  name: 'login',
  data () {
    return {
      user: {
        userName: '',
        userPwd: ''
      },
      rules: {
        userName: [
          { required: true, message: "请输入用户名", trigger: 'blur' }
        ],
        userPwd: [
          { required: true, message: "请输入密码", trigger: 'blur' }
        ]
      }
    }
  },
  components: {
    NButton
  },
  methods: {
    handleLoginClick () {
      this.$refs.userForm.validate(async (valid) => {
        if (valid) {
          const res = await this.$api.login(this.user)
          if (res.userId) {
            this.$store.commit('saveUserInfo', res)
            this.$router.push('/welcome')
          }
        } else {

        }
      })
    }
  },
}
</script>

<style lang="scss">
.login-wrapper {
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f9fcff;
  .model {
    width: 500px;
    padding: 20px 50px;
    background-color: #fff;
    border-radius: 4px;
    box-shadow: 0px 0px 10px 3px #c7c9cd;
    .title {
      font-size: 25px;
      line-height: 1.5;
      text-align: center;
      margin-bottom: 30px;
    }
    .btn-login,.btn-register {
      width: 100%;
    }
  }
}
</style>
