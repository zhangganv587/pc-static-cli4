<template>
  <div>
    <el-form
      ref="settleAccountForm"
      label-width="120px"
      :inline="true"
      :model="formInline"
    >
      <el-form-item>
        <el-input
          v-model="formInline.bizOrderNo"
          placeholder="业务订单号"
          clearable
        />
      </el-form-item>
      <el-form-item>
        <el-input
          v-model="formInline.payLogNo"
          placeholder="支付订单号"
          clearable
        />
      </el-form-item>
      <el-form-item>
        <el-input
          v-model="formInline.subOrderNo"
          placeholder="分账流水号"
          clearable
        />
      </el-form-item>
      <el-form-item>
        <el-select
          v-model="formInline.transChannel"
          clearable
          placeholder="分账渠道"
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
        <el-select
          v-model="formInline.transStatus"
          clearable
          placeholder="分账状态"
        >
          <el-option
            v-for="item in format.divideAccountStatus"
            :key="item.key"
            :label="item.label"
            :value="item.key"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-select
          v-model="formInline.transType"
          clearable
          placeholder="交易类型"
        >
          <el-option
            v-for="item in format.tradeType"
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
    this.queryUrl = "/number/query.json";
    this.columns = this.getColumns();
    this.pickerProps = {
      startPlaceholder: "分账开始时间",
      endPlaceholder: "分账结束时间",
    };
    return {
      formInline: {
        bizOrderNo: null,
        payLogNo: null,
        subOrderNo: null,
        transChannel: null,
        transStatus: null, // 分账状态:pending: 待分账;suc：分账成功;fail:分账失败
        transType: null, // 交易类型: pay:支付,refund:退款
        timeConditionStart: null,
        timeConditionEnd: null,
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
        { prop: "subAccountTime", label: "时间", width: 140 },
        { prop: "bizOrderNo", label: "业务订单号", width: 110 },
        { prop: "payLogNo", label: "支付系统订单号", width: 160 },
        { prop: "subOrderNo", label: "分账流水号", width: 160 },
        {
          prop: "transType",
          label: "交易类型",
          render: (h, value, row) => {
            return this.$common.tableFormat(this.format.tradeType, value);
          },
          width: 100,
        },
        {
          prop: "subAmount",
          label: "分账金额",
          render: (h, value, row) => {
            return this.$common.moneyFormat(value);
          },
          width: 100,
        },
        {
          prop: "transChannel",
          label: "分账渠道",
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
        { prop: "accountNo", label: "分账主账户", width: 120 },
        { prop: "subAccountNo", label: "分账子账户", width: 200 },
        {
          prop: "transStatus",
          label: "分账状态",
          render: (h, value, row) => {
            return this.$common.tableFormat(
              this.format.divideAccountStatus,
              value
            );
          },
          width: 100,
        },
        { prop: "memo", label: "备注" },
      ];
    },

    currentDatePickerChange(datePicker) {
      this.formInline.timeConditionStart = datePicker[0] || null;
      this.formInline.timeConditionEnd = datePicker[1] || null;
    },
  },
};
</script>
