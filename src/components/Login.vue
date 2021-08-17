<!--
 * @Author: 胡晨明
 * @Date: 2021-08-16 12:48:28
 * @LastEditTime: 2021-08-17 15:33:40
 * @Description: 登录页面组件
 * @FilePath: \bloge:\Vue_store\manager-fe\src\components\Login.vue
-->
<template>
  <div class="login">
    <h1>登录界面</h1>
    <el-button @click="handleHomeClick">回首页</el-button>
  </div>
</template>

<script>
export default {
  name: 'login',
  methods: {
    handleHomeClick () {
      this.$router.push('/welcome')
    }
  },
  mounted() {
    this.$request({
      method: 'get',
      url: '/login',
      data: {
        name: 'hcm'
      }
    }).then(res => {
      console.log(res)
    })
  }
}
</script>

<style scoped>
</style>
