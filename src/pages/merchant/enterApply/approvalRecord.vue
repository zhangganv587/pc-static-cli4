<!--
 * @Author: 张淦
 * @Date: 2019-11-28 11:12:48
 * @LastEditors: zhanggan
 * @Description: 商户2.0作废
 * @FilePath: /gpay-ops-static/src/pages/merchant/enterApply/approvalRecord.vue
 -->
<template>
  <el-card v-show="auditQuery.length" style="margin-top: 20px" title="审批记录">
    <div slot="header" class="clearfix">
      <span>审批记录</span>
    </div>
    <el-table :data="auditQuery" style="width: 100%">
      <el-table-column prop="applyOperator" label="申请人" />
      <el-table-column prop="auditOperator" label="审批人" />
      <el-table-column prop="auditStatus" label="审批结果" />
      <el-table-column prop="auditDate" label="审批时间" />
      <el-table-column prop="applyNo" label="流程编号" />
    </el-table>
  </el-card>
</template>
<script>
export default {
  name: "ApprovalRecord",
  props: {
    applyNo: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      auditQuery: [],
    };
  },
  watch: {
    applyNo(newVlaue) {
      this.handleSearch(newVlaue);
    },
  },
  methods: {
    handleSearch(applyNo) {
      this.$fetch("/review/auditQuery.json", {
        method: "post",
        data: {
          applyNo: applyNo,
          pageSize: 999,
        },
      }).then((res) => {
        if (res.data.dataList) {
          this.auditQuery = res.data.dataList;
          const auditStatus = ["审核通过", "待审批", "审批驳回"];
          this.auditQuery.forEach((item) => {
            item.auditDate = this.$common.timeFormat(item.auditDate);
            item.auditStatus = auditStatus[item.auditStatus];
          });
        }
      });
    },
    handleClick(tab, event) {
      // console.log(tab, event);
    },
  },
};
</script>
