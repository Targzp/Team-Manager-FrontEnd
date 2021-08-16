<template>
  <h1>欢迎来到主界面</h1>
  <el-button @click="handleLoginClick">去登陆</el-button>
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

<style scoped>
</style>
