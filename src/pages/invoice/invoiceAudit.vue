<!--
 * @Author: 张淦
 * @Date: 2020-02-09 15:28:28
 * @LastEditors: zhanggan
 * @Description: 发票系统-发票审核弹框
 * @FilePath: /gpay-ops-static/src/pages/invoice/invoiceAudit.vue
 -->
<template>
  <div class="invoiceAudit">
    <div v-show="searchForm.invoiceType === '2'">
      <h3>蓝字发票信息</h3>
      <v-table
        v-loading="loading"
        :data="billList"
        :columns="bill"
        :pagination="pagination"
        @currentChange="currentChange"
      />
      <h3>退款信息</h3>
      <v-table
        v-loading="loading"
        :data="refundList"
        :columns="refund"
        :pagination="pagination"
        @currentChange="currentChange"
      />
    </div>
    <div v-show="searchForm.invoiceType === '1'">
      <h3>支付信息</h3>
      <v-table
        v-loading="loading"
        :data="paymentList"
        :columns="payment"
        :pagination="pagination"
        @currentChange="currentChange"
      />
    </div>
    <h3>{{ invoiceTypeArr[parseInt(searchForm.invoiceType) - 1] }}</h3>
    <v-table
      v-loading="loading"
      :data="invoiceList"
      :columns="invoice"
      :pagination="pagination"
      @currentChange="currentChange"
    />
    <h3>发票明细</h3>
    <v-table
      v-loading="loading"
      :data="tableList"
      :columns="columns"
      :pagination="pagination"
      @currentChange="currentChange"
    />
    <h3>审核说明</h3>
    <el-input
      v-model="searchForm.bizMessage"
      placeholder="请输入备注"
      clearable
      type="textarea"
      maxlength="150"
      show-word-limit
      :disabled="isEditDisabled"
      :rows="3"
    />
    <div style="marginbottom: 20px" />
    <el-button
      v-if="searchForm.billingStatus !== 2"
      type="primary"
      @click="handleSubmitForm()"
    >
      提交审核
    </el-button>
    <el-button v-else type="primary" @click="handleSubmitForm()">
      返回
    </el-button>
    <detailsDialog :row-data="row" />
  </div>
</template>

<script>
import detailsDialog from "./invoiceDetailsDialog.vue";
import _mergeJSXProps from "babel-helper-vue-jsx-merge-props";
import { PREFERENTIAL_POLICIES, MARK_STATUS } from "@/utils/constants";

