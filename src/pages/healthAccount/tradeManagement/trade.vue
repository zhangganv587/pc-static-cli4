<!--
 * @Author: zhanggan
 * @Date: 2020-10-21 16:24:12
 * @LastEditors: zhanggan
 * @Description: 健康账户管理 - 交易管理 - 交易管理
 * @FilePath: /gpay-ops-static/src/pages/healthAccount/tradeManagement/trade.vue
-->
<template>
  <div class="health-account-trade-manage">
    <el-form
      ref="HATradeManage"
      label-width="130px"
      :inline="true"
      :model="searchForm"
    >
      <el-form-item prop="meridOrderId">
        <el-input
          v-model="searchForm.meridOrderId"
          placeholder="商户支付订单号"
          clearable
        />
      </el-form-item>
      <el-form-item prop="uniteOrderId">
        <el-input
          v-model="searchForm.uniteOrderId"
          placeholder="内部订单号"
          clearable
        />
      </el-form-item>
      <el-form-item prop="refundOrderId">
        <el-input
          v-model="searchForm.refundOrderId"
          placeholder="商户退款订单号"
          clearable
        />
      </el-form-item>
      <el-form-item prop="bizOrderId">
        <el-input
          v-model="searchForm.bizOrderId"
          placeholder="三方交易单号"
          clearable
        />
      </el-form-item>
      <!-- <el-form-item
        prop="merchanName"
      >
        <el-input
          v-model="searchForm.merchanName"
          placeholder="商户名称"
          clearable
        />
      </el-form-item> -->
      <el-form-item prop="certNo">
        <el-input
          v-model="searchForm.certNo"
          placeholder="身份证号"
          clearable
        />
      </el-form-item>
      <el-form-item prop="userName">
        <el-input v-model="searchForm.userName" placeholder="姓名" clearable />
      </el-form-item>
      <el-form-item prop="payMethod">
        <el-select
          v-model="searchForm.payMethod"
          placeholder="交易方式"
          filterable
          clearable
        >
          <el-option
            v-for="(value, key) in HACCOUNT_TSTP"
            :key="key"
            :label="value"
            :value="key"
          />
        </el-select>
      </el-form-item>
      <el-form-item prop="payType">
        <el-select
          v-model="searchForm.payType"
          placeholder="交易类型"
          filterable
          clearable
        >
          <el-option
            v-for="(value, key) in HACCOUNT_PAY_TYPE"
            :key="key"
            :label="value"
            :value="key"
          />
        </el-select>
      </el-form-item>
      <el-form-item prop="payStatus">
        <el-select
          v-model="searchForm.payStatus"
          placeholder="交易状态"
          filterable
          clearable
        >
          <el-option
            v-for="(value, key) in HACCOUNT_PAY_STATUS"
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
        <el-button
          v-show="
            !isUser &&
            !(
              searchForm.meridOrderId ||
              searchForm.uniteOrderId ||
              searchForm.refundOrderId
            ) &&
            !(searchForm.createdTimeStart || searchForm.finishTimeStart)
          "
          type="primary"
          @click.native="noDataDownload()"
        >
          导出
        </el-button>
        <el-button
          v-show="
            !isUser &&
            (searchForm.meridOrderId ||
              searchForm.uniteOrderId ||
              searchForm.refundOrderId ||
              searchForm.createdTimeStart ||
              searchForm.finishTimeStart)
          "
          v-download="{
            fetchUrl: '/haccount/account/member/trade/export',
            dataRef: this,
            formRef: 'HATradeManage',
            fileName: '健康账户交易记录',
          }"
          type="primary opcity"
        >
          导出
        </el-button>
      </el-form-item>
    </el-form>
    <v-table
      v-loading="loading"
      :data="tableData"
      :columns="columns"
      :pagination="pagination"
      @currentChange="currentChange"
    />
  </div>
</template>
<script>
import tableFormMixin from "@/mixins/tableFormMixin";
import {
  HACCOUNT_TSTP,
  HACCOUNT_PAY_TYPE,
  HACCOUNT_PAY_STATUS,
} from "@/utils/constants";

