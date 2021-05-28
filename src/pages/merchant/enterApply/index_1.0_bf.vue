<!--
 * @Author: 张淦
 * @Date: 2019-11-28 16:22:17
 * @LastEditors: zhanggan
 * @Description: 商户2.0作废
 * @FilePath: /gpay-ops-static/src/pages/merchant/enterApply/index_1.0_bf.vue
 -->
<template>
  <el-tabs v-model="activeName" type="card">
    <el-tab-pane label="商户业务信息" name="first" :disabled="finish">
      <business-info v-if="!id" />
      <business-approval v-if="id && status === 1" :details="details" />
      <business-pass
        v-if="id && (status === 2 || status === 0)"
        :details="details"
      />
      <approval-record :apply-no="processNumber" />
    </el-tab-pane>
    <el-tab-pane label="支付信息" name="second" :disabled="finish">
      <pay-info v-if="id && status === null" :details="details" />
      <pay-Approval v-if="id && status === 1" :details="details" />
      <pay-pass
        v-if="id && (status === 2 || status === 0)"
        :details="details"
      />
      <approval-record :apply-no="processNumber" />
    </el-tab-pane>
    <el-tab-pane
      label="支付运营"
      name="third"
      :details="details"
      :disabled="finish"
    >
      <pay-operate :details="details" />
    </el-tab-pane>
    <el-tab-pane
      :label="
        processNumber
          ? '流程编号：' + processNumber
          : '流程编号：SP' + timeNumber
      "
      name="fourth"
      :disabled="true"
    />
  </el-tabs>
</template>
<script>
import { mapGetters } from "vuex";
import businessInfo from "./businessInfo.vue";
import businessApproval from "./businessApproval.vue";
import businessPass from "./businessPass.vue";
import payInfo from "./payInfo.vue";
import payApproval from "./payApproval.vue";
import payPass from "./payPass.vue";
import payOperate from "./payOperate.vue";
import approvalRecord from "./approvalRecord";

export default {
  name: "EnterApply",
  components: {
    "business-info": businessInfo,
    "business-approval": businessApproval,
    "business-pass": businessPass,
    "pay-info": payInfo,
    "pay-Approval": payApproval,
    "pay-pass": payPass,
    "pay-operate": payOperate,
    "approval-record": approvalRecord,
  },
  data() {
    return {
      id: "",
      finish: true,
      activeName: "first",
      step: "",
      status: null,
      processNumber: null,
      details: {},
    };
  },
  computed: {
    ...mapGetters({
      timeNumber: "timeNumber",
    }),
  },
  created() {
    this.handleSearch();
    this.$common.judgeState({
      financeList: "getFinanceList",
      merchantList: "getMerchantList",
      businessList: "getBusinessList",
      merchantChannelList: "getMerchantChannelList",
      businessAdministration: "getBusinessAdministration",
      companyList: "getCompanyList",
      paymentAccountList: "getPaymentAccountList",
    });
    this.$eventBus.$on("active-change", (item) => {
      this.activeName = item;
      this.handleSearch();
    });
  },
  methods: {
    handleSearch() {
      const { id } = this.$route.params;
      let phase = "";
      this.id = id;
      this.step = this.$store.state.auditStatus.step;
      this.status = this.$store.state.auditStatus.status;
      if (this.step === 1) {
        this.activeName = "first";
        phase = "ONE";
      } else if (this.step === 2) {
        this.activeName = "second";
        phase = "TWO";
        if (this.status === 0) {
          this.finish = false;
        }
      } else if (this.step === 0) {
        this.finish = false;
      }
      const style = this.$store.state.auditStatus.style;
      if (id && style) {
        const url = [
          "/merchant/apply/detail.json",
          "/merchant/business/detail.json",
        ];
        this.$fetch(url[style - 1], {
          method: "post",
          data: {
            id,
          },
        }).then((res) => {
          this.processNumber = res.data.applyNo;
          this.details = { ...res.data, auditId: id, phase: phase };
        });
      } else {
        this.$common.judgeState({
          timeNumber: "getTimeNumber",
        });
      }
    },
    handleClick(tab, event) {
      // console.log(tab, event);
    },
  },
};
</script>
