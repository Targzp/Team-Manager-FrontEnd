<!--
 * @Author: 胡晨明
 * @Date: 2021-08-15 15:53:55
 * @LastEditTime: 2021-08-17 15:35:59
 * @LastEditors: Please set LastEditors
 * @Description: 首页
 * @FilePath: \bloge:\Vue_store\manager-fe\src\components\Home.vue
-->
<template>
  <div class="basic-layout">
    <div class="nav-side"></div>
    <div class="content-right">
      <div class="nav-top"></div>
      <div class="wrapper">
        <div class="main-page">
          <router-view></router-view>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
</script>

<style lang="scss" scoped>
.basic-layout {
  position: relative;
  .nav-side {
    position: fixed;
    width: 200px;
    height: 100vh;
    background-color: #001529;
    color: #FFF;
    overflow-y: auto;
    transition: width .5s;
  }
  .content-right {
    margin-left: 200px;
    .nav-top {
      height: 50px;
      line-height: 50px;
      display: flex;
      justify-content: space-between;
      border-bottom: 1px solid #ddd;
      padding: 0 20px;
    }
    .wrapper {
      background: #eef0f3;
      padding: 20px;
      height: calc(100vh - 50px);
      .main-page {
        background: #FFF;
        height: 100%;
      }
    }
  }
}
</style>
