<!--
 * @Author: 胡晨明
 * @Date: 2021-08-16 12:48:17
 * @LastEditTime: 2021-08-19 16:01:25
 * @Description: 欢迎页
 * @FilePath: \bloge:\Vue_store\manager-fe\src\components\Welcome.vue
-->
<template>
  <div class="welcome">
    <div class="content">
      <div class="sub-title">欢迎使用</div>
      <div class="title">WorkTile团队项目管理</div>
    </div>
    <div class="img"></div>
  </div>
</template>

<script setup>
</script>

<style lang="scss">
.welcome {
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  .content {
    position: relative;
    bottom: 40px;
    .sub-title {
      font-size: 30px;
      line-height: 42px;
      color: #333;
    }
    .title {
      font-size: 40px;
      line-height: 62px;
      color: #409eff
    }
  }
  .img {
    margin-left: 105px;
    background-image: url('../assets/images/welcome.png');
    width: 371px;
    height: 438px;
  }
}
</style>
