<!--
 * @Author: zhanggan
 * @Date: 2020-10-23 16:58:10
 * @LastEditors: zhanggan
 * @Description: 健康账户管理 - 交易管理 - 调账管理
 * @FilePath: /gpay-ops-static/src/pages/healthAccount/tradeManagement/adjust.vue
-->
<template>
  <div class="health-account-trade-manage">
    <el-form
      ref="HATradeManage"
      label-width="130px"
      :inline="true"
      :model="searchForm"
    >
      <el-form-item prop="chargeId">
        <el-input
          v-model="searchForm.chargeId"
          placeholder="调账流水号"
          clearable
        />
      </el-form-item>
      <el-form-item prop="userName">
        <el-input v-model="searchForm.userName" placeholder="姓名" clearable />
      </el-form-item>
      <el-form-item prop="mobile">
        <el-input v-model="searchForm.mobile" placeholder="手机号" clearable />
      </el-form-item>
      <el-form-item prop="bankNo">
        <el-input
          v-model="searchForm.bankNo"
          placeholder="银行卡号"
          clearable
        />
      </el-form-item>
      <!-- <el-form-item
        prop="merchantName"
      >
        <el-input
          v-model="searchForm.merchantName"
          placeholder="商户名称"
          clearable
        />
      </el-form-item> -->

      <el-form-item prop="status">
        <el-select
          v-model="searchForm.status"
          placeholder="状态"
          filterable
          clearable
        >
          <el-option
            v-for="(value, key) in HACCOUNT_ADJUST_STATUS"
            :key="key"
            :label="value"
            :value="key"
          />
        </el-select>
      </el-form-item>
      <el-form-item prop="createTime">
        <we-date-picker
          v-model="createTime"
          :picker-props="creatPickerProps"
          :default-range="7"
          :max-range="93"
          @currentChange="creatDatePickerChange"
        />
      </el-form-item>
      <el-form-item prop="modifyTime">
        <we-date-picker
          v-model="modifyTime"
          :picker-props="modifyPickerProps"
          :default-range="0"
          :max-range="93"
          @currentChange="modifyDatePickerChange"
        />
      </el-form-item>
      <el-form-item>
        <v-form-submit
          ref="formSubmit"
          :action="queryUrl"
          :immediate="true"
          :pagination="pagination"
          @click:search="handleSearchForm"
        >
          查询
        </v-form-submit>
        <v-form-reset :form-ref="$refs['HATradeManage']" />
      </el-form-item>
    </el-form>
    <v-table
      v-loading="loading"
      :data="tableData"
      :columns="columns"
      :pagination="pagination"
      @currentChange="currentChange"
    />
    <adjustDialog :row="row" />
  </div>
</template>
<script>
import tableFormMixin from "@/mixins/tableFormMixin";
import adjustDialog from "../component/adjustDialog";
import { HACCOUNT_ADJUST_STATUS } from "@/utils/constants";

export default {
  name: "HATradeManage",
  components: {
    adjustDialog,
  },
  mixins: [tableFormMixin],
  data() {
    this.HACCOUNT_ADJUST_STATUS = HACCOUNT_ADJUST_STATUS;
    this.columns = this.getColumns();
    this.queryUrl = "/haccount/account/charge/querycharge";
    this.creatPickerProps = {
      startPlaceholder: "提交开始时间",
      endPlaceholder: "提交结束时间",
    };
    this.modifyPickerProps = {
      startPlaceholder: "审批开始时间",
      endPlaceholder: "审批结束时间",
    };
    return {
      createTime: [],
      modifyTime: [],
      searchForm: {
        chargeId: null,
        userName: null,
        mobile: null,
        bankNo: null,
        merchantName: null,
        status: null,
        gmtApplyTimeStart: null,
        gmtApplyTimeEnd: null,
        gmtSubmitTimeStart: null,
        gmtSubmitTimeEnd: null,
      },
    };
  },
  methods: {
    creatDatePickerChange(datePicker) {
      this.searchForm.gmtApplyTimeStart = datePicker.length
        ? this.dayjs(datePicker[0]).format("YYYY-MM-DD HH:mm:ss")
        : null;
      this.searchForm.gmtApplyTimeEnd = datePicker.length
        ? this.dayjs(datePicker[1]).format("YYYY-MM-DD HH:mm:ss")
        : null;
    },
    modifyDatePickerChange(datePicker) {
      this.searchForm.gmtSubmitTimeStart = datePicker.length
        ? this.dayjs(datePicker[0]).format("YYYY-MM-DD HH:mm:ss")
        : null;
      this.searchForm.gmtSubmitTimeEnd = datePicker.length
        ? this.dayjs(datePicker[1]).format("YYYY-MM-DD HH:mm:ss")
        : null;
    },
    getColumns() {
      const columns = [
        { prop: "chargeId", label: "调账流水号" },
        { prop: "userName", label: "姓名" },
        { prop: "mobile", label: "手机号" },
        { prop: "bankNo", label: "银行卡号" },
        { prop: "bankName", label: "开卡行" },
        { prop: "channelNoName", label: "开户路由" },
        // { prop: 'merchantName', label: '商户名称' },
        {
          prop: "chargeAmt",
          label: "调账金额（借）/元",
          align: "right",
          render: (h, value, row) => {
            return (
              <span class="tableRight">{this.$common.moneyFormat(value)}</span>
            );
          },
        },
        //   { prop: 'realNameFlag',
        //     label: '银行调账账户（贷）/元',
        //     render: (h, value, row) => {
        //       return <span class="tableRight">{this.$common.moneyFormat(value)}</span>;
        //     }
        //   },
        { prop: "applyPeople", label: "提交人" },
        { prop: "submitPeople", label: "审批人" },
        {
          prop: "status",
          label: "状态",
          render: (h, value, row) => {
            return +value > -1 ? HACCOUNT_ADJUST_STATUS[value] : null;
          },
        },
        { prop: "gmtApplyText", label: "提交时间", width: "190" },
        { prop: "gmtSubmitText", label: "审批时间", width: "190" },
        { prop: "remark", label: "备注" },
        {
          prop: "status",
          label: "操作",
          width: "100",
          render: (h, value, row) => {
            return +value === 0 ? (
              <el-button
                onClick={() => this.handleInfo(row, "adjustDialog")}
                type="text"
                style="font-weight:500;"
              >
                审批
              </el-button>
            ) : (
              ""
            );
          },
        },
      ];
      return columns;
    },
    handleSearchForm(data) {
      if (
        !(this.searchForm.mobile || this.searchForm.bankNo) &&
        !this.searchForm.gmtApplyTimeStart
      ) {
        this.$message.warning("请选择时间");
      } else {
        this.handleSearch(data);
      }
    },
  },
};
</script>
