<template>
  <div>
    <el-form
      ref="channelStateForm"
      label-width="120px"
      :inline="true"
      :model="formInline"
    >
      <el-form-item prop="datePicker">
        <el-date-picker
          v-model="datePicker"
          type="daterange"
          start-placeholder="交易开始日期"
          end-placeholder="交易结束日期"
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
      <el-form-item prop="recodeStatus">
        <el-select
          v-model="formInline.recodeStatus"
          clearable
          placeholder="导入状态"
        >
          <el-option
            v-for="(value, key) in RECODE_STATUS"
            :key="key"
            :label="value"
            :value="key"
          />
        </el-select>
      </el-form-item>

      <el-form-item prop="channelAccountNo">
        <el-input
          v-model="formInline.channelAccountNo"
          placeholder="渠道账号"
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
        <v-form-reset :form-ref="$refs['channelStateForm']" />
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
  RECODE_STATUS,
} from "@/utils/constants";
// import payRecordDetail from './detail';
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";

export default {
  components: {
    // payRecordDetail
  },
  mixins: [tableFormMixin],
  data() {
    this.columns = this.getColumns();
    this.queryUrl = "/bill/channel.json";
    this.exportUrl = "/payAccount/resultExport.json";
    this.ACCOUNT_CHANNEL_LIST = ACCOUNT_CHANNEL_LIST;
    this.TRANSACTION_TYPE_LIST = TRANSACTION_TYPE_LIST;
    this.ACCOUNT_RESULT_STATUS = ACCOUNT_RESULT_STATUS;
    this.RECODE_STATUS = RECODE_STATUS;
    return {
      datePicker: [
        this.dayjs(new Date() - 3600 * 1000 * 24).format("YYYY-MM-DD"),
        this.dayjs(new Date() - 3600 * 1000 * 24).format("YYYY-MM-DD"),
      ],
      formInline: {
        accountTimeStart: null, // "对账时间起点",
        accountTimeEnd: null, // "对账时间终点",
        recodeStatus: null, // 导入状态：0：成功；1-失败",
        accountChannelList: [0, 1, 2],
      },
      // table-编辑框
    };
  },
  // computed: {
  //   ...mapGetters({
  //     payConfigList: 'payConfigList',
  //   }),
  // },
  watch: {
    datePicker(newVal) {
      this.currentDatePickerChange(newVal);
    },
  },
  // created() {
  //   this.$common.judgeState({
  //     payConfigList: 'getPayConfigList',
  //   });
  // },
  mounted() {
    this.currentDatePickerChange();
  },
  methods: {
    getColumns() {
      return [
        {
          prop: "accountTime",
          label: "对账单日期",
          width: "180",
        },
        {
          prop: "accountChannel",
          label: "交易渠道",
          width: "160",
          render: (h, value, row) => {
            return ACCOUNT_CHANNEL_LIST[value];
          },
        },
        { prop: "channelAccountNo", label: "渠道账号", width: "250" },
        { prop: "fileSuffix", label: "文件类型", width: "250" },
        { prop: "fileName", label: "文件名称", width: "250" },
        {
          prop: "recodeStatus",
          label: "导入状态",
          width: "250",
          render: (h, value, row) => {
            return RECODE_STATUS[value];
          },
        },
        { prop: "failCause", label: "失败原因", width: "250" },
        {
          prop: "filePath",
          label: "操作",
          fixed: "right",
          render: (h, value, row) => {
            return (
              <el-button
                type="text"
                onClick={() => this.downLoadFile(value, row)}
              >
                下载
              </el-button>
            );
          },
        },
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
    downLoadFile(value, row) {
      window.location.href = value;
    },
  },
};
</script>
