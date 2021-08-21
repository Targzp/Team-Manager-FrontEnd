<!--
 * @Author: 胡晨明
 * @Date: 2021-08-20 21:02:47
 * @LastEditTime: 2021-08-20 21:34:22
 * @LastEditors: Please set LastEditors
 * @Description: 面包屑组件
 * @FilePath: \bloge:\Vue_store\manager-fe\src\components\BreadCrumb.vue
-->
<template>
    <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item v-for="(item,index) in breadList" :key="item.path">
            <router-link to="/welcome" v-if="index===0">{{item.meta.title}}</router-link>
            <span v-else>{{item.meta.title}}</span>
        </el-breadcrumb-item>
    </el-breadcrumb>
</template>

<script>
export default {
  name: 'BreadCrumb',
  computed: {
    breadList () {
      return this.$route.matched
    }
  }
}
</script>