<template>
  <div>
    <el-form
      ref="statisticListForm"
      label-width="120px"
      :inline="true"
      :model="formInline"
    >
      <el-form-item prop="datePicker">
        <el-date-picker
          v-model="datePicker"
          type="daterange"
          start-placeholder="对账开始日期"
          end-placeholder="对账结束日期"
          format="yyyy-MM-dd"
          value-format="yyyy-MM-dd"
        />
      </el-form-item>
      <el-form-item prop="accountChannel">
        <el-select
          v-model="formInline.accountChannel"
          clearable
          placeholder="支付渠道"
        >
          <el-option
            v-for="(value, key) in ACCOUNT_CHANNEL_LIST"
            :key="key"
            :label="value"
            :value="key"
          />
        </el-select>
      </el-form-item>

      <el-form-item prop="partnerName">
        <el-input
          v-model="formInline.partnerName"
          placeholder="请输入商户名称"
          clearable
        />
      </el-form-item>
      <el-form-item prop="partnerNo">
        <el-input
          v-model="formInline.partnerNo"
          placeholder="请输入商户编号"
          clearable
        />
      </el-form-item>
      <el-form-item prop="transactionType">
        <el-select
          v-model="formInline.transactionType"
          clearable
          placeholder="交易类型"
        >
          <el-option
            v-for="(value, key) in TRANSACTION_TYPE_LIST"
            :key="key"
            :label="value"
            :value="key"
          />
        </el-select>
      </el-form-item>
      <el-form-item prop="channelAccountNo">
        <el-input
          v-model="formInline.channelAccountNo"
          placeholder="请输入渠道账号"
          clearable
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
        <v-form-reset :form-ref="$refs['statisticListForm']" />
        <el-button
          v-download="{
            fetchUrl: '/payAccount/statisticsExport.json',
            dataRef: this,
            formRef: 'statisticListForm',
            fileName: '对账统计',
          }"
          type="primary opcity"
        >
          导出
        </el-button>
      </el-form-item>
    </el-form>

    <v-table
      v-loading="loading"
      type="index"
      align="center"
      :data="tableData"
      :columns="columns"
      :pagination="pagination"
      @currentChange="currentChange"
    />
  </div>
</template>

<script>
// import { mapGetters } from 'vuex';
import tableFormMixin from "@/mixins/tableFormMixin";
import {
  ACCOUNT_CHANNEL_LIST,
  TRANSACTION_TYPE_LIST,
  ACCOUNT_RESULT_STATUS,
} from "@/utils/constants";
// import payRecordDetail from './detail';
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";

export default {
  // components: {
  // payRecordDetail
  // },
  mixins: [tableFormMixin],
  data() {
    this.columns = this.getColumns();
    this.queryUrl = "/payAccount/statistics.json";
    this.exportUrl = "/payAccount/resultExport.json";
    this.ACCOUNT_CHANNEL_LIST = ACCOUNT_CHANNEL_LIST;
    this.TRANSACTION_TYPE_LIST = TRANSACTION_TYPE_LIST;
    this.ACCOUNT_RESULT_STATUS = ACCOUNT_RESULT_STATUS;
    return {
      datePicker: [
        this.dayjs(new Date() - 3600 * 1000 * 24).format("YYYY-MM-DD"),
        this.dayjs(new Date() - 3600 * 1000 * 24).format("YYYY-MM-DD"),
      ],
      formInline: {
        accountTimeStart: null, // "对账时间起点",
        accountTimeEnd: null, // "对账时间终点",
        accountChannel: null, // "对账渠道：0-支付宝；1-微信",
        transactionType: null, // "交易类型：0-支付；1-退款",
        partnerNo: null, // "机构号",
        channelAccountNo: null, // "渠道账号",
      },
      // table-编辑框
    };
  },
  // computed: {
  // ...mapGetters({
  //   payConfigList: 'payConfigList',
  // }),
  // },
  watch: {
    datePicker(newVal) {
      this.currentDatePickerChange(newVal);
    },
  },
  mounted() {
    this.currentDatePickerChange();
  },
  methods: {
    getColumns() {
      return [
        // { prop: 'id', label: 'id' },
        { prop: "partnerName", label: "商户名称", width: "220" },
        { prop: "partnerNo", label: "商户编号", width: "220" },

        {
          prop: "accountTime",
          label: "对账日期",
          width: "180",
        },
        {
          prop: "accountChannel",
          label: "对账渠道",
          width: "160",
          render: (h, value, row) => {
            return ACCOUNT_CHANNEL_LIST[value];
          },
        },
        { prop: "channelAccountNo", label: "渠道账号", width: "250" },
        {
          prop: "transactionType",
          label: "交易类型",
          width: "160",
          render: (h, value, row) => {
            return TRANSACTION_TYPE_LIST[value];
          },
        },
        { prop: "channelSum", label: "渠道侧笔数", width: "220" },
        {
          prop: "channelAmount",
          label: "渠道侧金额",
          width: "220",
          render: (h, value, row) => {
            return this.$common.moneyFormat(value);
          },
        },
        { prop: "gpaySum", label: "收银台侧笔数", width: "220" },
        {
          prop: "gpayAmount",
          label: "收银台侧金额",
          width: "220",
          render: (h, value, row) => {
            return this.$common.moneyFormat(value);
          },
        },
        { prop: "channelMore", label: "渠道多", width: "220" },
        { prop: "gpayMore", label: "收银台多", width: "220" },
      ];
    },

    currentDatePickerChange(newVal) {
      const datePicker = newVal || this.datePicker;
      this.formInline.accountTimeStart = datePicker ? datePicker[0] : null;
      this.formInline.accountTimeEnd = datePicker ? datePicker[1] : null;
      this.maxDateRange(
        this.formInline.accountTimeStart,
        this.formInline.accountTimeEnd,
        30
      );
    },
    maxDateRange(start, end, maxDay = 30) {
      if (!start || !end) {
        return !0;
      }
      this.dayjs.extend(isSameOrAfter);
      const dayjs = this.dayjs;
      const latest = dayjs(start).add(maxDay, "day"); // 计算范围内最迟日期
      let flag = true; // 是否在范围内
      if (!dayjs(latest).isSameOrAfter(end, "day")) {
        // 选中日期若不在范围
        this.$message({
          type: "error",
          message: `时间范围最大支持仅${maxDay}天`,
        });
        flag = false;
      }
      return flag;
    },
  },
};
</script>
