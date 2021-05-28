<!--
 * @Author: zhanggan
 * @Date: 2020-10-20 18:14:01
 * @LastEditors: zhanggan
 * @Description: 对账管理 - 资金对账
 * @FilePath: /gpay-ops-static/src/pages/checkAccount/accountStatement/fundList.vue
-->
<template>
  <div>
    <el-form
      ref="Listform"
      label-width="120px"
      :inline="true"
      :model="formInline"
    >
      <el-form-item prop="datePicker">
        <el-date-picker
          v-model="datePicker"
          type="daterange"
          start-placeholder="账单开始日期"
          end-placeholder="账单结束日期"
          format="yyyy-MM-dd"
          value-format="yyyy-MM-dd"
          :picker-options="pickerOptions"
        />
      </el-form-item>
      <el-form-item prop="partnerNo">
        <el-select
          v-model="formInline.partnerNo"
          filterable
          remote
          clearable
          filter-keep
          always-search
          :remote-method="handlePartnerSearch"
          default-first-option
          :loading="partnerLoading"
          placeholder="商户名称"
        >
          <el-option
            v-for="item in partnerList"
            :key="item.code"
            :label="item.name"
            :value="item.code"
          />
        </el-select>
      </el-form-item>
      <el-form-item prop="bizCategory">
        <el-select
          v-model="formInline.bizCategory"
          clearable
          placeholder="业务类型"
        >
          <el-option
            v-for="item in bizCategory"
            :key="item.bizCategoryCode"
            :label="item.bizCategoryValue"
            :value="item.bizCategoryCode"
          />
        </el-select>
      </el-form-item>
      <el-form-item prop="transactionType">
        <el-select
          v-model="formInline.transactionType"
          clearable
          placeholder="交易类型"
        >
          <el-option
            v-for="(value, key) in TRANSACTION_TYPE_LIST"
            :key="key"
            :label="value"
            :value="key"
          />
        </el-select>
      </el-form-item>
      <el-form-item prop="orderTimePicker">
        <el-date-picker
          v-model="orderTimePicker"
          type="daterange"
          start-placeholder="交易开始日期"
          end-placeholder="交易结束日期"
          format="yyyy-MM-dd"
          value-format="yyyy-MM-dd"
        />
      </el-form-item>
      <el-form-item prop="accountChannel">
        <el-select
          v-model="formInline.accountChannel"
          clearable
          placeholder="支付渠道"
        >
          <el-option
            v-for="(value, key) in ACCOUNT_CHANNEL_LIST"
            :key="key"
            :label="value"
            :value="key"
          />
        </el-select>
      </el-form-item>
      <el-form-item prop="accountResult">
        <el-select
          v-model="formInline.accountResult"
          clearable
          placeholder="对账结果"
        >
          <el-option
            v-for="(value, key) in ACCOUNT_RESULT_STATUS"
            :key="key"
            :label="value"
            :value="key"
          />
        </el-select>
      </el-form-item>
      <el-form-item prop="channelAccountNo">
        <el-input
          v-model="formInline.channelAccountNo"
          placeholder="收款账号"
          clearable
        />
      </el-form-item>
      <el-form-item prop="paySerialNo">
        <el-input
          v-model="formInline.paySerialNo"
          placeholder="支付流水号"
          clearable
        />
      </el-form-item>
      <el-form-item prop="channelSerialNo">
        <el-input
          v-model="formInline.channelSerialNo"
          placeholder="渠道流水号"
          clearable
        />
      </el-form-item>
      <el-form-item prop="bizOrderNo">
        <el-input
          v-model="formInline.bizOrderNo"
          placeholder="业务订单号"
          clearable
        />
      </el-form-item>
      <el-form-item prop="oriOrderNo">
        <el-input
          v-model="formInline.oriOrderNo"
          placeholder="原始业务订单号"
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
        <v-form-reset :form-ref="$refs['Listform']" />
        <el-button type="primary opcity" @click="handleExportVisible">
          导出
        </el-button>
      </el-form-item>
      <el-form-item>
        <el-link
          type="primary"
          @click="$router.push('/checkaccount/fundlist/export')"
        >
          查看导出任务记录&nbsp;&gt;
        </el-link>
      </el-form-item>
    </el-form>
    <div class="total-btn">
      <el-button type="primary" @click="handleTotal(true)">
        查看数据统计
      </el-button>
    </div>
    <v-table
      v-loading="loading"
      type="index"
      align="center"
      :data="tableData"
      :columns="columns"
      :pagination="pagination"
      @currentChange="currentChange"
    />
    <el-dialog
      v-model="dialogForm"
      title="对账详情"
      :responsive="false"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :show-close="false"
      :visible.sync="dialogFormVisible"
    >
      <div class="fund-detail-dialog">
        <div class="detail-panel">
          <div class="detail-section">
            <table>
              <tr>
                <td>账单日期</td>
                <td>{{ dialogData.billDate }}</td>
                <td />
                <td>交易类型</td>
                <td>{{ TRANSACTION_TYPE_LIST[dialogData.transactionType] }}</td>
              </tr>
              <tr>
                <td>交易流水号</td>
                <td>{{ dialogData.paySerialNo }}</td>
                <td />
                <td />
                <td />
              </tr>
              <tr>
                <td>业务订单号</td>
                <td>{{ dialogData.bizOrderNo }}</td>
                <td />
                <td />
                <td />
              </tr>
              <tr>
                <td>渠道流水号</td>
                <td>
                  {{ dialogData.channelSerialNo }}
                </td>
                <td />
                <td />
                <td />
              </tr>
            </table>
          </div>
          <div class="detail-section">
            <div class="detail-title">收银台信息</div>
            <table>
              <tr>
                <td>商户编号</td>
                <td>
                  {{ dialogData.partnerNo }}
                </td>
                <td />
                <td>商户名称</td>
                <td>
                  {{ dialogData.partnerName }}
                </td>
              </tr>
              <tr>
                <td>业务类型</td>
                <td>
                  {{
                    $common.tableFormat(
                      bizCategory,
                      dialogData.bizCategory,
                      "bizCategoryCode",
                      "bizCategoryValue"
                    )
                  }}
                </td>
                <td />
                <td>订单金额</td>
                <td>
                  {{ $common.moneyFormat(dialogData.transactionAmount) }}
                </td>
              </tr>
            </table>
          </div>
          <div class="detail-section">
            <div class="detail-title">支付渠道信息</div>
            <table>
              <tr>
                <td>支付渠道</td>
                <td>
                  {{ ACCOUNT_CHANNEL_LIST[dialogData.accountChannel] }}
                </td>
                <td />
                <td>收款账号</td>
                <td>
                  {{ dialogData.channelAccountNo }}
                </td>
              </tr>
              <tr>
                <td>渠道金额</td>
                <td>{{ $common.moneyFormat(dialogData.channelAmount) }}</td>
                <td />
                <td>红包金额</td>
                <td>{{ $common.moneyFormat(dialogData.activityAmount) }}</td>
              </tr>
            </table>
          </div>
          <div class="detail-section">
            <div class="detail-title">对账信息</div>
            <table>
              <tr>
                <td>对账日期</td>
                <td>
                  {{ dialogData.accountTime }}
                </td>
                <td />
                <td>对账结果</td>
                <td>
                  {{ ACCOUNT_RESULT_STATUS[dialogData.accountResult] }}
                </td>
              </tr>
              <tr>
                <td>说明</td>
                <td>
                  {{ dialogData.resultInstructions }}
                </td>
                <td />
                <td />
                <td />
              </tr>
            </table>
          </div>
          <div class="detail-section">
            <table>
              <tr>
                <td>操作人</td>
                <td>
                  {{ dialogData.opUserName }}
                </td>
                <td />
                <td>操作时间</td>
                <td>
                  {{ dialogData.opTime }}
                </td>
              </tr>
            </table>
          </div>
        </div>
        <div v-if="dialogData.accountResult === 9" class="detail-form">
          <el-form>
            <el-form-item>
              <el-select
                v-model="dialogForm.accountResult"
                placeholder="对账结果"
              >
                <el-option
                  v-for="(value, key) in ACCOUNT_RESULT_STATUS"
                  :key="key"
                  :label="value"
                  :value="+key"
                />
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-input
                v-model="dialogForm.resultInstructions"
                type="textarea"
                :rows="4"
                placeholder="说明"
                :maxlength="48"
                show-word-limit
              />
            </el-form-item>
          </el-form>
        </div>
      </div>
      <div v-if="dialogData.accountResult === 9" slot="footer">
        <el-button type="primary" @click="handleDialogSubmit"> 确定 </el-button>
        <el-button @click="handleDialogCancel"> 取消 </el-button>
      </div>
      <div v-else slot="footer">
        <el-button plain @click="handleDialogCancel"> 返回 </el-button>
      </div>
    </el-dialog>
    <el-dialog title="数据统计" :visible.sync="totalVisible">
      <div v-loading="statisticsLoading" class="text-area">
        <div class="text-left-area">
          <div class="flex-1">收银台侧</div>
          <div class="flex-2">
            <p>
              支付总笔数 : {{ $common.setCount(fundStatistics.gpayPaySum) }}
            </p>
            <p>
              退款总笔数 : {{ $common.setCount(fundStatistics.gpayRefundSum) }}
            </p>
          </div>
          <div class="flex-2">
            <p>
              支付总金额 : {{ $common.setMoney(fundStatistics.gpayPayAmount) }}
            </p>
            <p>
              退款总金额 :
              {{ $common.setMoney(fundStatistics.gpayRefundAmount) }}
            </p>
          </div>
        </div>
        <div class="text-right-area">
          <div class="flex-1">渠道侧</div>
          <div class="flex-2">
            <p>
              支付总笔数 : {{ $common.setCount(fundStatistics.channelPaySum) }}
            </p>
            <p>
              退款总笔数 ：{{
                $common.setCount(fundStatistics.channelRefundSum)
              }}
            </p>
          </div>
          <div class="flex-2">
            <p>
              支付总金额 ：{{
                $common.setMoney(fundStatistics.channelPayAmount)
              }}
            </p>
            <p>
              退款总金额 ：{{
                $common.setMoney(fundStatistics.channelRefundAmount)
              }}
            </p>
          </div>
        </div>
      </div>
      <div slot="footer">
        <el-button plain @click="handleTotal(false)"> 返回 </el-button>
      </div>
    </el-dialog>
    <el-dialog
      title="账单导出任务"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :show-close="false"
      :visible.sync="exportVisible"
    >
      <div class="fund-export-dialog">
        <div class="title">
          由于您导出的对账单交易数量过大，系统需要异步导出。完成后可通过【查看任务记录】下载对账单文件。
        </div>
        <el-form v-model="exportForm" label-width="90px">
          <el-form-item prop="title" label="标题：">
            <el-input
              v-model="exportForm.title"
              clearable
              :maxlength="48"
              show-word-limit
            />
          </el-form-item>
          <el-form-item prop="filters" label="筛选条件：">
            <el-input
              v-model="exportForm.filters"
              type="textarea"
              resize="none"
              :rows="5"
              disabled
            />
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer">
        <el-bunch>
          <el-button type="primary" @click="handleExportSubmit">
            确定
          </el-button>
          <el-button plain @click="handleExportCancel"> 取消 </el-button>
        </el-bunch>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import tableFormMixin from "@/mixins/tableFormMixin";
