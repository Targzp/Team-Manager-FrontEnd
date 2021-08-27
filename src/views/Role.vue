<template>
  <div class="role-manager">
    <div class="query-form">
      <el-form :inline="true" :model="queryForm" ref="validateForm">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="queryForm.roleName" placeholder="请输入角色名称" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleQuery">查询</el-button>
          <el-button @click="() => handleReset('validateForm')">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="base-table">
      <div class="action">
        <el-button type="primary" @click="handleAdd">创建</el-button>
      </div>
      <el-table max-height="350" :data="roleList">
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
            <el-button size="mini" plain @click="handleEdit(scope.row)"
              >编辑</el-button
            >
            <el-button size="mini" type="primary">设置权限</el-button>
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
      >
      </el-pagination>
    </div>
    <el-dialog
      :title="action == 'edit' ? '角色编辑' : '角色新增'"
      v-model="showModel"
      :close-on-click-modal="false"
      :show-close="false"
      :close-on-press-escape="false"
      :center="true"
    >
      <el-form
        ref="dialogForm"
        :model="roleForm"
        label-width="100px"
        :rules="rules"
      >
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="roleForm.roleName" placeholder="请输入角色名称" />
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input
            type="textarea"
            :rows="2"
            v-model="roleForm.remark"
            placeholder="请输入备注"
          />
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
import utils from "../utils/utils";
export default {
  name: "role",
  data() {
    return {
      roleList: [],
      queryForm: {},
      roleForm: {
        remark: "",
      },
      showModel: false,
      action: "",
      pager: {
        pageNum: 1,
        pageSize: 10,
      },
      columns: [
        {
          label: "角色名称",
          prop: "roleName",
          align: "center",
        },
        {
          label: "备注",
          prop: "remark",
          width: 250,
          align: "center",
        },
        {
          label: "权限列表",
          prop: "menuType",
          align: "center",
        },
        {
          label: "创建时间",
          prop: "createTime",
          width: 250,
          align: "center",
          formatter(row, column, value) {
            return utils.formateDate(new Date(value));
          },
        },
      ],
      rules: {
        roleName: [
          {
            required: true,
            message: "请输入角色名称",
            trigger: "blur",
          },
        ],
      },
    };
  },
  mounted() {
    this.getRoleList();
  },
  methods: {
    /**
     * @description: 角色列表初始化
     */
    async getRoleList() {
      try {
        const { list, page } = await this.$api.getRoleList(this.queryForm);
        this.roleList = list;
        this.pager.total = page.total;
      } catch (error) {
        throw new Error(error);
      }
    },
    /**
     * @description: 角色查询
     */
    handleQuery() {
      this.getRoleList();
    },
    /**
     * @description: 表单重置
     * @param {String} form
     */
    handleReset(form) {
      this.$refs[form].resetFields();
    },
    /**
     * @description: 角色新增
     */
    handleAdd() {
      this.showModel = true;
      this.action = "create";
    },
    /**
     * @description: 角色编辑
     * @param {Object} row
     */
    handleEdit(row) {
      this.showModel = true;
      this.$nextTick(() => {
        this.action = "edit";
        let { _id, roleName, remark } = row;
        this.roleForm = { _id, roleName, remark };
      });
    },
    /**
     * @description: 角色删除
     * @param {Object} row
     */
    async handleDelete(row) {
      const _id = row._id;
      try {
        await this.$api.roleSubmit({ _id, action: "delete" });
        this.$message.success("删除成功");
        this.getRoleList();
      } catch (error) {
        throw new Error(error);
      }
    },
    /**
     * @description: 表单关闭
     */
    handleClose() {
      this.showModel = false;
      this.handleReset("dialogForm");
    },
    /**
     * @description: 角色操作提交
     */
    handleSubmit() {
      this.$refs.dialogForm.validate(async (valid) => {
        if (valid) {
          let action = this.action;
          let params = { ...this.roleForm, action };
          try {
            const res = await this.$api.roleSubmit(params);
            this.showModel = false;
            this.$message.success("操作成功");
            this.handleReset("dialogForm");
            this.getRoleList();
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
</style>
