<!--
 * @Author: 胡晨明
 * @Date: 2021-08-16 12:48:17
 * @LastEditTime: 2021-08-17 15:29:33
 * @Description: 欢迎页
 * @FilePath: \bloge:\Vue_store\manager-fe\src\components\Welcome.vue
-->
<template>
  <div class="welcome">
    <h1>欢迎来到主界面</h1>
    <el-button @click="handleLoginClick">去登陆</el-button>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const useLoginEffect = () => {
  const router = useRouter()
  const handleLoginClick = () => {
    router.push('/login')
  }
  return {
    handleLoginClick
  }
}
const { handleLoginClick } = useLoginEffect()
</script>

<style lang="scss" scoped>
</style>
