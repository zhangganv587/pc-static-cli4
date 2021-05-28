<!--
 * @Author: 张淦
 * @Date: 2020-04-27 14:12:38
 * @LastEditors: 张淦
 * @Description:
 * @FilePath: /gpay-ops-static/src/pages/orderManage/detail.vue
 -->
<template>
  <v-dialog
    title="分账明细"
    dialog-id="refundDetail"
    width="80%"
    @dialog-open="handleDialogOpen"
  >
    <v-table
      v-loading="loading"
      type="index"
      :data="tableData"
      :columns="columns"
      :pagination="pagination"
      @currentChange="currentChange"
    />
    <el-button slot="footer" @click="$eventBus.$emit('dialog-visible', false)">
      关闭
    </el-button>
  </v-dialog>
</template>
<script>
import tableFormMixin from "@/mixins/tableFormMixin";

export default {
  mixins: [tableFormMixin],
  props: {
    bizOrderNo: {
      type: String,
      default: "",
    },
  },
  data() {
    this.columns = this.getColumns();
    this.queryUrl = "/number/query.json";

    return {};
  },
  methods: {
    getColumns() {
      return [
        { prop: "subAccountTime", label: "分账时间" },
        {
          prop: "transType",
          label: "分账类型",
          render: (h, value, row) => {
            return this.$common.tableFormat(this.format.tradeType, value);
          },
          width: "120",
        },
        {
          prop: "subAmount",
          label: "分账金额",
          render: (h, value, row) => {
            return this.$common.moneyFormat(value);
          },
          width: "120",
        },
        {
          prop: "transStatus",
          label: "分账状态",
          render: (h, value, row) => {
            return this.$common.tableFormat(
              this.format.divideAccountStatus,
              value
            );
          },
          width: "120",
        },
        {
          prop: "accountBlance",
          label: "账户余额",
          render: (h, value, row) => {
            return this.$common.moneyFormat(value);
          },
          width: "120",
        },
        { prop: "subOrderNo", label: "分账流水号" },
        { prop: "memo", label: "备注" },
      ];
    },

    handleDialogOpen() {
      this.$fetch(this.queryUrl, {
        method: "post",
        data: {
          bizOrderNo: this.bizOrderNo,
          ...this.pagination,
        },
      }).then((res) => {
        if (res.code === 0) {
          this.tableData = res.data.dataList;
          this.pagination.totalNum = res.data.totalNum;
        }
      });
    },
  },
};
</script>
