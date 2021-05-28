<!--
 * @Description: 挂账管理
 * @Author: wangjun
 * @Date: 2021-03-08 09:49:18
-->
<template>
  <div>
    <wy-form-table
      ref="wyTableRef"
      url="/checking/stays/list.json"
      url-method="post"
      :form-options="formOptions"
      :params-handler="paramsHandler"
      :column="column"
      layout="total, sizes, prev, pager, next, jumper"
      :page-sizes="[10, 20, 50]"
      show-pagination
      :data-handler="resultHandler"
      pagination-class="fix-pagination"
      border
    />
    <el-dialog
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
      class="checked-dialog"
      width="760px"
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
            <label>对账渠道</label> {{ dialogData.channelName || "-" }}
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
            <label>渠道账号</label> {{ dialogData.accountNo || "-" }}
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
            <label>对账时间</label> {{ dialogData.gmtModified || "-" }}
          </div>
        </el-col>
      </el-row>

      <template v-if="changeDialogBtn">
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
        <p class="title">处理信息</p>
        <el-row class="row">
          <el-col :span="12">
            <div class="item">
              <label>处理状态</label> {{ dialogData.staysStatus || "-" }}
            </div>
            <div class="item">
              <label>处理人</label> {{ dialogData.staysOperatorName || "-" }}
            </div>
          </el-col>
          <el-col :span="12">
            <div class="item">
              <label>处理时间</label> {{ dialogData.staysOperatorTime || "-" }}
            </div>
          </el-col>
          <el-col :span="12">
            <div class="item">
              <label>备注：</label> {{ dialogData.remark || "-" }}
            </div>
          </el-col>
        </el-row>
      </template>
      <template v-else>
        <p class="title">处理信息</p>
        <div style="font-size: 14px; padding: 8px 0">备注：</div>
        <el-input
          ref="textarea"
          v-model="textarea"
          type="textarea"
          placeholder="请输入内容"
          maxlength="50"
          show-word-limit
        />
        <el-checkbox
          v-model="dialogChecked"
          size="micro"
          :disabled="disposeDisabled"
        >
          处理状态变为已完成
        </el-checkbox>
      </template>
      <span slot="footer" class="dialog-footer">
        <el-button
          v-if="changeDialogBtn"
          size="small"
          type="primary"
          @click="handleClickDispose"
          >处理</el-button
        >
        <el-button v-else size="small" type="primary" @click="handleClickSave"
          >保存</el-button
        >
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
  fetchStaysOperate,
} from "@/services/reconciliation";

