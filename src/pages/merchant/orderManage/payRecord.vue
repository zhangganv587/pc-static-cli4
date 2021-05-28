<template>
  <div>
    <el-form label-width="120px" :inline="true" :model="formInline">
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
          placeholder="支付流水号"
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
          v-model="formInline.payMethod"
          clearable
          placeholder="接口方式"
        >
          <el-option
            v-for="item in payConfigList.payMethod"
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
          v-model="formInline.mergeOrderNo"
          placeholder="合并订单号"
          clearable
        />
      </el-form-item>
      <el-form-item>
        <we-date-picker
          :default-range="30"
          :max-range="31"
          @currentChange="currentDatePickerChange"
        />
      </el-form-item>
      <el-form-item>
        <el-input v-model="formInline.orderId" placeholder="订单ID" clearable />
      </el-form-item>
      <el-form-item>
        <el-input
          v-model="formInline.accountNo"
          placeholder="收款账号"
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
    <pay-record-detail :biz-order-no="row.bizOrderNo" />
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import tableFormMixin from "@/mixins/tableFormMixin";
import payRecordDetail from "./component/payDetail";

export default {
  components: {
    payRecordDetail,
  },
  mixins: [tableFormMixin],
  data() {
    this.columns = this.getColumns();
    this.queryUrl = "/paylog/query.json";

    return {
      formInline: {
        bizOrderNo: null,
        payWays: null,
        accountNo: null,
        payMethod: null,
        payLogNo: null,
        paidNo: null,
        mergeOrderNo: null,
        orderId: null,
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
        { prop: "id", label: "id" },
        {
          prop: "gmtCreated",
          label: "创建时间",
          width: "140",
          render: (h, value, row) => {
            return this.$common.timeFormat(value);
          },
        },
        { prop: "mergeOrderNo", label: "合并单号", width: "220" },
        { prop: "payLogNo", label: "支付流水号", width: "220" },
        { prop: "bizOrderNo", label: "业务订单号", width: "200" },
        { prop: "orderId", label: "订单id", width: "160" },
        { prop: "paidNo", label: "支付机构流水号", width: "220" },
        {
          prop: "payStatus",
          label: "支付状态",
          render: (h, value, row) => {
            return this.$common.tableFormat(
              this.payConfigList.payStatus,
              value,
              "code",
              "memo"
            );
          },
          width: "120",
        },
        {
          prop: "paidTime",
          label: "支付时间",
          render: (h, value, row) => {
            return this.$common.timeFormat(value, "YYYY-MM-DD HH:mm:ss");
          },
          width: "120",
        },
        { prop: "settleDate", label: "过期时间", width: 120 },
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
        {
          prop: "totalAmount",
          label: "总金额（元）",
          render: (h, value, row) => {
            return (
              <span class="tableRight">{this.$common.moneyFormat(value)}</span>
            );
          },
          width: "120",
        },
        {
          prop: "amount",
          label: "实际付款金额（元）",
          render: (h, value, row) => {
            return (
              <span class="tableRight">{this.$common.moneyFormat(value)}</span>
            );
          },
          width: "140",
        },
        { prop: "accountNo", label: "收款账号", width: 140 },
        { prop: "appId", label: "AppId", width: "160" },
        { prop: "title", label: "标题", width: "200" },
        { prop: "body", label: "详情", width: "180" },
        { prop: "queryNo", label: "查询单号", width: "180" },
        {
          prop: "payMethod",
          label: "接口方式",
          render: (h, value, row) => {
            return this.$common.tableFormat(
              this.payConfigList.payMethod,
              value,
              "code",
              "memo"
            );
          },
          width: "120",
        },
        { prop: "memo", label: "备注", width: 160 },
        // 因为后台代码下限
        // {
        //   prop: '',
        //   label: '操作',
        //   fixed: 'right',
        //   render: (h, value, row) => {
        //     return (
        //       <el-button onClick={() => this.handleInfo(row, 'payRecordInfo')} type="text" >
        //         分账明细
        //       </el-button>
        //     );
        //   },
        // },
      ];
    },

    currentDatePickerChange(datePicker) {
      this.formInline.startDate = datePicker[0] || null;
      this.formInline.endDate = datePicker[1] || null;
    },
  },
};
</script>
