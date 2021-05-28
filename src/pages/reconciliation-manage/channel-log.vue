<!--
 * @Description: 对账任务
 * @Author: wangjun
 * @Date: 2021-03-08 09:50:07
-->
<template>
  <div>
    <wy-form-table
      ref="wyTableRef"
      url="/checking/task/recordList.json"
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
  </div>
</template>

<script>
import mixin from "@/mixins/wy-table-mixin";
import moment from "moment";
import { mapGetters, mapActions } from "vuex";
export default {
  name: "ChannelReconciliation",
  components: {},
  mixins: [mixin],
  data() {
    return {
      formOptions: {
        inline: true,
        size: "small",
        submitBtnText: "查询",
        showResetBtn: true,
        resetBtnCallback: this.resetBtnCallback,
        forms: [
          {
            prop: "dataRangeTime",
            itemType: "daterange",
            attrs: {
              width: "255",
              rangeSeparator: "～",
              clearable: true,
              startPlaceholder: "交易开始日期",
              endPlaceholder: "交易结束日期",
            },
            rules: [
              {
                required: true,
                validator: (rule, value, callback) => {
                  if (!value || !value.length) {
                    callback(new Error("交易日期不能为空"));
                  } else if (
                    moment(value[1]).diff(moment(value[0]), "days") > 35
                  ) {
                    callback(new Error("交易日期间隔不大于35天"));
                  } else {
                    callback();
                  }
                },
              },
            ],
          },
          {
            prop: "accountNo",
            itemType: "select",
            attrs: {
              width: "160",
              placeholder: "结算账号/结算机构编码",
              filterable: true,
              clearable: true,
            },
            options: [],
          },
          {
            prop: "channelBillStatus",
            itemType: "select",
            attrs: {
              width: "120",
              clearable: true,
              placeholder: "状态",
            },
            options: [
              { value: 0, label: "进行中" },
              { value: 1, label: "完成" },
              { value: 2, label: "失败" },
            ],
          },
        ],
      },
      column: [
        { label: "序号", type: "index", index: this.indexMethod, width: 55 },
        {
          prop: "billDate",
          label: "交易日期",
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
          prop: "partnerName",
          label: "账号主体",
          minWidth: 90,
          showOverflowTooltip: true,
        },
        {
          prop: "checkingWay",
          label: "对账方式",
          width: 130,
          showOverflowTooltip: true,
        },
        {
          prop: "channelFileSuffix",
          label: "账单格式",
          minWidth: 100,
          showOverflowTooltip: true,
        },
        {
          prop: "taskStatus",
          label: "任务状态",
          width: 90,
          showOverflowTooltip: true,
          render: (h, scope) => {
            const type = {
              0: "进行中",
              1: "成功",
              2: "失败",
            };
            return <span>{type[scope.row.taskStatus] || "-"}</span>;
          },
        },
        {
          prop: "remark",
          label: "任务描述",
          width: 90,
          showOverflowTooltip: true,
        },
        {
          prop: "gmtCreated",
          label: "下载时间",
          width: 120,
          showOverflowTooltip: true,
        },
        {
          prop: "gmtCreated",
          label: "操作",
          width: 180,
          showOverflowTooltip: true,
          render: (h, scope) => {
            return (
              <span>
                {scope.row.channelFilePath ? (
                  <span
                    style={{
                      marginRight: "5px",
                      cursor: "pointer",
                      color: "#3E7FEE",
                    }}
                    onClick={(e) => this.handleExportBill(scope.row, e)}
                  >
                    导出账单
                  </span>
                ) : (
                  "-"
                )}
              </span>
            );
          },
        },
      ],
    };
  },
  computed: {
    ...mapGetters({
      checkingAccountList: "checkingAccountList",
    }),
  },
  watch: {},
  created() {},
  async mounted() {
    this.$refs.wyTableRef.setParam("dataRangeTime", [
      moment().subtract(7, "days"),
      moment(),
    ]);
    this.$refs.wyTableRef.searchHandler();
    await this.getCheckingAccountList().catch(() => {});
    this.formOptions.forms[1].options = this.checkingAccountList;
  },
  methods: {
    ...mapActions({
      getCheckingAccountList: "getCheckingAccountList",
    }),
    handleExportBill(row, e) {
      e.preventDefault();
      e.stopPropagation();
      window.location.href = row.channelFilePath;
    },
    paramsHandler(params) {
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