export default {
  name: "CreditManage",
  components: {},
  mixins: [mixin],
  data() {
    return {
      dialogVisible: false,
      changeDialogBtn: true,
      dialogChecked: false,
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
      textarea: "",
      formOptions: {
        inline: true,
        size: "small",
        submitBtnText: "查询",
        showResetBtn: true,
        showExportBtn: true,
        resetBtnCallback: this.resetBtnCallback,
        exportUrl: "/checking/stays/exportlist.json",
        exportFileName: "挂账列表",
        forms: [
          {
            prop: "dataRangeTime",
            itemType: "daterange",
            attrs: {
              width: "270",
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
            prop: "institutionId",
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
            prop: "channelAccountNo",
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
            prop: "transactionType",
            itemType: "select",
            attrs: {
              width: "120",
              placeholder: "交易类型",
              filterable: true,
              clearable: true,
            },
            options: [
              { value: 0, label: "支付" },
              { value: 1, label: "退款" },
            ],
          },
          {
            prop: "operateStatus",
            itemType: "select",
            attrs: {
              width: "120",
              placeholder: "处理状态",
              filterable: true,
              clearable: true,
            },
            options: [
              { value: 0, label: "待处理" },
              { value: 1, label: "已完成" },
            ],
          },
          {
            prop: "oriOrderNo",
            itemType: "input",
            attrs: {
              width: "120",
              placeholder: "原始业务单号",
              showOverflowTooltip: true,
              filterable: true,
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
              filterable: true,
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
              filterable: true,
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
              filterable: true,
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
              filterable: true,
              clearable: true,
            },
          },
        ],
      },
      column: [
        { label: "序号", type: "index", index: this.indexMethod, width: 55 },
        { prop: "billDate", label: "交易日期", minWidth: 120 },
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
          prop: "channelAccountName",
          label: "结算渠道",
          width: 130,
          showOverflowTooltip: true,
        },
        {
          prop: "channelAccountNo",
          label: "结算账号",
          width: 130,
          showOverflowTooltip: true,
        },
        {
          prop: "paymentType",
          label: "收银台类型",
          minWidth: 120,
          showOverflowTooltip: true,
          render: (h, scope) => {
            const type = {
              1: "在线支付",
              2: "窗口支付",
            };
            return <span>{type[scope.row.paymentType] || "-"}</span>;
          },
        },
        {
          prop: "transactionType",
          label: "交易类型",
          width: 130,
          showOverflowTooltip: true,
          render: (h, scope) => {
            const type = {
              0: "支付",
              1: "退款",
            };
            return <span>{type[scope.row.transactionType] || "-"}</span>;
          },
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
          prop: "mistakeType",
          label: "差错说明",
          width: 120,
          showOverflowTooltip: true,
          render: (h, scope) => {
            const type = {
              0: "无",
              1: "渠道多",
              2: "收银台多",
              3: "金额差异",
            };
            return <span>{type[scope.row.mistakeType] || "-"}</span>;
          },
        },
        {
          prop: "riskInstructions",
          label: "资金风险说明",
          width: 120,
          showOverflowTooltip: true,
        },
        {
          prop: "operateStatus",
          label: "处理状态",
          width: 120,
          showOverflowTooltip: true,
          render: (h, scope) => {
            const type = {
              0: "未处理",
              1: "已完成",
            };
            return <span>{type[scope.row.operateStatus] || "-"}</span>;
          },
        },
        {
          prop: "operatorName",
          label: "处理人",
          width: 90,
          showOverflowTooltip: true,
        },
        {
          prop: "operatorTime",
          label: "处理时间",
          width: 170,
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
  //       this.$refs.wyTableRef.setParam('institutionId', val);
  //       this.$refs.wyTableRef.searchHandler(true, true);
  //     }
  //   },
  created() {},
  async mounted() {
    this.$refs.wyTableRef.setParam("dataRangeTime", [
      moment().subtract(7, "days"),
      moment(),
    ]);
    await this.getBizCategory();
    this.formOptions.forms[3].options = this.bizCategory;
    await this.getAllInstitution();
    this.formOptions.forms[1].options = this.allInstitution;
    this.$refs.wyTableRef.setParam(
      "institutionId",
      sessionStorage.getItem("institutionCode")
    );
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
    handleClickDispose() {
      this.changeDialogBtn = false;
      this.textarea = this.dialogData.remark ? this.dialogData.remark : "";
      this.$nextTick(() => {
        this.$refs.textarea.focus();
      });
    },
    async handleClickSave() {
      const res = await fetchStaysOperate({
        staysRecordId: this.dialogData.staysRecordId,
        remark: this.textarea,
        operateStatus: this.dialogChecked ? 1 : 0,
      });
      if (res) {
        this.$refs.wyTableRef.searchHandler(true, true);
        this.dialogVisible = false;
      }
    },
    async handleChecked(row, e) {
      e.preventDefault();
      e.stopPropagation();
      this.changeDialogBtn = true;
      this.dialogChecked = true;
      this.disposeDisabled = row.operateStatus === 1;
      const resDetail = await fetchRecordDetails({
        bizId: String(row.checkingDetailId),
      }).catch(() => {});
      if (resDetail) {
        this.dialogData = {};
        this.dialogData = Object.assign({}, this.dialogData, resDetail);
        this.dialogVisible = true;
      }
    },
    paramsHandler(params) {
      params.billDateStart = params.dataRangeTime
        ? moment(params.dataRangeTime[0]).format("YYYY-MM-DD")
        : null;
      params.billDateEnd = params.dataRangeTime
        ? moment(params.dataRangeTime[1]).format("YYYY-MM-DD")
        : null;
      delete params.dataRangeTime;
      return params;
    },
    resultHandler(result) {
      result.gpayAmount = result.gpayAmount
        ? (+result.gpayAmount / 100).toFixed(2)
        : "";
      result.channelAmount = result.channelAmount
        ? (+result.channelAmount / 100).toFixed(2)
        : "";
      return result;
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