export default {
  components: {
    detailsDialog,
  },
  data() {
    this.bill = this.getBill();
    this.refund = this.getRefund();
    this.payment = this.getPayment();
    this.invoice = this.getInvoice();
    this.columns = this.getColumns();
    this.queryUrl = "";
    this.invoiceTypeArr = ["开票信息", "红字开票信息"];
    return {
      isEditDisabled: false,
      billList: [],
      refundList: [],
      paymentList: [],
      invoiceList: [],
      tableList: [],
      // 查询table
      searchForm: {
        orderNo: null,
        id: null,
        payee: null,
        reviewer: null,
        issuer: null,
        bizMessage: null,
        invoiceDetailList: [
          {
            detailId: null,
            goodsName: null,
            taxRate: null,
            goodsSpecifications: null,
            goodsUnit: null,
            goodsNumber: null,
            goodsPrice: null,
            money: null,
            taxCode: null,
            preferentialPolicies: null,
            preferentialPoliciesName: null,
            mark: null,
            deductions: null,
            discountAmount: null,
          },
        ],
      },
      // 分页
      pagination: {
        pageSize: 10,
        pageIndex: 1,
        totalNum: 0,
      },
      // 弹窗
      row: [],
    };
  },
  computed: {
    loading() {
      return this.$store.state.effectLoading[this.queryUrl];
    },
  },
  created() {
    this.orderNo = this.$route.params.order;
    this.handleSearchForm(this.orderNo);
  },
  methods: {
    // 篮子发票信息
    getBill() {
      const bill = [
        { prop: "originOrderNo", label: "原开票订单号" },
        { prop: "invoiceCode", label: "发票代码" },
        { prop: "invoiceNo", label: "发票号码" },
        { prop: "invoiceTitle", label: "发票抬头" },
        {
          prop: "invoiceMoney",
          label: "发票金额(元)",
          render: (h, value, row) => {
            return (
              <span class="tableRight">{this.$common.moneyFormat(value)}</span>
            );
          },
        },
        {
          prop: "invoiceTime",
          label: "开票日期",
          render: (h, value, row) => {
            return this.$common.timeFormat(value, "YYYY-MM-DD HH:mm:ss");
          },
        },
        {
          prop: "invoiceWyUrl",
          label: "查看",
          width: "100",
          render: (h, value, row) => {
            const url = encodeURIComponent(value);
            return (
              <el-button onClick={() => this.handlePDF(url)} type="text">
                查看
              </el-button>
            );
          },
        },
      ];
      return bill;
    },
    // 退款信息
    getRefund() {
      const refund = [
        { prop: "orderNo", label: "退款订单号" },
        { prop: "payLogNo", label: "支付流水号" },
        { prop: "refundNo", label: "退款流水号" },
        {
          prop: "totalAmount",
          label: "退款金额(元)",
          render: (h, value, row) => {
            return (
              <span class="tableRight">{this.$common.moneyFormat(value)}</span>
            );
          },
        },
        {
          prop: "selrefundMoney",
          label: "自费退款金额(元)",
          render: (h, value, row) => {
            if (value) {
              return (
                <span class="tableRight">
                  {this.$common.moneyFormat(value)}
                </span>
              );
            }
          },
        },
        {
          prop: "miRefundMoney",
          label: "医保退款金额(元)",
          render: (h, value, row) => {
            if (value) {
              return (
                <span class="tableRight">
                  {this.$common.moneyFormat(value)}
                </span>
              );
            }
          },
        },
        { prop: "status", label: "订单状态" },
        {
          prop: "refundDate",
          label: "退款完成时间",
          render: (h, value, row) => {
            return this.$common.timeFormat(value, "YYYY-MM-DD HH:mm:ss");
          },
        },
      ];
      return refund;
    },
    // 支付信息
    getPayment() {
      const payment = [
        { prop: "orderSourceFlag", label: "业务类型" },
        { prop: "orderNo", label: "业务订单号" },
        { prop: "payNo", label: "支付流水号" },
        {
          prop: "orderAmount",
          label: "订单金额(元)",
          render: (h, value, row) => {
            return (
              <span class="tableRight">{this.$common.moneyFormat(value)}</span>
            );
          },
        },
        {
          prop: "fundAmount",
          label: "医保支付金额(元)",
          render: (h, value, row) => {
            if (value) {
              return (
                <span class="tableRight">
                  {this.$common.moneyFormat(value)}
                </span>
              );
            }
          },
        },
        { prop: "status", label: "订单状态" },
        {
          prop: "paidTime",
          label: "支付完成时间",
          render: (h, value, row) => {
            return this.$common.timeFormat(value, "YYYY-MM-DD HH:mm:ss");
          },
        },
      ];
      return payment;
    },
    // 开票信息
    getInvoice() {
      const invoice = [
        { prop: "enterpriseName", label: "开票主体" },
        { prop: "titleType", label: "抬头类型" },
        { prop: "invoiceTitle", label: "发票抬头" },
        { prop: "taxId", label: "税号" },
        { prop: "address", label: "地址" },
        { prop: "phoneNo", label: "电话" },
        { prop: "bankType", label: "开户银行" },
        { prop: "bankAccount", label: "银行账号" },
        {
          prop: "invoiceDetailList",
          label: "开票内容",
          width: "100",
          render: (h, value, row) => {
            return (
              <el-button
                onClick={() =>
                  this.handleInfo(row.invoiceDetailList, "invoiceDetails")
                }
                type="text"
              >
                明细
              </el-button>
            );
          },
        },
        {
          prop: "payAmt",
          label: "发票金额(元)",
          render: (h, value, row) => {
            return (
              <span class="tableRight">{this.$common.moneyFormat(value)}</span>
            );
          },
        },
        { prop: "userReceiveMail", label: "发送邮箱" },
        {
          prop: "payee",
          label: "收款人",
          width: 170,
          render: (h, value, row) => {
            // return <div><input type="text" v-model={this.searchForm.payee}/>{this.searchForm.payee}</div>;
            return value;
          },
        },
        {
          prop: "reviewer",
          label: "复核人",
          width: 170,
          render: (h, value, row) => {
            return value;
          },
        },
        {
          prop: "issuer",
          label: "开票人",
          width: 170,
          render: (h, value, row) => {
            return value;
          },
        },
      ];
      return invoice;
    },
    // 发票明细
    getColumns() {
      const columns = [
        {
          prop: "goodsName",
          label: "商品名称",
          width: 170,
          render: (h, value, row, index) => {
            var _this = this;
            if (
              !this.searchForm.invoiceDetailList.length ||
              this.searchForm.billingStatus !== 2
            ) {
              return h(
                "input",
                _mergeJSXProps([
                  {
                    domProps: {
                      value:
                        _this.searchForm.invoiceDetailList[index].goodsName,
                    },
                    on: {
                      input: ($event) => {
                        if ($event.target.composing) {
                          return;
                        }
                        _this.searchForm.invoiceDetailList[index].goodsName =
                          $event.target.value;
                      },
                    },
                  },
                  {
                    directives: [
                      {
                        name: "model",
                        value:
                          _this.searchForm.invoiceDetailList[index].goodsName,
                      },
                    ],
                  },
                ]),
                []
              );
            } else {
              return value;
            }
          },
        },
        {
          prop: "taxRate",
          label: "税率",
          width: 170,
          render: (h, value, row, index) => {
            var _this = this;
            if (
              !this.searchForm.invoiceDetailList.length ||
              this.searchForm.billingStatus !== 2
            ) {
              return h(
                "input",
                _mergeJSXProps([
                  {
                    domProps: {
                      value: _this.searchForm.invoiceDetailList[index].taxRate,
                    },
                    on: {
                      input: ($event) => {
                        if ($event.target.composing) {
                          return;
                        }
                        _this.searchForm.invoiceDetailList[index].taxRate =
                          $event.target.value;
                      },
                    },
                  },
                  {
                    directives: [
                      {
                        name: "model",
                        value:
                          _this.searchForm.invoiceDetailList[index].taxRate,
                      },
                    ],
                  },
                ]),
                []
              );
            } else {
              return value;
            }
          },
        },
        {
          prop: "goodsSpecifications",
          label: "规格型号",
          width: 170,
          render: (h, value, row, index) => {
            var _this = this;
            if (
              !this.searchForm.invoiceDetailList.length ||
              this.searchForm.billingStatus !== 2
            ) {
              return h(
                "input",
                _mergeJSXProps([
                  {
                    domProps: {
                      value:
                        _this.searchForm.invoiceDetailList[index]
                          .goodsSpecifications,
                    },
                    on: {
                      input: ($event) => {
                        if ($event.target.composing) {
                          return;
                        }
                        _this.searchForm.invoiceDetailList[
                          index
                        ].goodsSpecifications = $event.target.value;
                      },
                    },
                  },
                  {
                    directives: [
                      {
                        name: "model",
                        value:
                          _this.searchForm.invoiceDetailList[index]
                            .goodsSpecifications,
                      },
                    ],
                  },
                ]),
                []
              );
            } else {
              return value;
            }
          },
        },
        {
          prop: "goodsUnit",
          label: "计量单位",
          width: 170,
          render: (h, value, row, index) => {
            var _this = this;
            if (
              !this.searchForm.invoiceDetailList.length ||
              this.searchForm.billingStatus !== 2
            ) {
              return h(
                "input",
                _mergeJSXProps([
                  {
                    domProps: {
                      value:
                        _this.searchForm.invoiceDetailList[index].goodsUnit,
                    },
                    on: {
                      input: ($event) => {
                        if ($event.target.composing) {
                          return;
                        }
                        _this.searchForm.invoiceDetailList[index].goodsUnit =
                          $event.target.value;
                      },
                    },
                  },
                  {
                    directives: [
                      {
                        name: "model",
                        value:
                          _this.searchForm.invoiceDetailList[index].goodsUnit,
                      },
                    ],
                  },
                ]),
                []
              );
            } else {
              return value;
            }
          },
        },
        {
          prop: "goodsNumber",
          label: "数量",
          width: 170,
          render: (h, value, row, index) => {
            var _this = this;
            if (
              !this.searchForm.invoiceDetailList.length ||
              this.searchForm.billingStatus !== 2
            ) {
              return h(
                "input",
                _mergeJSXProps([
                  {
                    domProps: {
                      value:
                        _this.searchForm.invoiceDetailList[index].goodsNumber,
                    },
                    on: {
                      input: ($event) => {
                        if ($event.target.composing) {
                          return;
                        }
                        _this.searchForm.invoiceDetailList[index].goodsNumber =
                          $event.target.value;
                      },
                    },
                  },
                  {
                    directives: [
                      {
                        name: "model",
                        value:
                          _this.searchForm.invoiceDetailList[index].goodsNumber,
                      },
                    ],
                  },
                ]),
                []
              );
            } else {
              return value;
            }
          },
        },
        {
          prop: "goodsPrice",
          label: "含税单价(元)",
          width: 170,
          render: (h, value, row, index) => {
            var _this = this;
            if (
              !this.searchForm.invoiceDetailList.length ||
              this.searchForm.billingStatus !== 2
            ) {
              return h(
                "input",
                _mergeJSXProps([
                  {
                    domProps: {
                      value: this.$common.moneyFormat(
                        _this.searchForm.invoiceDetailList[index].goodsPrice
                      ),
                    },
                    on: {
                      input: ($event) => {
                        if ($event.target.composing) {
                          return;
                        }
                        _this.searchForm.invoiceDetailList[index].goodsPrice =
                          $event.target.value * 100;
                      },
                    },
                  },
                  {
                    directives: [
                      {
                        name: "model",
                        value:
                          _this.searchForm.invoiceDetailList[index].goodsPrice,
                      },
                    ],
                  },
                ]),
                []
              );
            } else {
              return this.$common.moneyFormat(value);
            }
          },
        },
        {
          prop: "money",
          label: "金额(元)",
          width: 170,
          render: (h, value, row, index) => {
            if (
              !this.searchForm.invoiceDetailList.length ||
              this.searchForm.billingStatus !== 2
            ) {
              var _this = this;
              return h(
                "input",
                _mergeJSXProps([
                  {
                    domProps: {
                      value: this.$common.moneyFormat(
                        _this.searchForm.invoiceDetailList[index].money
                      ),
                    },
                    on: {
                      input: ($event) => {
                        if ($event.target.composing) {
                          return;
                        }
                        _this.searchForm.invoiceDetailList[index].money =
                          $event.target.value * 100;
                      },
                    },
                  },
                  {
                    directives: [
                      {
                        name: "model",
                        value: _this.searchForm.invoiceDetailList[index].money,
                      },
                    ],
                  },
                ]),
                []
              );
            } else {
              return this.$common.moneyFormat(value);
            }
          },
        },
        {
          prop: "taxCode",
          label: "税收分类编码",
          width: 170,
          render: (h, value, row, index) => {
            var _this = this;
            if (
              !this.searchForm.invoiceDetailList.length ||
              this.searchForm.billingStatus !== 2
            ) {
              return h(
                "input",
                _mergeJSXProps([
                  {
                    domProps: {
                      value: _this.searchForm.invoiceDetailList[index].taxCode,
                    },
                    on: {
                      input: ($event) => {
                        if ($event.target.composing) {
                          return;
                        }
                        _this.searchForm.invoiceDetailList[index].taxCode =
                          $event.target.value;
                        console.log($event.target.value);
                        console.log(
                          _this.searchForm.invoiceDetailList[index].taxCode
                        );
                      },
                    },
                  },
                  {
                    directives: [
                      {
                        name: "model",
                        value:
                          _this.searchForm.invoiceDetailList[index].taxCode,
                      },
                    ],
                  },
                ]),
                []
              );
            } else {
              return value;
            }
          },
        },
        {
          prop: "preferentialPolicies",
          label: "是否享受优惠政策",
          width: 170,
          render: (h, value, row, index) => {
            var _this = this;
            if (
              !this.searchForm.invoiceDetailList.length ||
              this.searchForm.billingStatus !== 2
            ) {
              return h(
                "input",
                _mergeJSXProps([
                  {
                    domProps: {
                      value:
                        PREFERENTIAL_POLICIES[
                          _this.searchForm.invoiceDetailList[index]
                            .preferentialPolicies
                        ],
                    },
                    on: {
                      input: ($event) => {
                        if ($event.target.composing) {
                          return;
                        }
                        _this.searchForm.invoiceDetailList[
                          index
                        ].preferentialPolicies = $event.target.value;
                      },
                    },
                  },
                  {
                    directives: [
                      {
                        name: "model",
                        value:
                          _this.searchForm.invoiceDetailList[index]
                            .preferentialPolicies,
                      },
                    ],
                  },
                ]),
                []
              );
            } else {
              if (value) {
                return PREFERENTIAL_POLICIES[value];
              }
            }
          },
        },
        {
          prop: "preferentialPoliciesName",
          label: "优惠政策名称",
          width: 170,
          render: (h, value, row, index) => {
            var _this = this;
            if (
              !this.searchForm.invoiceDetailList.length ||
              this.searchForm.billingStatus !== 2
            ) {
              return h(
                "input",
                _mergeJSXProps([
                  {
                    domProps: {
                      value:
                        _this.searchForm.invoiceDetailList[index]
                          .preferentialPoliciesName,
                    },
                    on: {
                      input: ($event) => {
                        if ($event.target.composing) {
                          return;
                        }
                        _this.searchForm.invoiceDetailList[
                          index
                        ].preferentialPoliciesName = $event.target.value;
                      },
                    },
                  },
                  {
                    directives: [
                      {
                        name: "model",
                        value:
                          _this.searchForm.invoiceDetailList[index]
                            .preferentialPoliciesName,
                      },
                    ],
                  },
                ]),
                []
              );
            } else {
              return value;
            }
          },
        },
        {
          prop: "mark",
          label: "零税率标识",
          width: 170,
          render: (h, value, row, index) => {
            var _this = this;
            if (
              !this.searchForm.invoiceDetailList.length ||
              this.searchForm.billingStatus !== 2
            ) {
              return h(
                "input",
                _mergeJSXProps([
                  {
                    domProps: {
                      value:
                        MARK_STATUS[
                          _this.searchForm.invoiceDetailList[index].mark
                        ],
                    },
                    on: {
                      input: ($event) => {
                        if ($event.target.composing) {
                          return;
                        }
                        _this.searchForm.invoiceDetailList[index].mark =
                          $event.target.value;
                      },
                    },
                  },
                  {
                    directives: [
                      {
                        name: "model",
                        value: _this.searchForm.invoiceDetailList[index].mark,
                      },
                    ],
                  },
                ]),
                []
              );
            } else {
              if (value) {
                return MARK_STATUS[value];
              } else if (value === "") {
                return "非零税率";
              }
            }
          },
        },
        {
          prop: "deductions",
          label: "扣除额(元)",
          width: 170,
          render: (h, value, row, index) => {
            var _this = this;
            if (
              !this.searchForm.invoiceDetailList.length ||
              this.searchForm.billingStatus !== 2
            ) {
              return h(
                "input",
                _mergeJSXProps([
                  {
                    domProps: {
                      value: this.$common.moneyFormat(
                        _this.searchForm.invoiceDetailList[index].deductions
                      ),
                    },
                    on: {
                      input: ($event) => {
                        if ($event.target.composing) {
                          return;
                        }
                        _this.searchForm.invoiceDetailList[index].deductions =
                          $event.target.value * 100;
                      },
                    },
                  },
                  {
                    directives: [
                      {
                        name: "model",
                        value:
                          _this.searchForm.invoiceDetailList[index].deductions,
                      },
                    ],
                  },
                ]),
                []
              );
            } else {
              return this.$common.moneyFormat(value);
            }
          },
        },
        {
          prop: "discountAmount",
          label: "折扣金额(元)",
          width: 170,
          render: (h, value, row, index) => {
            var _this = this;
            if (
              !this.searchForm.invoiceDetailList.length ||
              this.searchForm.billingStatus !== 2
            ) {
              return h(
                "input",
                _mergeJSXProps([
                  {
                    domProps: {
                      value: this.$common.moneyFormat(
                        _this.searchForm.invoiceDetailList[index].discountAmount
                      ),
                    },
                    on: {
                      input: ($event) => {
                        if ($event.target.composing) {
                          return;
                        }
                        _this.searchForm.invoiceDetailList[
                          index
                        ].discountAmount = $event.target.value * 100;
                      },
                    },
                  },
                  {
                    directives: [
                      {
                        name: "model",
                        value:
                          _this.searchForm.invoiceDetailList[index]
                            .discountAmount,
                      },
                    ],
                  },
                ]),
                []
              );
            } else {
              return this.$common.moneyFormat(value);
            }
          },
        },
      ];
      return columns;
    },
    currentChange(val) {
      this.handleSearchForm({ ...this.pagination, ...val });
    },
    handleInfo(row, dialogId) {
      this.row = row;
      this.$eventBus.$emit("dialog-visible", {
        visible: true,
        dialogId,
      });
    },
    handleSearchForm(orderNo) {
      // 查询
      this.$fetch("/invoice/query.json", {
        method: "post",
        data: {
          orderNo,
        },
      }).then((res) => {
        if (res.code === 0) {
          this.invoiceList = res.data.dataList;
          this.tableList = res.data.dataList[0].invoiceDetailList;
          this.searchForm = res.data.dataList[0];
          if (this.searchForm.invoiceType === "1") {
            this.getPaymentList(orderNo, this.searchForm.orderSourceFlag);
          } else if (this.searchForm.invoiceType === "2") {
            this.getRefundList(orderNo);
            this.getBillList(this.searchForm.originOrderNo);
          }
        }
      });
    },
    getPaymentList(orderNo, orderSourceFlag) {
      this.$fetch("/invoice/findPayInfo.json", {
        method: "post",
        data: {
          orderNo,
        },
      }).then((res) => {
        if (res.code === 0) {
          this.paymentList = [res.data];
          if (res.data) {
            this.paymentList[0].orderSourceFlag = orderSourceFlag;
          }
        }
      });
    },
    getRefundList(orderNo) {
      this.$fetch("/invoice/refundInfo.json", {
        method: "post",
        data: {
          orderNo,
        },
      }).then((res) => {
        if (res.code === 0) {
          this.refundList = [res.data];
        }
      });
    },
    getBillList(originOrderNo) {
      this.$fetch("/invoice/info.json", {
        method: "post",
        data: {
          originOrderNo,
        },
      }).then((res) => {
        if (res.code === 0) {
          this.billList = res.data;
        }
      });
    },
    handlePDF(url) {
      this.$router.push({ path: `/invoice/pdf/${encodeURIComponent(url)}` });
    },
    handleSubmitForm() {
      if (this.searchForm.billingStatus === 2) {
        this.$router.push({ path: "/invoice/order" });
      } else {
        for (let j = 0; j < this.searchForm.invoiceDetailList.length; j++) {
          for (const i in this.searchForm.invoiceDetailList[j]) {
            if (this.searchForm.invoiceDetailList[j][i] === "") {
              this.searchForm.invoiceDetailList[j][i] = null;
            }
          }
        }
        this.$fetch("/invoice/review.json", {
          method: "post",
          data: {
            ...this.searchForm,
          },
        }).then((res) => {
          console.log(this.searchForm.invoiceType);
          if (res.code === 0) {
            this.searchForm.invoiceType === "1"
              ? this.$router.push({ path: "/invoice/order" })
              : this.$router.push({ path: "/invoice/red" });
          }
        });
      }
    },
  },
};
</script>
<style lang="less" scoped>
.invoiceAudit {
  .el-textarea .el-input--small .el-input--suffix {
    margin-bottom: 20px;
  }
  .layout--container_main .el-table .el-table__row .cell input {
    width: 100%;
    color: #59657a;
    border: 1px solid #c1c9d7;
  }
  h3 {
    margin: 20px;
  }
}
</style>
>
