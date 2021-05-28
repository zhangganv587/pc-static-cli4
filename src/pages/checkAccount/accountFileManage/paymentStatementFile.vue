<template>
  <div>
    <el-form
      ref="paymentStateForm"
      label-width="120px"
      :inline="true"
      :model="formInline"
      :rules="rules"
    >
      <el-form-item prop="datePicker">
        <we-date-picker
          v-model="createTime"
          :picker-props="creatPickerProps"
          :max-range="7"
          @currentChange="creatDatePickerChange"
        />
      </el-form-item>
      <el-form-item prop="accountChannelList">
        <el-select
          v-model="accountChannelList"
          clearable
          placeholder="账单类别"
        >
          <el-option label="医保支付" :value="5" />
          <el-option label="现金支付" :value="3" />
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
      <el-form-item>
        <el-button type="primary" @click="handleSearch('clickSearch')">
          查询
        </el-button>
        <v-form-reset :form-ref="$refs['paymentStateForm']" />
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
import {
  ACCOUNT_CHANNEL_LIST,
  TRANSACTION_TYPE_LIST,
  ACCOUNT_RESULT_STATUS,
  RECODE_STATUS,
} from "@/utils/constants";

export default {
  components: {
    // payRecordDetail
  },
  data() {
    this.columns = this.getColumns();
    this.queryUrl = "/bill/gpay.json";
    this.exportUrl = "/payAccount/resultExport.json";
    this.ACCOUNT_CHANNEL_LIST = ACCOUNT_CHANNEL_LIST;
    this.TRANSACTION_TYPE_LIST = TRANSACTION_TYPE_LIST;
    this.ACCOUNT_RESULT_STATUS = ACCOUNT_RESULT_STATUS;
    this.RECODE_STATUS = RECODE_STATUS;
    this.creatPickerProps = {
      startPlaceholder: "对账开始时间",
      endPlaceholder: "对账结束时间",
    };
    var validateDate = (rule, value, callback) => {
      if (!this.formInline.accountTimeStart) {
        callback(new Error("时间不能为空！"));
      } else {
        callback();
      }
    };
    return {
      accountChannelList: [],
      createTime: [],
      formInline: {
        accountTimeStart: null, // "对账时间起点",
        accountTimeEnd: null, // "对账时间终点",
        accountChannelList: null,
        recodeStatus: null, // 导入状态：0：成功；1-失败",
      },
      rules: {
        datePicker: [{ validator: validateDate, trigger: ["change", "blur"] }],
      },
      // 分页
      pagination: {
        pageSize: 10,
        pageIndex: 1,
        totalNum: 0,
      },

      // table
      tableData: [],

      // dialog
      row: {},
    };
  },
  computed: {
    loading() {
      return this.$store.state.effectLoading[this.queryUrl];
    },
  },
  mounted() {
    this.handleSearch();
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
          label: "账单类别",
          width: "250",
          render: (h, value, row) => {
            const obj = {
              3: "现金支付",
              5: "医保支付",
            };
            return obj[value];
          },
        },
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
    creatDatePickerChange(datePicker) {
      this.formInline.accountTimeStart = datePicker
        ? new Date(datePicker[0]).getTime()
        : "";
      this.formInline.accountTimeEnd = datePicker
        ? new Date(datePicker[1]).getTime()
        : "";
    },
    downLoadFile(value, row) {
      window.location.href = value;
    },
    handleSearch(clickFlag) {
      this.$refs.paymentStateForm.validate((valid) => {
        if (!valid) {
          return;
        }
        let accountChannelArr = [];
        if (this.accountChannelList) {
          accountChannelArr.push(this.accountChannelList);
        } else {
          accountChannelArr = [3, 5];
        }
        let resetPagination = {};
        if (clickFlag === "clickSearch") {
          resetPagination = {
            pageIndex: 1,
            totalNum: 0,
          };
        }
        this.$fetch(this.queryUrl, {
          method: "post",
          data: {
            ...this.formInline,
            ...this.pagination,
            ...resetPagination,
            accountChannelList: accountChannelArr,
          },
        }).then((res) => {
          if (res.code === 0 && res.data) {
            this.tableData = res.data.dataList;
            this.pagination.pageIndex = res.data.pageNum;
            this.pagination.pageSize = res.data.pageSize;
            this.pagination.totalNum = res.data.totalNum;
          } else {
            this.tableData = [];
            this.pagination.totalNum = 0;
          }
        });
      });
    },
    currentChange(val) {
      this.pagination = { ...this.pagination, ...val };
      this.handleSearch();
    },
    handleInfo(row, dialogId) {
      this.row = row;
      this.$eventBus.$emit("dialog-visible", {
        visible: true,
        dialogId,
      });
    },
  },
};
</script>
