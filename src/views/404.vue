<!--
 * @Author: 胡晨明
 * @Date: 2021-09-02 17:22:36
 * @LastEditTime: 2021-09-02 17:46:27
 * @LastEditors: Please set LastEditors
 * @Description: 404 页面组件
 * @FilePath: \bloge:\Vue_store\manager-fe\src\views\404.vue
-->
<template>
  <n-result
    class="exception"
    status="404"
    title="404 资源不存在"
    description="生活总归带点荒谬"
  >
    <template #footer>
      <n-button type="info" ghost @click="handleGoHome">找点乐子吧</n-button>
    </template>
  </n-result>
</template>

<script>
import { NResult, NButton } from "naive-ui";
export default {
  name: "404",
  components: {
    NResult,
    NButton,
  },
  methods: {
    handleGoHome() {
      this.$router.push("/");
    },
  },
};
</script>

<style lang="scss">
.exception {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
</style>