import prohibitMixin from "@/mixins/prohibitMixin";
import {
  ACCOUNT_CHANNEL_LIST,
  TRANSACTION_TYPE_LIST,
  ACCOUNT_RESULT_STATUS,
} from "@/utils/constants";
// import dialogFormMixin from '@/mixins/dialogFormMixin';
// import payRecordDetail from './detail';
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";

export default {
  components: {
    // payRecordDetail
  },
  mixins: [tableFormMixin, prohibitMixin],
  data() {
    this.columns = this.getColumns();
    this.dialogColumns = this.getDialogColumns();
    this.queryUrl = "/payAccount/list.json";
    this.exportUrl = "/payAccount/resultExport.json";
    this.ACCOUNT_CHANNEL_LIST = ACCOUNT_CHANNEL_LIST;
    this.TRANSACTION_TYPE_LIST = TRANSACTION_TYPE_LIST;
    this.ACCOUNT_RESULT_STATUS = ACCOUNT_RESULT_STATUS;
    this.submitFormArr = [
      {
        url: "/payAccount/updateInstructions.json/creat.json",
        message: "新增备注",
      },
      {
        url: "/payAccount/updateInstructions.json",
        message: "修改备注",
      },
    ];
    // this.rules = {
    //   parentCode: [
    //     { required: true, message: '请选择父字典', trigger: 'change' }
    //   ]
    // };
    return {
      pickerOptions: {
        disabledDate: (time) => {
          const yestoday = this.dayjs(new Date() - 3600 * 1000 * 24 * 2).format(
            "YYYY-MM-DD"
          );
          return time.getTime() >= new Date(yestoday).getTime();
        },
      },
      datePicker: [
        this.dayjs(new Date() - 3600 * 1000 * 24 * 2).format("YYYY-MM-DD"),
        this.dayjs(new Date() - 3600 * 1000 * 24 * 2).format("YYYY-MM-DD"),
      ],
      orderTimePicker: ["", ""],

      formInline: {
        accountTimeStart: null, // "对账时间起点",
        accountTimeEnd: null, // "对账时间终点",
        orderTimeStart: null, // "交易时间起点",
        orderTimeEnd: null, // "交易时间终点"
        bizOrderNo: null, // "业务订单号",
        accountChannel: null, // "对账渠道：0-支付宝；1-微信 2-健康账户",
        transactionType: null, // "交易类型：0-支付；1-退款",
        bizCategory: null, // "业务类型",
        accountResult: null, // "对账结果：0-对平；9-未对平",
        channelSerialNo: null, // "渠道流水号",
        partnerNo: null, // "机构号",
        channelAccountNo: null, // "渠道账号",
        paySerialNo: null, // 支付流水号
        oriOrderNo: null,
        // pageSize: null,//"每页大小",
        // pageIndex: null,//"当前页码",
      },
      // table-dialog-texarea编辑框
      // isConfirming: true,
      isEditDisabled: false,
      resultInstructions: "",
      // 修改
      dialogFormVisible: false,
      dialogForm: {
        id: null,
        resultInstructions: null,
        accountResult: null,
      },
      dialogData: {},
      totalVisible: false, // 统计数据是否显示
      exportForm: {
        title: null,
        filters: null,
      },
      exportVisible: false,
      partnerLoading: false,
      statisticsLoading: false,
    };
  },
  computed: {
    ...mapGetters({
      bizCategory: "bizCategory",
      partnerList: "partnerList",
      fundStatistics: "fundStatistics",
    }),
  },
  watch: {
    datePicker(newVal) {
      this.currentDatePickerChange(newVal, "accountTime");
    },
    orderTimePicker(newVal) {
      this.currentDatePickerChange(newVal, "orderTime");
    },
  },
  created() {
    this.$common.judgeState({
      bizCategory: "getBizCategory",
    });
  },
  mounted() {
    this.currentDatePickerChange(this.datePicker, "accountTime");
    this.currentDatePickerChange(this.orderTimePicker, "orderTime");
  },
  methods: {
    ...mapActions({
      getPartnerList: "getPartnerList",
      getFundStatistics: "getFundStatistics",
      postExportDelay: "postExportDelay",
    }),
    getColumns() {
      return [
        // { prop: 'id', label: 'id' },
        {
          prop: "billDate",
          label: "账单日期",
          width: "180",
        },
        { prop: "partnerName", label: "商户名称", width: "220" },
        // { prop: 'partnerNo', label: '商户编号', width: '220' },
        {
          prop: "bizCategory",
          label: "业务类型",
          width: "200",
          render: (h, value, row) => {
            return this.$common.tableFormat(
              this.bizCategory,
              value,
              "bizCategoryCode",
              "bizCategoryValue"
            );
          },
        },
        {
          prop: "transactionType",
          label: "交易类型",
          width: "160",
          render: (h, value, row) => {
            return TRANSACTION_TYPE_LIST[value];
          },
        },
        {
          prop: "transactionAmount",
          label: "订单金额",
          width: "220",
          render: (h, value, row) => {
            return this.$common.moneyFormat(value);
          },
        },
        {
          prop: "accountChannel",
          label: "支付渠道",
          width: "160",
          render: (h, value, row) => {
            return ACCOUNT_CHANNEL_LIST[value];
          },
        },
        { prop: "channelAccountNo", label: "收款账号", width: "250" },

        { prop: "orderTime", label: "交易日期", width: "220" },
        {
          prop: "channelAmount",
          label: "渠道金额",
          width: "220",
          render: (h, value, row) => {
            return this.$common.moneyFormat(value);
          },
        },
        {
          prop: "activityAmount",
          label: "红包金额",
          width: "220",
          render: (h, value, row) => {
            return this.$common.moneyFormat(value);
          },
        },
        { prop: "oriOrderNo", label: "原始业务订单号", width: "220" },
        { prop: "bizOrderNo", label: "业务订单号", width: "220" },
        { prop: "paySerialNo", label: "支付流水号", width: "220" },

        { prop: "channelSerialNo", label: "渠道流水号", width: "220" },
        {
          prop: "accountTime",
          label: "对账日期",
          width: "180",
        },
        {
          prop: "accountResult",
          label: "对账结果",
          width: "220",
          render: (h, value, row) => {
            return ACCOUNT_RESULT_STATUS[value];
          },
        },

        { prop: "resultInstructions", label: "说明", width: "220" },
        // { prop: 'opUserName', label: '操作人', width: '220' },
        // { prop: 'opTime', label: '操作时间', width: '220' },
        {
          prop: "accountResult",
          label: "操作",
          fixed: "right",
          render: (h, value, row) => {
            const btns = [];
            if (value === 0) {
              btns.push(
                <el-link
                  type="primary"
                  onClick={() => this.showDialog(value, row)}
                >
                  查看
                </el-link>
              );
            }
            if (value === 9) {
              btns.push(
                <el-link
                  type="primary"
                  onClick={() => this.showDialog(value, row)}
                >
                  处理
                </el-link>
              );
            }
            return <el-bunch>{btns}</el-bunch>;
          },
        },
      ];
    },
    getDialogColumns() {
      return [
        {
          prop: "accountChannel",
          label: "对账渠道",

          render: (h, value, row) => {
            return ACCOUNT_CHANNEL_LIST[value];
          },
        },
        {
          prop: "channelAccountNo",
          label: "收款账号",
          width: "150",
        },
        {
          prop: "transactionType",
          label: "交易类型",
          render: (h, value, row) => {
            return TRANSACTION_TYPE_LIST[value];
          },
        },
        { prop: "paySerialNo", label: "支付流水号", width: "150" },

        {
          prop: "transactionAmount",
          label: "支付金额",
          render: (h, value, row) => {
            return this.$common.moneyFormat(value);
          },
        },
        { prop: "channelSerialNo", label: "渠道流水号", width: "150" },
        {
          prop: "channelAmount",
          label: "渠道金额",
          render: (h, value, row) => {
            return this.$common.moneyFormat(value);
          },
        },
        {
          prop: "orderTime",
          label: "交易时间",
        },
      ];
    },
    currentDatePickerChange(newVal, stringName) {
      const datePicker = newVal || null;
      const startDate = datePicker ? datePicker[0] : null;
      const endDate = datePicker ? datePicker[1] : null;

      this.formInline[stringName + "Start"] = startDate;
      this.formInline[stringName + "End"] = endDate;

      this.maxDateRange(
        this.formInline[stringName + "Start"],
        this.formInline[stringName + "End"],
        31
      );
    },
    showDialog(value, row) {
      this.dialogData = { ...row };
      this.dialogForm = {
        id: row.id,
        resultInstructions: row.resultInstructions,
        accountResult: row.accountResult,
      };
      this.dialogFormVisible = true;
    },
    handleDialogSubmit() {
      if (this.isEditDisabled) {
        return !0;
      }
      if (!this.dialogForm.resultInstructions) {
        this.$message({
          type: "error",
          message: "请输入备注",
        });
        return !0;
      }
      this.isEditDisabled = true;
      this.$fetch("/payAccount/updateInstructions.json", {
        method: "post",
        data: { ...this.dialogForm },
      }).then((res) => {
        this.isEditDisabled = false;
        if (res.code === 0) {
          this.dialogFormVisible = false;
          this.$message({
            type: "success",
            message: "操作成功！",
          });
          this.$refs.formSubmit.handleSearch();
          this.handleResetForm();
        }
      });
    },
    handleDialogCancel() {
      this.dialogFormVisible = false;
      this.handleResetForm();
    },
    handleResetForm() {
      this.dialogForm = {
        id: null,
        resultInstructions: null,
      };
    },
    maxDateRange(start, end, maxDay = 30) {
      if (!start || !end) {
        return !0;
      }
      this.dayjs.extend(isSameOrAfter);
      const dayjs = this.dayjs;
      const startDate = dayjs(start);
      const endDate = dayjs(end)
        .add(23, "hour")
        .add(59, "minute")
        .add(59, "second");
      const latestDate = startDate.add(maxDay, "day"); // 计算范围内最迟日期
      let flag = true; // 是否在范围内
      if (!dayjs(latestDate).isSameOrAfter(endDate)) {
        // 选中日期若不在范围
        this.$message({
          type: "error",
          message: `时间范围最大支持仅${maxDay}天`,
        });
        flag = false;
      }
      return flag;
    },
    handleTotal(val) {
      this.totalVisible = val;
      this.statisticsLoading = true;
      if (!val) {
        return;
      }
      this.getFundStatistics(this.formInline).finally(() => {
        this.statisticsLoading = false;
      });
    },
    getExportData() {
      const model = this.formInline;
      const partner = this.partnerList.find(
        (item) => item.code === model.partnerNo
      );
      return [
        {
          label: "账单日期",
          value: `${model.accountTimeStart} ～ ${model.accountTimeEnd}`,
          valid: !!(model.accountTimeStart || model.accountTimeEnd),
        },
        {
          label: "商户名称",
          value: partner && partner.name,
          valid: !!partner,
        },
        {
          label: "业务类型",
          value: this.$common.tableFormat(
            this.bizCategory,
            model.bizCategory,
            "bizCategoryCode",
            "bizCategoryValue"
          ),
        },
        {
          label: "交易类型",
          value: TRANSACTION_TYPE_LIST[model.transactionType],
        },
        {
          label: "交易日期",
          value: `${model.orderTimeStart} ～ ${model.orderTimeEnd}`,
          valid: !!(model.orderTimeStart || model.orderTimeEnd),
        },
        {
          label: "支付渠道",
          value: ACCOUNT_CHANNEL_LIST[model.accountChannel],
        },
        {
          label: "对账结果",
          value: ACCOUNT_RESULT_STATUS[model.accountResult],
        },
        {
          label: "支付流水号",
          value: model.paySerialNo,
        },
        {
          label: "渠道流水号",
          value: model.channelSerialNo,
        },
        {
          label: "业务订单号",
          value: model.bizOrderNo,
        },
      ];
    },
    setExportData() {
      const userName = localStorage.getItem("userName");
      const dateTime = this.dayjs(Date.now()).format("YYYYMMDD_HHmmss");
      this.exportForm.title = `资金对账_${userName}_${dateTime}`;

      const searchMap = this.getExportData();
      const searchText = [];
      searchMap.forEach((search) => {
        const { label, value, valid } = search;
        const isBoolean = typeof valid === "boolean";
        const isInsert = isBoolean ? valid && value : value;
        if (isInsert) {
          searchText.push(`${label}：${value}`);
        }
      });
      this.exportForm.filters = searchText.join("\n");
    },
    handleExportVisible() {
      // v-download="{fetchUrl: '/payAccount/resultExport.json', dataRef: this, formRef: 'Listform', fileName: '资金对账列表'}"
      const { totalNum } = this.pagination;
      if (totalNum > 1000) {
        this.setExportData();
        this.exportVisible = true;
        return;
      }
      const myform = { ...this.formInline };
      const fileName = "资金对账列表";
      if (Object.keys(this.formInline).indexOf("billingStatus") > -1) {
        myform.billingStatus = 1;
        myform.enterpriseType = 0;
      }
      this.$fetch("/payAccount/resultExport.json", {
        data: { ...myform, ...this.pagination },
        responseType: "blob",
      }).then((blob) => {
        // 获取文件后缀
        const fileExt = blob.type && blob.type.split("/")[1];

        // 参考 https://blog.csdn.net/mobius_z/article/details/82790327
        const downloadElement = document.createElement("a");
        const href = window.URL.createObjectURL(blob);

        // 创建下载的链接
        downloadElement.href = href;

        // 下载后文件名
        downloadElement.download = `${fileName}.${fileExt || "xls"}`;
        document.body.appendChild(downloadElement);

        // 点击下载
        downloadElement.click();

        // 下载完成移除元素
        document.body.removeChild(downloadElement);
        window.URL.revokeObjectURL(href);
      });
    },
    handleExportSubmit() {
      const data = { ...this.exportForm, ...this.formInline };
      this.postExportDelay(data)
        .then((res) => {
          if (typeof res === "boolean" && res === true) {
            this.$message({
              type: "success",
              message: "提交成功",
            });
          } else {
            this.$message({
              type: "error",
              message: "提交失败",
            });
          }
        })
        .finally(() => {
          this.exportVisible = false;
        });
    },
    handleExportCancel() {
      this.exportVisible = false;
    },
    handlePartnerSearch(val) {
      this.partnerLoading = true;
      this.getPartnerList({
        name: val,
      }).finally(() => {
        this.partnerLoading = false;
      });
    },
  },
};
</script>
<style lang="less" scoped>
@import "~@weiyi/vit-variable/index.less";
.text-area {
  display: flex;
  flex-direction: column;
  margin: -4px 0px;
  font-size: 14px;
  line-height: 65px;
  color: @v-neu9;
  text-align: center;
  border-radius: 3px;
  .text-left-area,
  .text-right-area {
    flex: 1;
    display: flex;
    margin: 4px 0px;
    border: 1px solid @v-neu4;
    .flex-2 {
      flex: 2;
      p {
        border-bottom: 1px solid @v-neu4;
        border-left: 1px solid @v-neu4;
      }
    }
    .flex-1 {
      flex: 1;
      font-size: 18px;
      .v-weight("med");

      line-height: 110px;
      writing-mode: horizontal-tb;
      color: @v-neu9;
      background-color: @v-core1;
    }
  }
}
.total-btn {
  padding-bottom: 16px;
  text-align: right;
}
.fund-export-dialog {
  .title {
    padding-bottom: 16px;
  }
}
.fund-detail-dialog {
  .detail-panel {
    height: 300px;
    padding: 16px;
    overflow: auto;
    background: @v-neu11;
  }
  .detail-section {
    padding: 16px;
    background: @v-neu1;
    border-top: 1px solid @v-neu4;
    &:first-child {
      border-top: none;
    }
    .detail-title {
      .v-weight("med");
    }
    table {
      width: 100%;
    }
    table tr {
      td {
        .v-size(14);
        height: 40px;
        vertical-align: middle;
      }
      td:nth-child(1),
      td:nth-child(4) {
        width: 96px;
      }
      td:nth-child(2),
      td:nth-child(5) {
        width: 220px;
      }
    }
  }
  .detail-form {
    padding-top: 16px;
  }
}
</style>
