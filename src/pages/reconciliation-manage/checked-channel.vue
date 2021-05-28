<!--
 * @Description: 查看对账明细
 * @Author: wangjun
 * @Date: 2021-03-04 16:01:58
-->
<template>
  <div>
    <wy-form-table
      ref="wyTableRef"
      :url="tableUrl"
      url-method="post"
      :form-options="formOptions"
      :params-handler="paramsHandler"
      :column="column"
      layout="total, sizes, prev, pager, next, jumper"
      :page-sizes="[10, 20, 50]"
      show-pagination
      pagination-class="fix-pagination"
      border
    />
    <el-dialog
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
      width="760px"
      class="checked-dialog"
      title="对账详情"
    >
      <el-row class="row">
        <el-col :span="12">
          <div class="item">
            <label>交易日期</label> {{ dialogData.billDate || "-" }}
          </div>
          <div class="item">
            <label>原始业务单号</label> {{ dialogData.oriOrderNo || "-" }}
          </div>
          <div class="item">
            <label>支付流水号</label> {{ dialogData.paySerialNo || "-" }}
          </div>
          <div class="item">
            <label>渠道流水号</label> {{ dialogData.channelSerialNo || "-" }}
          </div>
        </el-col>
        <el-col :span="12">
          <div class="item">
            <label>交易类型</label> {{ dialogData.transactionType || "-" }}
          </div>
          <div class="item">
            <label>业务订单号</label> {{ dialogData.bizOrderNo || "-" }}
          </div>
          <div class="item">
            <label>退款流水号</label> {{ dialogData.payRefundNo || "-" }}
          </div>
        </el-col>
      </el-row>
      <p class="title">收银台信息</p>
      <el-row class="row">
        <el-col :span="12">
          <div class="item">
            <label>机构编号</label> {{ dialogData.institutionId || "-" }}
          </div>
          <div class="item">
            <label>业务类型</label> {{ dialogData.bizCategory || "-" }}
          </div>
        </el-col>
        <el-col :span="12">
          <div class="item">
            <label>机构名称</label> {{ dialogData.institutionName || "-" }}
          </div>
          <div class="item">
            <label>订单金额</label> {{ dialogData.totalAmount || "-" }}
          </div>
        </el-col>
      </el-row>
      <p class="title">渠道信息</p>
      <el-row class="row">
        <el-col :span="12">
          <div class="item">
            <label>对账渠道</label>
            {{ dialogData.channelName || dialogData.channelAccountName || "-" }}
          </div>
          <div class="item">
            <label>渠道金额</label> {{ dialogData.channelAmount || "-" }}
          </div>
          <div class="item">
            <label>医保统筹</label> {{ dialogData.fundOverallExpense || "-" }}
          </div>
        </el-col>
        <el-col :span="12">
          <div class="item">
            <label>渠道账号</label>
            {{ dialogData.accountNo || dialogData.channelAccountNo || "-" }}
          </div>
          <div class="item">
            <label>医保其他</label> {{ dialogData.fundOtherExpense || "-" }}
          </div>
          <div class="item">
            <label>医保个账</label> {{ dialogData.fundAccountExpense || "-" }}
          </div>
        </el-col>
      </el-row>
      <p class="title">对账信息</p>
      <el-row class="row">
        <el-col :span="12">
          <div class="item">
            <label>对账结果</label> {{ dialogData.accountResult || "-" }}
          </div>
          <div class="item">
            <label>资金风险说明</label> {{ dialogData.riskInstructions || "-" }}
          </div>
        </el-col>
        <el-col :span="12">
          <div class="item">
            <label>差错说明</label> {{ dialogData.mistakeType || "-" }}
          </div>
          <div class="item">
            <label>对账时间</label>
            {{ dialogData.gmtModified || dialogData.accountTime || "-" }}
          </div>
        </el-col>
      </el-row>
      <p class="title">调账信息</p>
      <el-row class="row">
        <el-col :span="12">
          <div class="item">
            <label>调账状态</label> {{ dialogData.adjustmentStatus || "-" }}
          </div>
          <div class="item">
            <label>处理人</label> {{ dialogData.operatorName || "-" }}
          </div>
        </el-col>
        <el-col :span="12">
          <div class="item">
            <label>处理时间</label> {{ dialogData.operatorTime || "-" }}
          </div>
        </el-col>
      </el-row>
      <el-row class="row">
        <el-col :span="24">
          <div>
            <label>差错场景：</label> {{ dialogData.mistakeScenario || "-" }}
          </div>
          <div>
            <label>调账动作：</label>
            <span style="color: #3e7fee">{{
              dialogData.adjustmentActionDesc || "-"
            }}</span>
          </div>
          <div>
            <label>调账提示：</label> {{ dialogData.adjustmentTip || "-" }}
          </div>
        </el-col>
      </el-row>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="dialogVisible = false">关 闭</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import mixin from "@/mixins/wy-table-mixin";
