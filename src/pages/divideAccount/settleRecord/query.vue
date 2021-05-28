<template>
  <div>
    <el-form
      ref="settleRecordForm"
      label-width="120px"
      :inline="true"
      :model="formInline"
    >
      <el-form-item>
        <el-input
          v-model="formInline.settleOrdNo"
          placeholder="结算订单号"
          clearable
        />
      </el-form-item>
      <el-form-item>
        <el-input
          v-model="formInline.payOrdNo"
          placeholder="支付订单号"
          clearable
        />
      </el-form-item>
      <el-form-item>
        <el-input
          v-model="formInline.proceedsAccountNo"
          placeholder="收款账号"
          clearable
        />
      </el-form-item>
      <el-form-item>
        <el-select
          v-model="formInline.settleChannel"
          clearable
          placeholder="结算渠道"
        >
          <el-option
            v-for="item in channelOption"
            :key="item.bankCode"
            :label="item.name"
            :value="item.bankCode"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-input
          v-model="formInline.payee"
          placeholder="收款人姓名"
          clearable
        />
      </el-form-item>
      <el-form-item>
        <el-input
          v-model="formInline.cardNo"
          placeholder="银行卡号"
          clearable
        />
      </el-form-item>
      <el-form-item>
        <el-select
          v-model="formInline.withdrawStatus"
          clearable
          placeholder="状态"
        >
          <el-option
            v-for="item in format.settleRecordStatus"
            :key="item.key"
            :label="item.label"
            :value="item.key"
          />
        </el-select>
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
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import tableFormMixin from "@/mixins/tableFormMixin";

export default {
  mixins: [tableFormMixin],
  data() {
    this.columns = this.getColumns();
    this.queryUrl = "/settle/query.json";
    this.pickerProps = {
      startPlaceholder: "交易开始时间",
      endPlaceholder: "交易结束时间",
    };

    return {
      formInline: {
        cardNo: null,
        payOrdNo: null,
        payee: null,
        proceedsAccountNo: null,
        settleChannel: null,
        settleOrdNo: null,
        timeConditionEnd: null,
        timeConditionStart: null,
        withdrawStatus: null,
      },
    };
  },
  computed: {
    ...mapGetters({
      channelOption: "channelList",
    }),
  },
  created() {
    this.$common.judgeState({
      channelList: "getChannelList",
    });
  },
  methods: {
    getColumns() {
      return [
        { prop: "startTime", label: "发起时间", width: 140 },
        { prop: "settleOrdNo", label: "结算订单号", width: 180 },
        { prop: "payOrdNo", label: "支付系统订单号", width: 180 },
        {
          prop: "amount",
          label: "金额",
          render: (h, value, row) => {
            return this.$common.moneyFormat(value);
          },
          width: "120",
        },
        {
          prop: "settleChannel",
          label: "结算渠道",
          render: (h, value, row) => {
            return this.$common.tableFormat(
              this.channelOption,
              value,
              "bankCode",
              "name"
            );
          },
          width: 100,
        },
        { prop: "settleAccountNo", label: "结算账户", width: 140 },
        {
          prop: "withdrawStatus",
          label: "提现状态",
          render: (h, value, row) => {
            return this.$common.tableFormat(
              this.format.settleRecordStatus,
              value
            );
          },
          width: 120,
        },
        { prop: "finishTime", label: "完成时间", width: 140 },
        { prop: "proceedsAccountNo", label: "收款账户", width: 180 },
        { prop: "payee", label: "收款人", width: 120 },
        { prop: "cardNo", label: "银行卡号", width: 160 },
        { prop: "correspondentNo", label: "联行号", width: 160 },
        { prop: "remark", label: "备注" },
      ];
    },
    currentDatePickerChange(datePicker) {
      this.formInline.timeConditionStart = datePicker[0] || null;
      this.formInline.timeConditionEnd = datePicker[1] || null;
    },
  },
};
</script>
