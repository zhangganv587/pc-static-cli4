<!--
 * @Author: 张淦
 * @Date: 2020-02-09 15:28:28
 * @LastEditors: zhanggan
 * @Description: 发票系统-发票明细弹框
 * @FilePath: /gpay-ops-static/src/pages/invoice/invoiceDetailsDialog.vue
 -->
<template>
  <v-dialog
    title="发票明细"
    dialog-id="invoiceDetails"
    @dialog-close="handleClose"
  >
    <v-table
      v-loading="loading"
      :data="tableData"
      :columns="columns"
      :pagination="pagination"
      @currentChange="currentChange"
    />
    <template slot="footer">
      <span class="dialog-footer">
        <el-button type="primary opcity" @click="handleClose">关闭</el-button>
      </span>
    </template>
  </v-dialog>
</template>

<script>
import tableFormMixin from "@/mixins/tableFormMixin";
import { PREFERENTIAL_POLICIES, MARK_STATUS } from "@/utils/constants";

export default {
  mixins: [tableFormMixin],
  props: {
    rowData: {
      type: Array,
      default() {
        return [];
      },
    },
  },
  data() {
    this.columns = this.getColumns();
    this.queryUrl = "";
    return {
      isEditDisabled: false,
      rangeData: [],
      // 查询table
      searchForm: {},
    };
  },
  watch: {
    rowData(newVal) {
      if (newVal && Array.isArray(newVal)) {
        this.tableData = newVal;
      } else {
        this.tableData = [];
      }
    },
  },
  methods: {
    getColumns() {
      const columns = [
        { prop: "goodsName", label: "商品名称" },
        { prop: "taxRate", label: "税率" },
        { prop: "goodsSpecifications", label: "规格型号" },
        { prop: "goodsUnit", label: "计量单位" },
        { prop: "goodsNumber", label: "数量" },
        {
          prop: "goodsPrice",
          label: "含税单价(元)",
          render: (h, value, row) => {
            return (
              <span class="tableRight">{this.$common.moneyFormat(value)}</span>
            );
          },
        },
        {
          prop: "money",
          label: "金额(元)",
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
        { prop: "taxCode", label: "税收分类编码" },
        {
          prop: "preferentialPolicies",
          label: "是否享受优惠政策",
          render: (h, value, row) => {
            if (value) {
              return PREFERENTIAL_POLICIES[value];
            }
          },
        },
        { prop: "preferentialPoliciesName", label: "优惠政策名称" },
        {
          prop: "mark",
          label: "零税率标识",
          render: (h, value, row) => {
            if (value) {
              return MARK_STATUS[value];
            } else if (value === "") {
              return "非零税率";
            }
          },
        },
        { prop: "deductions", label: "扣除额" },
        { prop: "discountAmount", label: "折扣金额" },
      ];
      return columns;
    },
    handleClose() {
      this.$eventBus.$emit("dialog-visible", false);
    },
  },
};
</script>
