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
        <el-button type="primary" @click="handleAdd" v-has="'role-create'"
          >创建</el-button
        >
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
            <el-button
              size="mini"
              plain
              @click="handleEdit(scope.row)"
              v-has="'role-edit'"
              >编辑</el-button
            >
            <el-button
              size="mini"
              type="primary"
              @click="handlePermission(scope.row)"
              v-has="'role-setting'"
              >设置权限</el-button
            >
            <el-button
              type="danger"
              size="mini"
              @click="handleDelete(scope.row)"
              v-has="'role-delete'"
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
    <!-- 权限弹框 -->
    <el-dialog
      title="设置权限"
      v-model="showPermission"
      :close-on-click-modal="false"
      :show-close="false"
      :close-on-press-escape="false"
      :center="true"
    >
      <el-form label-width="100px">
        <el-form-item label="角色名称">
          {{ curRoleName }}
        </el-form-item>
        <el-form-item label="选择权限">
          <el-tree
            ref="permissionTree"
            :data="menuList"
            show-checkbox
            node-key="_id"
            default-expand-all
            :props="{ label: 'menuName' }"
          >
          </el-tree>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="this.showPermission = false">取 消</el-button>
          <el-button type="primary" @click="handlePermissionSubmit"
            >确 定</el-button
          >
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
      // 权限弹窗展示
      showPermission: false,
      curRoleId: "",
      curRoleName: "",
      menuList: [],
      // 菜单映射表
      actionMap: {},
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
          prop: "permissionList",
          align: "center",
          formatter: (row, column, value) => {
            let names = [];
            let list = value.halfCheckedKeys || [];
            list.map((key) => {
              if (this.actionMap[key]) names.push(this.actionMap[key]);
            });
            return names.join(",");
          },
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
    this.getMenuList();
  },
  methods: {
    /**
     * @description: 角色列表初始化
     */
    async getRoleList() {
      try {
        let params = { ...this.queryForm, ...this.pager };
        const { list, page } = await this.$api.getRoleList(params);
        this.roleList = list;
        this.pager.total = page.total;
      } catch (error) {
        throw new Error(error);
      }
    },
    /**
     * @description: 获取菜单列表
     */
    async getMenuList() {
      try {
        const list = await this.$api.getMenuList({ menuState: 1 });
        this.menuList = list;
        this.getActionMap(list);
      } catch (error) {
        throw new Error(error);
      }
    },
    /**
     * @description: 获取二级菜单（拥有按钮）
     * @param {Array} list
     */
    getActionMap(list) {
      let actionMap = {};
      const deep = (arr) => {
        arr.map((item) => {
          if (item.children && item.action) {
            actionMap[item._id] = item.menuName;
          }
          if (item.children && !item.action) {
            deep(item.children);
          }
        });
      };
      deep(list);
      this.actionMap = actionMap;
    },
    /**
     * @description: 分页事件处理
     */
    handleCurrentChange(current) {
      this.pager.pageNum = current;
      this.getRoleList();
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
    /**
     * @description: 设置权限表单开启
     * @param {Object} row
     */
    handlePermission(row) {
      this.showPermission = true;
      this.$nextTick(() => {
        // 表单渲染完毕后再进行操作
        this.curRoleName = row.roleName;
        this.curRoleId = row._id;
        let { checkedKeys } = row.permissionList;
        this.$refs.permissionTree.setCheckedKeys(checkedKeys); // 通过 keys 设置目前勾选的节点，使用此方法必须设置 node-key 属性
      });
    },
    /**
     * @description: 角色权限设置提交
     */
    async handlePermissionSubmit() {
      let nodes = this.$refs.permissionTree.getCheckedNodes(); // 返回目前被选中的节点所组成的数组
      let halfKeys = this.$refs.permissionTree.getHalfCheckedKeys(); // 返回目前半选中的节点所组成的数组
      let checkedKeys = [];
      let parentKeys = [];
      nodes.map((node) => {
        if (!node.children) {
          checkedKeys.push(node._id);
        } else {
          /* 假如菜单下所有选项都被选中，那么菜单项也会被选中，而不是半选中。
             但是如果未来菜单下又新增了选项，那么根据 checkedKeys 来选中选项则会把菜单
             弄成选中状态，底下所有选项都会被选中，包括新增的本来该角色没有的选中的选项。
             所以这边我们应该撇去 */
          parentKeys.push(node._id);
        }
      });
      let params = {
        _id: this.curRoleId,
        permissionList: {
          checkedKeys,
          halfCheckedKeys: parentKeys.concat(halfKeys),
        },
      };
      try {
        await this.$api.updatePermission(params);
        this.showPermission = false;
        this.$message.success("设置成功");
        this.getRoleList();
      } catch (error) {
        throw new Error(error);
      }
    },
  },
};
</script>

<style lang="scss">
</style>
