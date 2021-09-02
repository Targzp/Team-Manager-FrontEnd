<!--
 * @Author: 胡晨明
 * @Date: 2021-08-25 14:52:11
 * @LastEditTime: 2021-09-02 17:08:27
 * @LastEditors: Please set LastEditors
 * @Description: 部门管理页面组件
 * @FilePath: \bloge:\Vue_store\manager-fe\src\views\Menu.vue
-->
<template>
  <div class="dept-manager">
    <div class="query-form">
      <el-form :inline="true" :model="queryForm" ref="validateForm">
        <el-form-item label="部门名称" prop="deptName">
          <el-input v-model="queryForm.deptName" placeholder="请输入部门名称" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleQuery">查询</el-button>
          <el-button @click="() => handleReset('validateForm')">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="base-table">
      <div class="action">
        <el-button type="primary" @click="handleAdd" v-has="'dept-create'"
          >创建</el-button
        >
      </div>
      <el-table
        max-height="350"
        stripe
        :data="deptList"
        row-key="_id"
        :tree-props="{ children: 'children' }"
      >
        <el-table-column
          v-for="item in columns"
          :key="item.prop"
          :prop="item.prop"
          :label="item.label"
          :width="item.width"
          :align="item.align"
          :formatter="item.formatter"
        >
        </el-table-column>
        <el-table-column label="操作" width="250" align="center">
          <template #default="scope">
            <el-button
              size="mini"
              plain
              @click="handleEdit(scope.row)"
              v-has="'dept-edit'"
              >编辑</el-button
            >
            <el-button
              type="danger"
              size="mini"
              @click="handleDelete(scope.row)"
              v-has="'dept-delete'"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog
      :title="action == 'edit' ? '部门编辑' : '创建部门'"
      v-model="showModel"
      :close-on-click-modal="false"
      :show-close="false"
      :close-on-press-escape="false"
      :center="true"
    >
      <el-form
        ref="dialogForm"
        :model="deptForm"
        label-width="100px"
        :rules="rules"
      >
        <el-form-item label="上级部门" prop="parentId">
          <el-cascader
            v-model="deptForm.parentId"
            placeholder="请选择上级部门"
            :options="allDeptList"
            :props="{ checkStrictly: true, value: '_id', label: 'deptName' }"
            clearable
          ></el-cascader>
        </el-form-item>
        <el-form-item label="部门名称" prop="deptName">
          <el-input v-model="deptForm.deptName" placeholder="请输入部门名称" />
        </el-form-item>
        <el-form-item label="负责人" prop="user">
          <el-select
            v-model="deptForm.user"
            placeholder="请选择部门负责人"
            @change="handleUser"
          >
            <el-option
              v-for="user in userList"
              :key="user.userId"
              :value="`${user.userId}/${user.userName}/${user.userEmail}`"
              :label="user.userName"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="负责人邮箱" prop="userEmail">
          <el-input v-model="deptForm.userEmail" disabled />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="handleClose">取 消</el-button>
          <el-button type="primary" @click="handleSubmit">确 定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "dept",
  data() {
    return {
      queryForm: {},
      deptList: [],
      allDeptList: [],
      deptForm: {
        parentId: [null],
      },
      userList: [],
      showModel: false,
      action: "",
      columns: [
        {
          label: "部门名称",
          prop: "deptName",
          width: 150,
          align: "center",
        },
        {
          label: "负责人",
          prop: "userName",
        },
        {
          label: "更新时间",
          prop: "updateTime",
          formatter: (row, column, value) => {
            return this.$utils.formateDate(new Date(value));
          },
        },
        {
          label: "创建时间",
          prop: "createTime",
          formatter: (row, column, value) => {
            return this.$utils.formateDate(new Date(value));
          },
        },
      ],
      rules: {
        deptName: [
          {
            required: true,
            message: "请输入部门名称",
            trigger: "blur",
          },
        ],
        user: [
          {
            required: true,
            message: "请选择负责人",
            trigger: "blur",
          },
        ],
      },
    };
  },
  mounted() {
    this.getDeptList();
    this.getAllUserList();
  },
  methods: {
    /**
     * @description: 获取部门列表
     */
    async getDeptList() {
      try {
        let params = { ...this.queryForm };
        let list = null;
        let allList = null;
        if (params.deptName) {
          list = await this.$api.getDeptList(params);
        }
        allList = await this.$api.getDeptList();
        this.allDeptList = allList;
        this.deptList = list || allList;
      } catch (error) {
        throw new Error(error);
      }
    },
    /**
     * @description: 获取所有用户列表
     */
    async getAllUserList() {
      try {
        const list = await this.$api.getAllUserList();
        this.userList = list;
      } catch (error) {
        throw new Error(error);
      }
    },
    /**
     * @description: 部门查询
     */
    handleQuery() {
      this.getDeptList();
    },
    /**
     * @description: 表单重置
     * @param {String} form
     */
    handleReset(form) {
      this.$refs[form].resetFields();
    },
    /**
     * @description: 获取对应用户信息添加到表单对象中
     * @param {String} val
     */
    handleUser(val) {
      const [userId, userName, userEmail] = val.split("/");
      Object.assign(this.deptForm, { userId, userName, userEmail });
    },
    /**
     * @description: 创建部门
     */
    handleAdd() {
      this.showModel = true;
      this.action = "create";
    },
    /**
     * @description: 编辑部门
     * @param {Object} row
     */
    handleEdit(row) {
      this.showModel = true;
      this.action = "edit";
      this.$nextTick(() => {
        const { _id, parentId, deptName, userId, userName, userEmail } = row;
        this.deptForm = {
          _id,
          parentId,
          deptName,
          user: `${userId}/${userName}/${userEmail}`,
          userEmail,
        };
      });
    },
    /**
     * @description: 删除部门
     * @param {Object} row
     */
    async handleDelete(row) {
      const _id = row._id;
      const params = { _id, action: "delete" };
      try {
        await this.$api.deptSubmit(params);
        this.$message.success("删除成功");
        this.getDeptList();
      } catch (error) {
        throw new Error(error);
      }
    },
    /**
     * @description: 关闭表单
     */
    handleClose() {
      this.showModel = false;
      this.handleReset("dialogForm");
    },
    /**
     * @description: 提交表单
     */
    handleSubmit() {
      this.$refs.dialogForm.validate(async (valid) => {
        if (valid) {
          try {
            let params = { ...this.deptForm, action: this.action };
            delete params.user;
            let res = await this.$api.deptSubmit(params);
            this.$message.success("操作成功");
            this.handleClose();
            this.getDeptList();
          } catch (error) {
            throw new Error(error);
          }
        }
      });
    },
  },
};
</script>
