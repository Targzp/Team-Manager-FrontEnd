<!--
 * @Author: 胡晨明
 * @Date: 2021-08-21 21:08:11
 * @LastEditTime: 2021-09-04 22:51:01
 * @LastEditors: Please set LastEditors
 * @Description: 休假申请页面组件
 * @FilePath: \bloge:\Vue_store\manager-fe\src\views\User.vue
-->
<template>
  <div class="leave-manager">
    <!-- 查询申请区域 -->
    <div class="query-form">
      <el-form :inline="true" :model="queryForm" ref="validateForm">
        <el-form-item>
          <el-select
            v-model="queryForm.applyState"
            label="审批状态"
            prop="applyState"
          >
            <el-option value="" label="全部"></el-option>
            <el-option :value="1" label="待审批"></el-option>
            <el-option :value="2" label="审批中"></el-option>
            <el-option :value="3" label="审批拒绝"></el-option>
            <el-option :value="4" label="审批通过"></el-option>
            <el-option :value="5" label="作废"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="getApplyList">查询</el-button>
          <el-button @click="() => handleReset(validateForm)">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <!-- 申请列表区域 -->
    <div class="base-table">
      <!-- 申请按钮 -->
      <div class="action">
        <el-button type="primary" @click="handleApply">申请休假</el-button>
      </div>
      <el-table max-height="350" :data="applyList">
        <el-table-column
          v-for="item in columns"
          :key="item.prop"
          :prop="item.prop"
          :label="item.label"
          :width="item.width"
          :formatter="item.formatter"
          :align="item.align"
        >
        </el-table-column>
        <el-table-column label="操作" width="150">
          <template #default="scope">
            <el-button size="mini" plain>查看</el-button>
            <el-button type="danger" size="mini">作废</el-button>
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
    <!-- 申请表单 -->
    <el-dialog
      :title="休假申请"
      v-model="showModel"
      :close-on-click-modal="false"
      :show-close="false"
      :close-on-press-escape="false"
      :center="true"
      width="700px"
    >
      <el-form
        ref="dialogForm"
        :model="applyForm"
        label-width="100px"
        :rules="rules"
      >
        <el-form-item label="休假类型" prop="applyType">
          <el-select v-model="applyForm.applyType">
            <el-option value="" label="请选择" disabled></el-option>
            <el-option :value="1" label="事假"></el-option>
            <el-option :value="2" label="调休"></el-option>
            <el-option :value="3" label="年假"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="休假时间">
          <el-row>
            <el-col :span="10">
              <el-form-item prop="startTime" style="margin-bottom: 0px">
                <el-config-provider :locale="locale">
                  <el-date-picker
                    v-model="applyForm.startTime"
                    type="date"
                    placeholder="选择开始日期"
                  />
                </el-config-provider>
              </el-form-item>
            </el-col>
            <el-col :span="1" class="middle-gap">-</el-col>
            <el-col :span="10">
              <el-form-item prop="endTime" style="margin-bottom: 0px">
                <el-config-provider :locale="locale">
                  <el-date-picker
                    v-model="applyForm.endTime"
                    type="date"
                    placeholder="选择结束日期"
                  />
                </el-config-provider>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item label="休假时长"> 0天 </el-form-item>
        <el-form-item label="休假原因" prop="reasons">
          <el-input
            type="textarea"
            :row="3"
            placeholder="请输入休假原因"
            v-model="applyForm.reasons"
          ></el-input>
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
import zhCn from "element-plus/lib/locale/lang/zh-cn";
// 中文相关配置
const locale = zhCn;

// 初始化申请表单对象数据
const queryForm = reactive({
  applyState: "",
});

//
const applyList = ref([]);

// 初始化分页对象
const pager = reactive({
  pageNum: 1,
  pageSize: 10,
});

// 创建休假弹框表单
const applyForm = reactive({
  applyType: "",
});
// 定义用户操作行为
const action = ref("");
// 定义表单校验规则
const rules = reactive([]);
// 弹框显示对象
const showModel = ref(false);
// 初始化用户表单元素对象
const validateForm = ref(null);
// 初始化dialog表单元素对象
const dialogForm = ref(null);
// 初始化动态表格列头
const columns = reactive([
  {
    label: "单号",
    prop: "orderNo",
    width: "100",
    align: "center",
  },
  {
    label: "休假时间",
    prop: "",
    formatter(row) {
      return `${utils.formateDate(
        new Date(row.startTime),
        "yyyy-MM-dd"
      )} 到 ${utils.formateDate(new Date(row.endTime), "yyyy-MM-dd")}`;
    },
    width: "175",
  },
  {
    label: "休假时长",
    prop: "leaveTime",
  },
  {
    label: "休假类型",
    prop: "applyType",
    formatter(row, column, value) {
      return {
        1: "事假",
        2: "调休",
        3: "年假",
      }[value];
    },
  },
  {
    label: "休假原因",
    prop: "reasons",
  },
  {
    label: "申请时间",
    prop: "createTime",
    formatter(row, column, value) {
      return utils.formateDate(new Date(value));
    },
    width: "150",
  },
  {
    label: "审批人",
    prop: "auditUsers",
  },
  {
    label: "当前审批人",
    prop: "curAuditUserName",
  },
  {
    label: "审批状态",
    prop: "applyState",
    formatter(row, column, value) {
      return {
        1: "待审批",
        2: "审批中",
        3: "审批拒绝",
        4: "审批通过",
        5: "作废",
      }[value];
    },
  },
]);

// 初始化接口调用
onMounted(() => {
  getApplyList();
});

/**
 * @description: 分页事件处理
 */
const handleCurrentChange = (current) => {
  console.log(current);
  pager.pageNum = current;
  getUserList();
};

/**
 * @description: 获取休假申请列表
 */
const getApplyList = async () => {
  let params = { ...queryForm, ...pager };
  try {
    const { list, page } = await api.getApplyList(params);
    applyList.value = list;
    pager.total = page.total;
  } catch (error) {
    console.log(error);
  }
};

/**
 * @description: 点击申请休假-展示弹框
 */
const handleApply = () => {
  showModel.value = true;
  action.value = "create";
};

/**
 * @description: 重置查询表单
 */
const handleReset = (form) => {
  form.resetFields();
};

/**
 * @description: 用户弹窗关闭
 */
const handleClose = () => {
  showModel.value = false;
  handleReset(dialogForm.value);
};

/**
 * @description: 申请提交
 */
const handleSubmit = () => {};
</script>

<style lang="scss">
.middle-gap {
  margin-left: 8px;
}
</style>
