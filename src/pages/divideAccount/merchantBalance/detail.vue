<template>
  <v-dialog title="分账明细" dialog-id="balanceInfo" width="80%">
    <el-form ref="dialogFormRef" :inline="true" :model="dialogInline">
      <el-form-item label="分账时间：">
        <we-date-picker
          :default-range="30"
          :max-range="31"
          @currentChange="dialogCurrentDatePickerChange"
        />
      </el-form-item>
      <el-form-item label="分账类型:">
        <el-select
          v-model="dialogInline.transType"
          clearable
          placeholder="请选择分账类型"
        >
          <el-option label="全部" value="" />
          <el-option
            v-for="item in format.tradeType"
            :key="item.key"
            :label="item.label"
            :value="item.key"
          />
        </el-select>
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
    <v-table
      v-loading="loading"
      type="index"
      :data="tableData"
      :columns="columns"
      :pagination="pagination"
      @currentChange="currentChange"
    />
    <el-button slot="footer" @click="$eventBus.$emit('dialog-visible', false)">
      关闭
    </el-button>
  </v-dialog>
</template>

<script>
import tableFormMixin from "@/mixins/tableFormMixin";

export default {
  mixins: [tableFormMixin],
  props: {
    rowData: {
      type: Object,
      default() {
        return {};
      },
    },
  },
  data() {
    this.columns = this.getColumns();
    this.queryUrl = "/number/query.json";

    return {
      dialogInline: {
        bizOrderNo: null,
        orderId: null,
        transNo: null,
        transChannel: null,
        transStatus: null, // 分账状态:pending: 待分账;suc：分账成功;fail:分账失败
        transType: null, // 交易类型: pay:支付,refund:退款
        timeConditionStart: null,
        timeConditionEnd: null,
      },
    };
  },
  watch: {
    rowData(newVal) {
      if (newVal && typeof newVal === "object") {
        this.dialogInline = {
          ...this.dialogInline,
          ...newVal,
        };
      }
    },
  },
  methods: {
    getColumns() {
      return [
        { prop: "subAccountTime", label: "分账时间" },
        {
          prop: "transType",
          label: "分账类型",
          render: (h, value, row) => {
            return this.$common.tableFormat(this.format.tradeType, value);
          },
          width: "120",
        },
        {
          prop: "subAmount",
          label: "分账金额",
          render: (h, value, row) => {
            return this.$common.moneyFormat(value);
          },
          width: "120",
        },
        {
          prop: "transStatus",
          label: "分账状态",
          render: (h, value, row) => {
            return this.$common.tableFormat(
              this.format.divideAccountStatus,
              value
            );
          },
          width: "120",
        },
        {
          prop: "accountBlance",
          label: "账户余额",
          render: (h, value, row) => {
            return this.$common.moneyFormat(value);
          },
          width: "120",
        },
        { prop: "subOrderNo", label: "分账流水号" },
        { prop: "memo", label: "备注" },
      ];
    },

    dialogCurrentDatePickerChange(datePicker) {
      this.dialogInline.timeConditionStart = datePicker[0] || null;
      this.dialogInline.timeConditionEnd = datePicker[1] || null;
    },
  },
};
</script>