import moment from "moment";
import { mapGetters, mapActions } from "vuex";
import {
  fetchRecordDetails,
  fetchFundDetails,
  fetchWrongAdjustmentTip,
} from "@/services/reconciliation";

export default {
  name: "CheckedChannel",
  components: {},
  mixins: [mixin],
  data() {
    return {
      dialogVisible: false,
      tableUrl: "/checking/resultList.json",
      dialogData: {
        bizId: "",
        billDate: "",
        transactionType: "",
        oriOrderNo: "",
        bizOrderNo: "",
        paySerialNo: "",
        payRefundNo: "",
        channelSerialNo: "",
        institutionNo: "",
        institutionName: "",
        bizCategory: "",
        totalAmount: "",
        channelName: "",
        accountNo: "",
        channelAmount: "",
        fundAccountExpense: "",
        fundOverallExpense: "",
        accountResult: "",
        mistakeType: "",
        riskInstructions: "",
        gmtModified: "",
        adjustmentStatus: "",
        operatorName: "",
        operatorTime: "",
        wrongScenario: "",
        adjustmentAction: "",
        adjustmentTip: "",
      },
      formOptions: {
        inline: true,
        size: "small",
        submitBtnText: "查询",
        showResetBtn: true,
        showExportBtn: true,
        resetBtnCallback: this.resetBtnCallback,
        exportUrl: "/checking/resultlist/export.json",
        exportFileName: "对账明细",
        forms: [
          {
            prop: "dataRangeTime",
            itemType: "daterange",
            attrs: {
              width: "260",
              rangeSeparator: "～",
              clearable: true,
              startPlaceholder: "交易开始日期",
              endPlaceholder: "交易结束日期",
            },
            rules: [
              {
                required: true,
                validator: (rule, value, callback) => {
                  // 原始业务订单号、业务订单号、支付流水号、退款流水号、渠道流水号
                  const {
                    oriOrderNo,
                    bizOrderNo,
                    paySerialNo,
                    channelSerialNo,
                    payRefundNo,
                  } = this.$refs.wyTableRef.searchParams;
                  if (
                    oriOrderNo ||
                    bizOrderNo ||
                    paySerialNo ||
                    channelSerialNo ||
                    payRefundNo
                  ) {
                    callback();
                  } else {
                    if (!value || !value.length) {
                      callback(new Error("交易日期不能为空"));
                    } else if (
                      moment(value[1]).diff(moment(value[0]), "days") > 35
                    ) {
                      callback(new Error("交易日期间隔不大于35天"));
                    } else {
                      callback();
                    }
                  }
                },
              },
            ],
          },
          {
            prop: "institutionCode",
            itemType: "select",
            attrs: {
              width: "160",
              placeholder: "机构名称",
              filterable: true,
              clearable: true,
            },
            options: [],
          },
          {
            prop: "accountNo",
            itemType: "select",
            attrs: {
              width: "160",
              placeholder: "结算账号",
              filterable: true,
              clearable: true,
            },
            options: [],
          },
          {
            prop: "bizCategory",
            itemType: "select",
            attrs: {
              width: "160",
              placeholder: "业务类型",
              filterable: true,
              clearable: true,
            },
            options: [],
          },
          {
            prop: "paymentType",
            itemType: "select",
            attrs: {
              width: "120",
              placeholder: "收银台类型",
              clearable: true,
            },
            options: [
              { value: 0, label: "窗口支付" },
              { value: 1, label: "在线支付" },
            ],
          },
          {
            prop: "transactionType",
            itemType: "select",
            attrs: {
              width: "120",
              placeholder: "交易类型",
              clearable: true,
            },
            options: [
              { value: 0, label: "支付" },
              { value: 1, label: "退款" },
            ],
          },
          {
            prop: "accountResult",
            itemType: "select",
            attrs: {
              width: "120",
              placeholder: "资金对账结果",
              clearable: true,
            },
            options: [
              { value: 0, label: "已对平" },
              { value: 1, label: "未对平" },
            ],
          },
          {
            prop: "oriOrderNo",
            itemType: "input",
            attrs: {
              width: "120",
              placeholder: "原始业务单号",
              showOverflowTooltip: true,
              clearable: true,
            },
          },
          {
            prop: "bizOrderNo",
            itemType: "input",
            attrs: {
              width: "120",
              placeholder: "业务订单号",
              showOverflowTooltip: true,
              clearable: true,
            },
          },
          {
            prop: "paySerialNo",
            itemType: "input",
            attrs: {
              width: "120",
              placeholder: "支付流水号",
              showOverflowTooltip: true,
              clearable: true,
            },
          },
          {
            prop: "payRefundNo",
            itemType: "input",
            attrs: {
              width: "120",
              placeholder: "退款流水号",
              showOverflowTooltip: true,
              clearable: true,
            },
          },
          {
            prop: "channelSerialNo",
            itemType: "input",
            attrs: {
              width: "120",
              placeholder: "渠道流水号",
              showOverflowTooltip: true,
              clearable: true,
            },
          },
        ],
      },
      column: [
        { label: "序号", type: "index", index: this.indexMethod, width: 55 },
        { prop: "billDate", label: "交易日期", width: 120 },
        {
          prop: "institutionName",
          label: "机构名称",
          width: 140,
          showOverflowTooltip: true,
        },
        {
          prop: "bizCategory",
          label: "业务名称",
          width: 120,
          showOverflowTooltip: true,
        },
        {
          prop: "channelName",
          label: "结算渠道",
          width: 130,
          showOverflowTooltip: true,
        },
        {
          prop: "accountNo",
          label: "结算账号",
          width: 130,
          showOverflowTooltip: true,
        },
        {
          prop: "paymentType",
          label: "收银台类型",
          minWidth: 120,
          showOverflowTooltip: true,
        },
        {
          prop: "transactionType",
          label: "交易类型",
          width: 130,
          showOverflowTooltip: true,
        },
        {
          prop: "oriOrderNo",
          label: "原始业务订单号",
          minWidth: 130,
          showOverflowTooltip: true,
        },
        {
          prop: "bizOrderNo",
          label: "业务订单号",
          width: 120,
          showOverflowTooltip: true,
        },
        {
          prop: "paySerialNo",
          label: "支付流水号",
          width: 120,
          showOverflowTooltip: true,
        },
        {
          prop: "payRefundNo",
          label: "退款流水号",
          width: 120,
          showOverflowTooltip: true,
        },
        {
          prop: "channelSerialNo",
          label: "渠道流水号",
          width: 120,
          showOverflowTooltip: true,
        },
        {
          prop: "gpayAmount",
          label: "收银台金额",
          width: 100,
          showOverflowTooltip: true,
        },
        {
          prop: "channelAmount",
          label: "渠道总金额",
          width: 120,
          showOverflowTooltip: true,
        },
        {
          prop: "accountResult",
          label: "资金对账结果",
          width: 120,
          showOverflowTooltip: true,
          render: (h, scope) => {
            const type = {
              0: "已对平",
              1: "未对平",
            };
            return <span>{type[scope.row.accountResult] || "-"}</span>;
          },
        },
        {
          prop: "mistakeType",
          label: "差错类型",
          width: 120,
          showOverflowTooltip: true,
        },
        {
          prop: "gmtCreated",
          label: "操作",
          width: 90,
          showOverflowTooltip: true,
          render: (h, scope) => {
            return (
              <span
                style={{ cursor: "pointer", color: "#3E7FEE" }}
                onClick={(e) => this.handleChecked(scope.row, e)}
              >
                查看
              </span>
            );
          },
        },
      ],
    };
  },
  computed: {
    ...mapGetters({
      bizCategory: "bizCategory",
      allInstitution: "allInstitution",
      checkingAccountList: "checkingAccountList",
    }),
  },
  // 迁移过来后删除机构号
  //   watch: {
  //     '$store.state.institutionCode' (val) {
  //       this.$refs.wyTableRef.setParam('institutionCode', val);
  //       this.$refs.wyTableRef.searchHandler(true, true);
  //     }
  //   },
  created() {
    const { from } = this.$route.query;
    if (from === "statement") {
      this.tableUrl = "/checking/payreport/list";
      this.formOptions = Object.assign({}, this.formOptions, {
        exportFileName: "资金对账报表明细",
        exportUrl: "/checking/payreportdetail/export",
      });
      this.column.splice(
        12,
        0,
        {
          prop: "totalAmount",
          label: "订单金额",
          width: 120,
          showOverflowTooltip: true,
        },
        {
          prop: "fundSelfPaid",
          label: "个人自费",
          width: 120,
          showOverflowTooltip: true,
        },
        {
          prop: "fundAccountExpense",
          label: "医保个账",
          width: 120,
          showOverflowTooltip: true,
        },
        {
          prop: "fundOverallExpense",
          label: "医保统筹",
          width: 120,
          showOverflowTooltip: true,
        }
      );
    }
  },
  async mounted() {
    const {
      billDateStart = "",
      billDateEnd = "",
      accountNo = "",
      institutionName = "",
      paymentType = null,
    } = this.$route.query;
    this.$refs.wyTableRef.setParam("dataRangeTime", [
      billDateStart,
      billDateEnd,
    ]);
    await this.getBizCategory().catch(() => {});
    this.formOptions.forms[3].options = this.bizCategory;
    await this.getAllInstitution().catch(() => {});
    this.formOptions.forms[1].options = this.allInstitution;
    this.$refs.wyTableRef.setParam("accountNo", accountNo);
    const institutionArr =
      this.allInstitution.find((element) => {
        return element.institutionName === institutionName;
      }) || {};
    this.$refs.wyTableRef.setParam(
      "institutionCode",
      institutionArr.institutionCode
    );
    this.$refs.wyTableRef.setParam("paymentType", +paymentType);
    this.$refs.wyTableRef.searchHandler();
    await this.getCheckingAccountList().catch(() => {});
    this.formOptions.forms[2].options = this.checkingAccountList;
  },
  methods: {
    ...mapActions({
      getBizCategory: "getBizCategory",
      getAllInstitution: "getAllInstitution",
      getCheckingAccountList: "getCheckingAccountList",
    }),
    async handleChecked(row, e) {
      e.preventDefault();
      e.stopPropagation();
      const { from } = this.$route.query;
      let resDetail;
      if (from === "statement") {
        resDetail = await fetchFundDetails({
          bizId: String(row.bizId),
        });
      } else {
        resDetail = await fetchRecordDetails({
          bizId: String(row.bizId),
        });
      }

      if (resDetail) {
        this.dialogData = {};
        if (from === "statement") {
          resDetail.transactionType =
            resDetail.transactionType === 0 ? "支付" : "退款";
          resDetail.accountResult =
            resDetail.accountResult === 0 ? "已对平" : "未对平";
        }
        this.dialogData = Object.assign({}, this.dialogData, resDetail);
        this.dialogVisible = true;
        if (row.adjustmentStatus === 0) {
          const resTip = await fetchWrongAdjustmentTip({
            wrongRecordId: this.dialogData.wrongRecordId,
            gPayStatus: this.dialogData.gPayStatus,
          }).catch(() => {});
          if (resTip) {
            this.dialogData.mistakeScenario = resTip.mistakeScenario;
            this.dialogData.adjustmentActionDesc = resTip.adjustmentActionDesc;
            this.dialogData.adjustmentTip = resTip.adjustmentTip;
          }
        }
      }
    },
    paramsHandler(params) {
      params.isFormal = this.isFormal;
      params.billDateStart = params.dataRangeTime[0]
        ? moment(params.dataRangeTime[0]).format("YYYY-MM-DD")
        : null;
      params.billDateEnd = params.dataRangeTime[1]
        ? moment(params.dataRangeTime[1]).format("YYYY-MM-DD")
        : null;
      delete params.dataRangeTime;
      return params;
    },
    resetBtnCallback(el) {
      el.$refs.form.resetFields();
      el.params.dataRangeTime = [];

      this.$refs.wyTableRef.searchHandler(true, true);
    },
  },
};
</script>

<style lang="less">
.checked-dialog {
  .title {
    margin-top: 10px;
    font-size: 14px;
    font-weight: 700;
  }
  .row {
    padding: 8px 0;
    font-size: 14px;
    border-bottom: 1px solid #ebebeb;
    label {
      float: left;
      width: 110px;
      color: #5e6d83;
    }
    .item {
      display: flex;
      label {
        flex-basis: 110px;
      }
    }
    &:first-child {
      padding-top: 0;
    }
    &:last-child {
      padding-bottom: 0;
      border: none;
    }
  }
}
</style>
