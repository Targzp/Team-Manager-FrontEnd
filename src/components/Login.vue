<template>
  <h1>登录界面</h1>
  <el-button @click="handleHomeClick" round>回首页</el-button>
</template>

<script setup>
import { useRouter } from 'vue-router'

const useHomeEffect = () => {
  const router = useRouter()
  const handleHomeClick = () => {
    router.push('/welcome')
  }
  return {
    handleHomeClick
  }
}
const { handleHomeClick } = useHomeEffect()
</script>

<style scoped>
</style>
