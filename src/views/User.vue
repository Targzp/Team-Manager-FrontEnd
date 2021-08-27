<!--
 * @Author: 胡晨明
 * @Date: 2021-08-21 21:08:11
 * @LastEditTime: 2021-08-24 22:16:35
 * @LastEditors: Please set LastEditors
 * @Description: 用户管理页面组件
 * @FilePath: \bloge:\Vue_store\manager-fe\src\views\User.vue
-->
<template>
  <div class="user-manager">
    <div class="query-form">
      <el-form :inline="true" :model="user" ref="validateForm">
        <el-form-item label="用户ID" prop="userId">
          <el-input v-model="user.userId" placeholder="请输入用户ID" />
        </el-form-item>
        <el-form-item label="用户名称" prop="userName">
          <el-input v-model="user.userName" placeholder="请输入用户名称" />
        </el-form-item>
        <el-form-item>
          <el-select v-model="user.state" label="用户状态" prop="state">
            <el-option :value="0" label="所有"></el-option>
            <el-option :value="1" label="在职"></el-option>
            <el-option :value="2" label="离职"></el-option>
            <el-option :value="3" label="试用期"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleQuery">查询</el-button>
          <el-button @click="() => handleReset(validateForm)">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="base-table">
      <div class="action">
        <el-button type="primary" @click="handleCreate">新增</el-button>
        <el-button type="danger" @click="handlePatchDel">批量删除</el-button>
      </div>
      <el-table
        max-height="350"
        :data="userList"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection"></el-table-column>
        <el-table-column
          v-for="item in columns"
          :key="item.prop"
          :prop="item.prop"
          :label="item.label"
          :width="item.width"
          :formatter="item.formatter"
        >
        </el-table-column>
        <el-table-column label="操作" width="150">
          <template #default="scope">
            <el-button size="mini" plain @click="handleEdit(scope.row)"
              >编辑</el-button
            >
            <el-button
              type="danger"
              size="mini"
              @click="handleDelete(scope.row)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        class="pagination"
        layout="prev, pager, next"
        :total="pager.total"
        :page-size="pager.pageSize"
        @current-change="handleCurrentChange"
      >
      </el-pagination>
    </div>
    <el-dialog
      :title="action == 'edit' ? '用户编辑' : '用户新增'"
      v-model="showModel"
      :close-on-click-modal="false"
      :show-close="false"
      :close-on-press-escape="false"
      :center="true"
    >
      <el-form
        ref="dialogForm"
        :model="userForm"
        label-width="100px"
        :rules="rules"
      >
        <el-form-item label="用户名" prop="userName">
          <el-input
            v-model="userForm.userName"
            :disabled="action == 'edit'"
            placeholder="请输入用户名称"
          />
        </el-form-item>
        <el-form-item label="邮箱" prop="userEmail">
          <el-input
            v-model="userForm.userEmail"
            :disabled="action == 'edit'"
            placeholder="请输入用户邮箱"
          />
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="userForm.mobile" placeholder="请输入手机号" />
        </el-form-item>
        <el-form-item label="岗位" prop="job">
          <el-input v-model="userForm.job" placeholder="请输入岗位" />
        </el-form-item>
        <el-form-item label="状态" prop="state">
          <el-select v-model="userForm.state">
            <el-option :value="1" label="在职"></el-option>
            <el-option :value="2" label="离职"></el-option>
            <el-option :value="3" label="试用期"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="系统角色" prop="roleList">
          <el-select
            multiple
            v-model="userForm.roleList"
            placeholder="请选择用户角色"
          >
            <el-option
              v-for="role in roleList"
              :key="role._id"
              :value="role._id"
              :label="role.roleName"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="部门" prop="deptId">
          <el-cascader
            v-model="userForm.deptId"
            placeholder="请选择所属部门"
            :options="deptList"
            :props="{ checkStrictly: true, value: '_id', label: 'deptName' }"
            clearable
          ></el-cascader>
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

