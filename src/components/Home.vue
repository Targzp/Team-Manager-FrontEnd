<!--
 * @Author: 胡晨明
 * @Date: 2021-08-15 15:53:55
 * @LastEditTime: 2021-08-30 21:02:55
 * @LastEditors: Please set LastEditors
 * @Description: 首页
 * @FilePath: \bloge:\Vue_store\manager-fe\src\components\Home.vue
-->
<template>
  <div class="basic-layout">
    <div :class="['nav-side', isCollapse ? 'fold' : 'unfold']">
      <!-- 系统 logo -->
      <div class="logo">
        <img src="../assets/images/logo.png" alt="" />
        <span>WorkTile</span>
      </div>
      <!-- 导航菜单 -->
      <el-menu
        background-color="#001529"
        text-color="#FFF"
        :collapse="isCollapse"
        router
        :default-active="activeMenu"
        class="nav-menu"
      >
        <tree-menu :userMenu="userMenu" />
      </el-menu>
    </div>
    <div :class="['content-right', isCollapse ? 'fold' : 'unfold']">
      <div class="nav-top">
        <div class="nav-left">
          <div class="menu-fold" @click="toggle">
            <i class="el-icon-s-fold"></i>
          </div>
          <div class="bread">
            <bread-crumb />
          </div>
        </div>
        <div class="user-info">
          <el-badge :is-dot="!!noticeCount" class="notice" type="danger">
            <i class="el-icon-bell"></i>
          </el-badge>
          <el-dropdown @command="handleLogOut">
            <span class="user-link">
              {{ userInfo.userName }}
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item cpmmand="email">{{
                  userInfo.userEmail
                }}</el-dropdown-item>
                <el-dropdown-item command="logout">退出</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </div>
      <div class="wrapper">
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>

<script>
import TreeMenu from "./TreeMenu.vue";
import BreadCrumb from "./BreadCrumb.vue";
export default {
  name: "Home",
  components: {
    TreeMenu,
    BreadCrumb,
  },
  data() {
    return {
      isCollapse: false,
      userInfo: this.$store.state.userInfo,
      noticeCount: 0,
      userMenu: [],
      activeMenu: location.hash.slice(1),
    };
  },
  mounted() {
    this.getNoticeCount();
    this.getMenuList();
  },
  methods: {
    /**
     * @description: 控制菜单栏缩放
     */
    toggle() {
      this.isCollapse = !this.isCollapse;
    },
    /**
     * @description: 控制退出登录
     */
    handleLogOut(key) {
      if (key === "email") return;
      this.$store.commit("saveUserInfo", "");
      this.userInfo = null;
      this.$router.push("/login");
    },
    /**
     * @description: 获取通知消息数量
     */
    async getNoticeCount() {
      try {
        const count = await this.$api.noticeCount();
        this.noticeCount = count;
      } catch (error) {
        console.log(error);
      }
    },
    /**
     * @description: 获取菜单列表
     */
    async getMenuList() {
      try {
        const list = await this.$api.getMenuList({ menuState: 1 });
        this.userMenu = list;
      } catch (error) {
        console.log(error);
      }
    },
  },
};
</script>

<style lang="scss">
.basic-layout {
  position: relative;
  .nav-side {
    position: fixed;
    width: 200px;
    height: 100vh;
    background-color: #001529;
    color: #fff;
    overflow-y: auto;
    overflow-x: hidden;
    transition: width 0.3s;
    .logo {
      display: flex;
      align-items: center;
      font-size: 18px;
      height: 50px;
      margin-top: 5px;
      img {
        width: 40px;
        height: 40px;
        margin: 0 16px;
      }
    }
    .nav-menu {
      border-right: none;
    }
    /* 合并 */
    /* 这个选择器表示同时具有 nav-side 和 fold 的元素 */
    &.fold {
      width: 64px;
    }
    /* 展开 */
    &.unfold {
      width: 200px;
    }
  }
  .content-right {
    min-width: 955px;
    transition: 0.3s margin-left;
    margin-left: 200px;
    /* 合并 */
    &.fold {
      margin-left: 64px;
    }
    /* 展开 */
    &.unfold {
      margin-left: 200px;
    }
    .nav-top {
      height: 50px;
      line-height: 50px;
      display: flex;
      justify-content: space-between;
      border-bottom: 1px solid #ddd;
      padding: 0 20px;
      .nav-left {
        display: flex;
        align-items: center;
        .menu-fold {
          margin-right: 15px;
          font-size: 20px;
        }
      }
      .user-info {
        .notice {
          line-height: 25px;
          margin-right: 15px;
        }
        .user-link {
          cursor: pointer;
          color: #409eff;
        }
      }
    }
    .wrapper {
      background: #eef0f3;
      padding: 20px;
      height: calc(100vh - 50px);
    }
  }
}
</style>
