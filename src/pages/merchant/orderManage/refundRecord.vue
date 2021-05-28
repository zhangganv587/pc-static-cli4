<!--
 * @Author: 张淦
 * @Date: 2020-04-28 11:21:41
 * @LastEditors: zhanggan
 * @Description:
 * @FilePath: /gpay-ops-static/src/pages/merchant/orderManage/refundRecord.vue
 -->
<template>
  <div>
    <el-form label-width="130px" :inline="true" :model="formInline">
      <el-form-item>
        <el-input v-model="formInline.batchNo" placeholder="批次号" clearable />
      </el-form-item>
      <el-form-item>
        <el-select v-model="formInline.status" clearable placeholder="退款状态">
          <el-option
            v-for="item in payConfigList.refundStatus"
            :key="item.code"
            :label="item.memo"
            :value="item.code"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-input
          v-model="formInline.payLogNo"
          placeholder="支付流水号"
          clearable
        />
      </el-form-item>
      <el-form-item>
        <el-input
          v-model="formInline.bizOrderNo"
          placeholder="业务订单号"
          clearable
        />
      </el-form-item>
      <el-form-item>
        <el-select
          v-model="formInline.payWays"
          clearable
          placeholder="支付方式"
        >
          <el-option
            v-for="item in payConfigList.payWay"
            :key="item.code"
            :label="item.memo"
            :value="item.code"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-select
          v-model="formInline.submitType"
          clearable
          placeholder="退款方式"
        >
          <el-option
            v-for="item in payConfigList.submitType"
            :key="item.code"
            :label="item.memo"
            :value="item.code"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-input
          v-model="formInline.paidNo"
          placeholder="支付机构流水号"
          clearable
        />
      </el-form-item>
      <el-form-item>
        <el-input
          v-model="formInline.accountNo"
          placeholder="收款账号"
          clearable
        />
      </el-form-item>
      <el-form-item>
        <we-date-picker
          :default-range="30"
          :max-range="31"
          :picker-props="pickerProps"
          @currentChange="currentDatePickerChange"
        />
      </el-form-item>
      <el-form-item>
        <v-form-submit
          ref="formSubmit"
          :action="queryUrl"
          :immediate="true"
          :pagination="pagination"
          @click:search="handleSearch"
        >
          查询
        </v-form-submit>
      </el-form-item>
    </el-form>
    <div class="tableBox">
      <v-table
        v-loading="loading"
        type="index"
        :data="tableData"
        :columns="columns"
        :pagination="pagination"
        @currentChange="currentChange"
      />
    </div>
    <refund-detail :biz-order-no="row.bizOrderNo" />
    <refund-update :row-data="row" />
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import tableFormMixin from "@/mixins/tableFormMixin";
import refundDetail from "./component/refundDetail";
import refundUpdate from "./component/refundUpdate";

export default {
  components: {
    refundDetail,
    refundUpdate,
  },
  mixins: [tableFormMixin],
  data() {
    this.columns = this.getColumns();
    this.queryUrl = "/refund/query.json";
    this.pickerProps = {
      startPlaceholder: "提交开始时间",
      endPlaceholder: "提交结束时间",
    };
    return {
      formInline: {
        batchNo: null,
        status: null,
        payLogNo: null,
        bizOrderNo: null,
        payWays: null,
        submitType: null,
        paidNo: null,
        accountNo: null,
        startDate: null,
        endDate: null,
      },
    };
  },
  computed: {
    ...mapGetters({
      payConfigList: "payConfigList",
    }),
  },
  created() {
    this.$common.judgeState({
      payConfigList: "getPayConfigList",
    });
  },
  methods: {
    getColumns() {
      return [
        { prop: "batchNo", label: "批次号", width: 220 },
        { prop: "id", label: "主键id", width: 120 },
        { prop: "accountNo", label: "收款账号", width: 160 },
        { prop: "payLogNo", label: "支付流水号", width: "220" },
        { prop: "paidNo", label: "支付机构流水号", width: "220" },
        { prop: "bizOrderNo", label: "业务订单号", width: "200" },
        { prop: "refundNo", label: "退款流水号", width: "220" },
        { prop: "bizRefundId", label: "业务系统退款单号", width: "200" },
        {
          prop: "amount",
          label: "退款金额(元)",
          render: (h, value, row) => {
            return (
              <span class="tableRight">{this.$common.moneyFormat(value)}</span>
            );
          },
          width: "120",
        },
        {
          prop: "amount",
          label: "实际退款金额(元)",
          render: (h, value, row) => {
            return (
              <span class="tableRight">{this.$common.moneyFormat(value)}</span>
            );
          },
          width: "120",
        },
        {
          prop: "submitType",
          label: "退款方式",
          render: (h, value, row) => {
            return this.$common.tableFormat(
              this.payConfigList.submitType,
              value,
              "code",
              "memo"
            );
          },
          width: "120",
        },
        {
          prop: "payWays",
          label: "支付方式",
          render: (h, value, row) => {
            return this.$common.tableFormat(
              this.payConfigList.payWay,
              value,
              "code",
              "memo"
            );
          },
          width: "120",
        },
        { prop: "reason", label: "退款原因", width: "160" },
        // 此处状态指退款状态-
        {
          prop: "status",
          label: "状态",
          render: (h, value, row) => {
            return this.$common.tableFormat(
              this.payConfigList.refundStatus,
              value,
              "code",
              "memo"
            );
          },
          width: "120",
        },
        { prop: "operator", label: "操作员", width: "140" },
        {
          prop: "paidDate",
          label: "支付时间",
          render: (h, value, row) => {
            return this.$common.timeFormat(value);
          },
          width: "140",
        },
        {
          prop: "submitTime",
          label: "提交时间",
          render: (h, value, row) => {
            return this.$common.timeFormat(value);
          },
          width: "140",
        },
        {
          prop: "refundDate",
          label: "退款时间",
          render: (h, value, row) => {
            return this.$common.timeFormat(value);
          },
          width: "140",
        },
        { prop: "recvUserId", label: "用户账号", width: "140" },
        {
          prop: "callBackStatus",
          label: "通知状态",
          render: (h, value, row) => {
            return this.$common.tableFormat(
              this.payConfigList.callbackStatus,
              value,
              "code",
              "memo"
            );
          },
          width: "120",
        },
        {
          prop: "callBackTime",
          label: "通知时间",
          render: (h, value, row) => {
            return this.$common.timeFormat(value);
          },
          width: "140",
        },
        { prop: "notifyUrl", label: "异步地址", width: "240" },
        { prop: "appId", label: "AppId", width: "160" },
        { prop: "queryNo", label: "查询单号", width: "160" },
        { prop: "memo", label: "备注", width: "160" },
        { prop: "version", label: "版本号", width: "100" },
        {
          prop: "",
          label: "操作",
          fixed: "right",
          width: 130,
          render: (h, value, row) => {
            return (
              <el-button
                onClick={() => this.handleInfo(row, "refundRecordUpdate")}
                type="text"
              >
                更新
              </el-button>
            );
            // 因为后台代码下限
            // return (
            //   <div>
            //     <el-button onClick={() => this.handleInfo(row, 'refundRecordUpdate')} type="text">
            //       更新
            //     </el-button>
            //     <el-button onClick={() => this.handleInfo(row, 'refundRecordDetail')} type="text">
            //       分账明细
            //     </el-button>
            //   </div>
            // );
          },
        },
      ];
    },

    currentDatePickerChange(datePicker) {
      this.formInline.startDate = datePicker[0] || null;
      this.formInline.endDate = datePicker[1] || null;
    },
  },
};
</script>
