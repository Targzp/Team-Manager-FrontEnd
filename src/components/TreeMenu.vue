<!--
 * @Author: 胡晨明
 * @Date: 2021-08-20 14:25:23
 * @LastEditTime: 2021-08-20 15:38:58
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \bloge:\Vue_store\manager-fe\src\components\TreeMenu.vue
-->
<template>
    <template v-for="menu in userMenu" :key="menu._id">
        <el-submenu v-if="menu.children && menu.children.length > 0 && menu.children[0].menuType == 1" :index="menu.path">
            <template #title>
                <i :class="menu.icon"></i>
                <span>{{menu.menuName}}</span>
            </template>
            <tree-menu :userMenu="menu.children"/>
        </el-submenu>
        <el-menu-item v-else-if="menu.menuType==1" :index="menu.path">{{menu.menuName}}</el-menu-item>
    </template>
</template>

<script>
export default {
  name: 'TreeMenu',
  props: {
    userMenu: {
      type: Array,
      default () {
        return []
      }
    }
  }
}
</script>