<script setup>
import { ref, reactive, toRaw, onMounted, nextTick } from "vue";
import api from "../api/index.js";
import utils from "../utils/utils";
import { ElMessage } from "element-plus";
// 初始化用户表单对象数据
const user = reactive({
  state: 1,
});
// 初始化用户列表数据
const userList = ref([]);
// 初始化分页对象
const pager = reactive({
  pageNum: 1,
  pageSize: 10,
});
// 选中用户列表对象
const checkedUserIds = ref([]);
// 新增用户 form 对象
const userForm = reactive({
  state: 1,
});
// 所有角色列表
const roleList = ref([]);
// 所有部门列表
const deptList = ref([]);
// 定义用户操作行为
const action = ref("add");
// 定义表单校验规则
const rules = reactive({
  userName: [
    {
      required: true,
      message: "请输入用户名称",
      trigger: "blur",
    },
  ],
  userEmail: [
    {
      required: true,
      message: "请输入用户邮箱",
      trigger: "blur",
    },
    {
      pattern: /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/,
      message: "请输入正确的邮箱格式",
    },
  ],
  mobile: [
    {
      pattern:
        /^(13[0-9]|14[5|7]|15[0|1|2|3|4|5|6|7|8|9]|18[0|1|2|3|5|6|7|8|9])\d{8}$/,
      message: "请输入正确的手机号格式",
    },
  ],
  // deptId: [
  //     {
  //         required: true,
  //         message: '',
  //         trigger: 'blur'
  //     }
  // ]
});
// 弹框显示对象
const showModel = ref(false);
// 初始化用户表单元素对象
const validateForm = ref(null);
// 初始化dialog表单元素对象
const dialogForm = ref(null);
// 初始化动态表格列头
const columns = reactive([
  {
    label: "用户ID",
    prop: "userId",
    width: "100",
  },
  {
    label: "用户名称",
    prop: "userName",
    width: "100",
  },
  {
    label: "用户邮箱",
    prop: "userEmail",
    width: "150",
  },
  {
    label: "用户角色",
    prop: "role",
    formatter(row, column, value) {
      return {
        0: "管理员",
        1: "普通用户",
      }[value];
    },
    width: "100",
  },
  {
    label: "用户状态",
    prop: "state",
    formatter(row, column, value) {
      return {
        1: "在职",
        2: "离职",
        3: "试用期",
      }[value];
    },
    width: "100",
  },
  {
    label: "注册时间",
    prop: "createTime",
    formatter(row, column, value) {
      return utils.formateDate(new Date(value));
    },
  },
  {
    label: "最后登录时间",
    prop: "lastLoginTime",
    formatter(row, column, value) {
      return utils.formateDate(new Date(value));
    },
  },
]);
// 初始化接口调用
onMounted(() => {
  getUserList();
  getDeptList();
  getRoleNameList();
});
/**
 * @description: 获取用户列表
 */
const getUserList = async () => {
  let params = { ...user, ...pager };
  try {
    const { list, page } = await api.getUserList(params);
    userList.value = list;
    pager.total = page.total;
  } catch (error) {
    console.log(error);
  }
};

/**
 * @description: 查询事件，获取用户列表
 */
const handleQuery = () => {
  getUserList();
};

/**
 * @description: 重置查询表单
 */
const handleReset = (form) => {
  form.resetFields();
};

/**
 * @description: 分页事件处理
 */
const handleCurrentChange = (current) => {
  console.log(current);
  pager.pageNum = current;
  getUserList();
};

/**
 * @description: 用户单个删除
 */
const handleDelete = async (row) => {
  await api.userDel({ userIds: [row.userId] });
  ElMessage({
    message: "删除成功",
    type: "success",
  });
  getUserList();
};

/**
 * @description: 用户批量删除
 */
const handlePatchDel = async () => {
  if (checkedUserIds.value.length == 0) {
    ElMessage({
      message: "未选中要删除的用户",
      type: "error",
    });
    return;
  }
  const res = await api.userDel({
    userIds: checkedUserIds.value,
  });
  if (res.nModified > 0) {
    ElMessage({
      message: "删除成功",
      type: "success",
    });
    getUserList();
  } else {
    ElMessage({
      message: "删除失败",
      type: "error",
    });
  }
};

/**
 * @description: 表格多选选中事件
 */
const handleSelectionChange = (list) => {
  let arr = [];
  list.map((item) => {
    arr.push(item.userId);
  });
  checkedUserIds.value = arr;
};

/**
 * @description: 用户新增
 */
const handleCreate = () => {
  showModel.value = true;
};

/**
 * @description: 获取部门列表
 */
const getDeptList = async () => {
  let list = await api.getDeptList();
  deptList.value = list;
};

/**
 * @description: 获取角色列表
 */
const getRoleNameList = async () => {
  let list = await api.getRoleNameList();
  roleList.value = list;
};

/**
 * @description: 用户弹窗关闭
 */
const handleClose = () => {
  showModel.value = false;
  action.value = "add";
  handleReset(dialogForm.value);
};

/**
 * @description: 新增用户提交
 */
const handleSubmit = () => {
  dialogForm.value.validate(async (valid) => {
    if (valid) {
      let params = toRaw(userForm);
      params.action = action.value;
      const res = await api.userSubmit(params);
      if (res) {
        ElMessage({
          message: action.value == "edit" ? "更新成功" : "用户创建成功",
          duration: 2000,
          type: "success",
        });
        showModel.value = false;
        action.value = "add";
        handleReset(dialogForm.value);
        getUserList();
      }
    }
  });
};

/**
 * @description: 用户编辑
 */
const handleEdit = async (row) => {
  action.value = "edit";
  showModel.value = true;
  // nextTick: 将回调推迟到下一个 DOM 更新周期之后执行。在更改了一些数据以等待 DOM 更新后立即使用它。
  await nextTick();
  Object.assign(userForm, row);
};
</script>

<style lang="scss">
</style>