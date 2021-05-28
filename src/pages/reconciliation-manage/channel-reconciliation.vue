<!--
 * @Description: 渠道对账
 * @Author: wangjun
 * @Date: 2021-03-04 16:01:25
-->
<template>
  <div>
    <wy-form-table
      ref="wyTableRef"
      url="/checking/stas/recordList.json"
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
import moment from "moment";
import mixin from "@/mixins/wy-table-mixin";
import { mapActions, mapGetters } from "vuex";

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
        exportBtnCallback: this.exportBtnCallback,
        forms: [
          {
            prop: "dataRangeTime",
            itemType: "daterange",
            attrs: {
              width: "255",
              rangeSeparator: "～",
              clearable: true,
              startPlaceholder: "开始日期",
              endPlaceholder: "结束日期",
            },
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
              width: "140",
              filterable: true,
              clearable: true,
              placeholder: "结算账户",
            },
            options: [],
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
          prop: "paymentType",
          label: "收银台类型",
          minWidth: 120,
          showOverflowTooltip: true,
          render: (h, scope) => {
            const type = {
              0: "在线支付",
              1: "窗口支付",
            };
            return <span>{type[scope.row.accountResult] || "-"}</span>;
          },
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
          prop: "gpayAmount",
          label: "收银台总额",
          minWidth: 120,
          showOverflowTooltip: true,
        },
        {
          prop: "channelAmount",
          label: "渠道总额",
          width: 120,
          showOverflowTooltip: true,
        },
        {
          prop: "accountResult",
          label: "对账结果",
          width: 90,
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
          prop: "gmtCreated",
          label: "操作",
          width: 180,
          showOverflowTooltip: true,
          render: (h, scope) => {
            return (
              <span style={{ cursor: "pointer", color: "#3E7FEE" }}>
                {scope.row.accountResult !== 0 ? (
                  <span
                    style={{ marginRight: "5px" }}
                    onClick={(e) =>
                      this.handleRouteSkip(scope.row, e, "error-skip")
                    }
                  >
                    差错处理
                  </span>
                ) : (
                  ""
                )}
                <span
                  onClick={(e) =>
                    this.handleRouteSkip(scope.row, e, "checked-skip")
                  }
                >
                  查看明细
                </span>
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
      allInstitution: "allInstitution",
    }),
  },
  // 迁移过来后删除机构号
  //   watch: {
  //     '$store.state.institutionCode' (val) {
  //       this.$refs.wyTableRef.setParam('institutionCode', val);
  //       this.$refs.wyTableRef.searchHandler(true, true);
  //     }
  //   },
  created() {},
  async mounted() {
    this.$refs.wyTableRef.searchHandler();
    await this.getCheckingAccountList().catch(() => {});
    this.formOptions.forms[2].options = this.checkingAccountList;
    await this.getAllInstitution().catch(() => {});
    this.formOptions.forms[1].options = this.allInstitution;
    this.$refs.wyTableRef.setParam(
      "institutionCode",
      sessionStorage.getItem("institutionCode")
    );
  },
  methods: {
    ...mapActions({
      getCheckingAccountList: "getCheckingAccountList",
      getAllInstitution: "getAllInstitution",
    }),
    handleFetchSuggestions(string) {
      clearTimeout(this.timeout);
      this.timeout = setTimeout(async () => {}, 500);
    },
    handleRouteSkip(row, e, type) {
      e.preventDefault();
      e.stopPropagation();
      const { accountNo, billDate, institutionName, paymentType } = row;
      const query = {};
      if (type === "error-skip") {
        query.isFormal =
          moment(row.billDate).add(3, "days") <= moment() ? 1 : 0;
      }
      this.$router.push({
        path:
          type === "error-skip"
            ? "/reconciliation/error-manage"
            : "/reconciliation/channel-reconciliation/checked-channel",
        query: {
          billDateStart: billDate,
          billDateEnd: billDate,
          institutionName,
          accountNo,
          paymentType,
          ...query,
        },
      });
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
