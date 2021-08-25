<!--
 * @Author: 胡晨明
 * @Date: 2021-08-25 14:52:11
 * @LastEditTime: 2021-08-25 23:22:22
 * @LastEditors: Please set LastEditors
 * @Description: 菜单管理页面组件
 * @FilePath: \bloge:\Vue_store\manager-fe\src\views\Menu.vue
-->
<template>
  <div class="menu-manager">
    <div class="query-form">
      <el-form :inline="true" :model="queryForm" ref="validateForm">
        <el-form-item label="菜单名称" prop="menuName">
          <el-input v-model="queryForm.menuName" placeholder="请输入菜单名称" />
        </el-form-item>
        <el-form-item label="菜单状态" prop="menuState">
          <el-select
            v-model="queryForm.menuState"
            label="菜单状态"
            prop="menuState"
          >
            <el-option :value="1" label="正常"></el-option>
            <el-option :value="2" label="停用"></el-option>
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
        <el-button type="primary" @click="() => handleAdd(addType)"
          >创建</el-button
        >
      </div>
      <el-table
        max-height="350"
        :data="menuList"
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
        <el-table-column label="操作" width="250">
          <template #default="scope">
            <el-button
              size="mini"
              type="primary"
              @click="handleAdd((addType = 2), scope.row)"
              >新增</el-button
            >
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
    </div>
    <el-dialog
      :title="action == 'edit' ? '菜单编辑' : '菜单新增'"
      v-model="showModel"
      :close-on-click-modal="false"
      :show-close="false"
      :close-on-press-escape="false"
      :center="true"
    >
      <el-form
        ref="dialogForm"
        :model="menuForm"
        label-width="100px"
        :rules="rules"
      >
        <el-form-item label="父级菜单" prop="parentId">
          <el-cascader
            v-model="menuForm.parentId"
            placeholder="请选择父级菜单"
            :disabled="addType === 2"
            :options="menuList"
            :props="{ checkStrictly: true, value: '_id', label: 'menuName' }"
            clearable
          ></el-cascader>
          <span class="tip" v-if="addType !== 2">不选，则直接创建一级菜单</span>
        </el-form-item>
        <el-form-item label="菜单类型" prop="menuType">
          <el-radio-group v-model="menuForm.menuType">
            <el-radio :label="1">菜单</el-radio>
            <el-radio :label="2">按钮</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="菜单名称" prop="menuName">
          <el-input v-model="menuForm.menuName" placeholder="请输入菜单名称" />
        </el-form-item>
        <el-form-item
          label="菜单图标"
          prop="icon"
          v-show="menuForm.menuType === 1"
        >
          <el-input v-model="menuForm.icon" placeholder="请输入菜单图标" />
        </el-form-item>
        <el-form-item
          label="路由地址"
          prop="path"
          v-show="menuForm.menuType === 1"
        >
          <el-input v-model="menuForm.path" placeholder="请输入路由地址" />
        </el-form-item>
        <el-form-item label="权限标识" prop="menuCode">
          <el-input v-model="menuForm.menuCode" placeholder="请输入权限标识" />
        </el-form-item>
        <el-form-item
          label="组件路径"
          prop="component"
          v-show="menuForm.menuType === 1"
        >
          <el-input v-model="menuForm.component" placeholder="请输入组件路径" />
        </el-form-item>
        <el-form-item
          label="菜单状态"
          prop="menuState"
          v-show="menuForm.menuType === 1"
        >
          <el-radio-group v-model="menuForm.menuState">
            <el-radio :label="1">正常</el-radio>
            <el-radio :label="2">停用</el-radio>
          </el-radio-group>
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
  name: "menu",
  data() {
    return {
      queryForm: {
        menuState: 1,
      },
      menuList: [],
      menuForm: {
        menuType: 1,
        menuState: 1,
      },
      showModel: false,
      addType: 1,
      action: "",
      columns: [
        {
          label: "菜单名称",
          prop: "menuName",
          width: 150,
          align: "center",
        },
        {
          label: "图标",
          prop: "icon",
          width: 180,
        },
        {
          label: "菜单类型",
          prop: "menuType",
          formatter(row, column, value) {
            return {
              1: "菜单",
              2: "按钮",
            }[value];
          },
        },
        {
          label: "权限标识",
          prop: "menuCode",
        },
        {
          label: "路由地址",
          prop: "path",
        },
        {
          label: "组件路径",
          prop: "component",
        },
        {
          label: "菜单状态",
          prop: "menuState",
          formatter(row, column, value) {
            return {
              1: "正常",
              2: "停用",
            }[value];
          },
        },
      ],
      rules: {
        menuName: [
          {
            required: true,
            message: "请输入菜单名称",
            trigger: "blur",
          },
          {
            min: 2,
            max: 10,
            message: "长度在2-8个字符",
            trigger: "blur",
          },
        ],
      },
    };
  },
  mounted() {
    this.getMenuList();
  },
  methods: {
    /**
     * @description: 菜单列表初始化
     */
    async getMenuList() {
      try {
        const list = await this.$api.getMenuList(this.queryForm);
        this.menuList = list;
      } catch (error) {
        throw new Error(error);
      }
    },
    handleQuery() {
      this.getMenuList();
    },
    /**
     * @description: 表单重置
     */
    handleReset(form) {
      this.$refs[form].resetFields();
      this.addType = 1;
    },
    /**
     * @description: 新增菜单
     * @param {number} type
     * @param {object} row
     */
    handleAdd(type, row) {
      this.showModel = true;
      this.action = "add";
      if (type === 2) {
        this.menuForm.parentId = [...row.parentId, row._id].filter(
          (item) => item
        );
      }
    },
    handleEdit(row) {
      this.showModel = true;
      this.action = "edit";
      this.$nextTick(() => {
        this.menuForm = { ...row };
      });
    },
    async handleDelete(row) {
      const id = row._id;
      try {
        await this.$api.menuSubmit({ id, action: "delete" });
        this.$message.success("删除成功");
        this.getMenuList();
      } catch (error) {
        this.$message.fail("删除失败");
        throw new Error(error);
      }
    },
    /**
     * @description: 弹框关闭
     */
    handleClose() {
      this.showModel = false;
      this.handleReset("dialogForm");
    },
    /**
     * @description: 菜单操作提交
     */
    handleSubmit() {
      this.$refs.dialogForm.validate(async (valid) => {
        if (valid) {
          let action = this.action;
          let params = { ...this.menuForm, action };
          try {
            const res = await this.$api.menuSubmit(params);
            this.showModel = false;
            this.$message.success("操作成功");
            this.handleReset("dialogForm");
            this.getMenuList();
          } catch (error) {
            throw new Error(error);
          }
        }
      });
    },
  },
};
</script>

<style lang="scss">
.menu-manager {
  .tip {
    margin-left: 8px;
    font-size: 13px;
    color: #ccc;
  }
}
</style>
