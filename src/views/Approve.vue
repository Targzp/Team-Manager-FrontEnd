<!--
 * @Author: 胡晨明
 * @Date: 2021-08-21 21:08:11
 * @LastEditTime: 2021-09-09 21:59:37
 * @LastEditors: Please set LastEditors
 * @Description: 待审批页面组件
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
            <el-button
              size="mini"
              plain
              @click="handleDetail(scope.row)"
              v-if="
                scope.row.curAuditUserName == userInfo.userName &&
                [1, 2].includes(scope.row.applyState)
              "
              >审核</el-button
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
    <!-- 休假申请详情表单 -->
    <el-dialog
      title="审核"
      v-model="showDetailModel"
      :center="true"
      width="700px"
    >
      <el-form
        label-width="100px"
        label-suffix=":"
        :model="auditForm"
        :rules="rules"
        ref="dialogForm"
      >
        <el-form-item label="申请人">
          <div>{{ detail.applyUser.userName }}</div>
        </el-form-item>
        <el-form-item label="休假类型">
          <div>{{ detail.applyTypeName }}</div>
        </el-form-item>
        <el-form-item label="休假时间">
          <div>{{ detail.time }}</div>
        </el-form-item>
        <el-form-item label="休假时长">
          <div>{{ detail.leaveTime }}</div>
        </el-form-item>
        <el-form-item label="休假原因">
          <div>{{ detail.reasons }}</div>
        </el-form-item>
        <el-form-item label="审批状态">
          <div>{{ detail.applyStateName }}</div>
        </el-form-item>
        <el-form-item label="审批人">
          <div>{{ detail.curAuditUserName }}</div>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input
            type="textarea"
            :row="3"
            placeholder="请输入审核备注"
            v-model="auditForm.remark"
          ></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button type="danger" @click="handleApprove('refuse')"
            >驳回</el-button
          >
          <el-button type="primary" @click="handleApprove('pass')"
            >通过</el-button
          >
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, watch, onMounted } from "vue";
import { useStore } from "vuex";
import api from "../api/index.js";
import utils from "../utils/utils";
import zhCn from "element-plus/lib/locale/lang/zh-cn";
import { ElMessage } from "element-plus";
// 中文相关配置
const locale = zhCn;

const store = useStore();

// 初始化申请表单对象数据
const queryForm = reactive({
  applyState: 1,
});

// 申请列表
const applyList = ref([]);

// 初始化分页对象
const pager = reactive({
  pageNum: 1,
  pageSize: 10,
});

// 创建审核弹框表单
const auditForm = reactive({});
// 创建休假申请详情对象
const detail = reactive({});
// 控制休假申请详情对话框显示和隐藏对象
const showDetailModel = ref(false);
const userInfo = store.state.userInfo;
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
    label: "申请人",
    prop: "",
    formatter(row) {
      return row.applyUser.userName;
    },
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
    width: "170",
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
// 定义表单校验规则
const rules = reactive({
  remark: [
    {
      required: true,
      message: "请输入审核备注",
      trigger: "blur",
    },
  ],
});

// 初始化接口调用
onMounted(() => {
  getApplyList();
});

/**
 * @description: 分页事件处理
 */
const handleCurrentChange = (current) => {
  pager.pageNum = current;
  getApplyList();
};

/**
 * @description: 获取休假申请列表
 */
const getApplyList = async function () {
  let params = { ...queryForm, ...pager, type: "approve" };
  try {
    const { list, page } = await api.getApplyList(params);
    applyList.value = list;
    pager.total = page.total;
    return list;
  } catch (error) {
    console.log(error);
  }
};

/**
 * @description: 当审批人待审批列表为空自动跳转到审批中列表
 */
/* watch(applyList, async (applyList) => {
  if (applyList.length === 0) {
    queryForm.applyState = 2;
    let list = await getApplyList();
    ElMessage({
      message: `您有${list.length}条待审批`,
      duration: 2000,
      type: "success",
    });
  }
}); */

/**
 * @description: 重置查询表单
 */
const handleReset = (form) => {
  form.resetFields();
};

/**
 * @description: 查看休假详情
 */
const handleDetail = (row) => {
  showDetailModel.value = true;
  let data = { ...row };
  data.applyTypeName = {
    1: "事假",
    2: "调休",
    3: "年假",
  }[data.applyType];
  data.time = `${utils.formateDate(
    new Date(data.startTime),
    "yyyy-MM-dd"
  )}到${utils.formateDate(new Date(data.endTime), "yyyy-MM-dd")}`;
  data.applyStateName = {
    1: "待审批",
    2: "审批中",
    3: "审批拒绝",
    4: "审批通过",
    5: "作废",
  }[data.applyState];
  Object.assign(detail, data);
};

/**
 * @description: 审核提交
 */
const handleApprove = (action) => {
  dialogForm.value.validate(async (valid) => {
    if (valid) {
      try {
        let params = { action, ...auditForm, _id: detail._id };
        let res = await api.approveSubmit(params);
        if (res) {
          ElMessage({
            message: "审核完毕",
            duration: 2000,
            type: "success",
          });
          showDetailModel.value = false;
          handleReset(dialogForm.value);
          getApplyList();
          store.commit("changeNoticeCount", -1);
        }
      } catch (error) {
        console.log(error);
      }
    }
  });
};
</script>

<style lang="scss">
.middle-gap {
  margin-left: 8px;
}
</style>