export default {
  name: "HATradeManage",
  mixins: [tableFormMixin],
  data() {
    this.HACCOUNT_TSTP = HACCOUNT_TSTP;
    this.HACCOUNT_PAY_TYPE = HACCOUNT_PAY_TYPE;
    this.HACCOUNT_PAY_STATUS = HACCOUNT_PAY_STATUS;
    this.columns = this.getColumns();
    this.queryUrl = "/haccount/account/member/trade/page";
    this.creatPickerProps = {
      startPlaceholder: "交易发起开始时间",
      endPlaceholder: "交易发起结束时间",
    };
    this.modifyPickerProps = {
      startPlaceholder: "交易完成开始时间",
      endPlaceholder: "交易完成结束时间",
    };
    return {
      createTime: [],
      modifyTime: [],
      searchForm: {
        meridOrderId: null,
        uniteOrderId: null,
        refundOrderId: null,
        bizOrderId: null,
        certNo: null,
        userName: null,
        merchanName: null,
        payMethod: null,
        payType: null,
        payStatus: null,
        createdTimeStart: null,
        createdTimeEnd: null,
        finishTimeStart: null,
        finishTimeEnd: null,
      },
      // 导出权限
      isUser: false,
    };
  },
  mounted() {
    this.isUser = this.$route.path === "/healthaccount/usertrade";
  },
  methods: {
    creatDatePickerChange(datePicker) {
      this.searchForm.createdTimeStart = datePicker.length
        ? this.dayjs(datePicker[0]).format("YYYY-MM-DD HH:mm:ss")
        : null;
      this.searchForm.createdTimeEnd = datePicker.length
        ? this.dayjs(datePicker[1]).format("YYYY-MM-DD HH:mm:ss")
        : null;
    },
    modifyDatePickerChange(datePicker) {
      this.searchForm.finishTimeStart = datePicker.length
        ? this.dayjs(datePicker[0]).format("YYYY-MM-DD HH:mm:ss")
        : null;
      this.searchForm.finishTimeEnd = datePicker.length
        ? this.dayjs(datePicker[1]).format("YYYY-MM-DD HH:mm:ss")
        : null;
    },
    getColumns() {
      const columns = [
        { prop: "meridOrderId", label: "商户支付订单号", width: 160 },
        { prop: "uniteOrderId", label: "内部订单号", width: 160 },
        { prop: "refundOrderId", label: "商户退款订单号", width: 160 },
        { prop: "bizOrderId", label: "三方交易单号", width: 160 },
        // { prop: 'merchanName', label: '商户名称' },
        {
          prop: "amt",
          label: "订单金额/元",
          align: "right",
          width: 120,
          render: (h, value, row) => {
            return (
              <span class="tableRight">{this.$common.moneyFormat(value)}</span>
            );
          },
        },
        {
          prop: "payAmt",
          label: "实际交易金额/元",
          align: "right",
          width: 160,
          render: (h, value, row) => {
            return (
              <span class="tableRight">{this.$common.moneyFormat(value)}</span>
            );
          },
        },
        {
          prop: "payType",
          label: "交易类型",
          width: 100,
          render: (h, value, row) => {
            return +value > -1 ? HACCOUNT_PAY_TYPE[value] : null;
          },
        },
        {
          prop: "payStatus",
          label: "交易状态",
          width: 100,
          render: (h, value, row) => {
            return +value > -1 ? HACCOUNT_PAY_STATUS[value] : null;
          },
        },
        { prop: "payMethodText", label: "交易方式", width: 100 },
        { prop: "channelName", label: "交易路由", width: 100 },
        { prop: "userId", label: "用户编号", width: 100 },
        { prop: "userName", label: "用户姓名", width: 100 },
        { prop: "certNo", label: "身份证号", width: 120 },
        { prop: "goodsDesc", label: "订单描述", width: 160 },
        { prop: "startDateTimeText", label: "交易发起时间", width: 190 },
        { prop: "finishDateTimeText", label: "交易完成时间", width: 190 },
        { prop: "remark", label: "备注" },
      ];
      return columns;
    },
    noDataDownload() {
      this.$message.warning("请选择时间段");
    },
    handleSearchForm(data) {
      if (
        !(
          this.searchForm.meridOrderId ||
          this.searchForm.uniteOrderId ||
          this.searchForm.refundOrderId ||
          this.searchForm.bizOrderId ||
          this.searchForm.certNo ||
          this.searchForm.userName
        ) &&
        !(this.searchForm.createdTimeStart || this.searchForm.finishTimeStart)
      ) {
        this.$message.warning("请选择时间段");
      } else {
        this.handleSearch(data);
      }
    },
  },
};
</script>
