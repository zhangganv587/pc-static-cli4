<!--
 * @Author: 张淦
 * @Date: 2019-11-26 16:29:25
 * @LastEditors: zhanggan
 * @Description: 退款列表详情
 * @FilePath: /gpay-ops-static/src/pages/merchant/orderManage/component/refundDetails.vue
 -->
<template>
  <v-dialog
    title="退款详情"
    dialog-id="refundDetails"
    @dialog-close="handleClose"
  >
    <div class="order-content">
      <span class="content-title">业务退款订单号：</span>
      <span>{{ refundForm.bizRefundNo }}</span>
    </div>
    <div class="order-content">
      <span class="content-title">退款金额：</span
      ><span>{{ $common.moneyFormat(refundForm.amount) }} </span>
    </div>
    <div class="order-content">
      <span class="content-title">平台退款流水号：</span
      ><span>{{ refundForm.refundNo }} </span>
    </div>
    <div class="order-content">
      <span class="content-title">实际退款金额：</span
      ><span>{{ $common.moneyFormat(refundForm.totalAmount) }} </span>
    </div>
    <div class="order-content">
      <span class="content-title">平台支付流水号：</span
      ><span>{{ refundForm.gpayNo }} </span>
    </div>
    <div class="order-content">
      <span class="content-title">退款状态：</span
      ><span
        >{{
          $common.tableFormat(
            refundStatus,
            refundForm.refundStatus,
            "dictValue",
            "dictText"
          )
        }}
      </span>
    </div>
    <div class="order-content">
      <span class="content-title">退款方式：</span
      ><span
        >{{
          $common.tableFormat(
            payWayList,
            refundForm.payWay,
            "dictValue",
            "dictText"
          )
        }}
      </span>
    </div>
    <div class="order-content">
      <span class="content-title">退款时间：</span
      ><span
        >{{ $common.timeFormat(refundForm.refundTime, "YYYY-MM-DD HH:mm:ss") }}
      </span>
    </div>
    <div class="order-content">
      <span class="content-title">退款原因：</span
      ><span>{{ refundForm.reason }} </span>
    </div>
    <div class="order-content">
      <span class="content-title">通知时间：</span
      ><span
        >{{
          $common.timeFormat(refundForm.callbackTime, "YYYY-MM-DD HH:mm:ss")
        }}
      </span>
    </div>
    <div class="order-content">
      <span class="content-title">异步通知url：</span
      ><span>{{ refundForm.notifyUrl }} </span>
    </div>
    <div class="order-content">
      <span class="content-title">通知状态：</span
      ><span
        >{{
          $common.tableFormat(
            callBackStatus,
            refundForm.callbackStatus,
            "dictValue",
            "dictText"
          )
        }}
      </span>
    </div>
    <div class="order-content">
      <span class="content-title">备注：</span
      ><span>{{ refundForm.memo }} </span>
    </div>
    <template slot="footer">
      <span class="dialog-footer">
        <el-button type="primary opcity" @click="handleClose">关闭</el-button>
      </span>
    </template>
  </v-dialog>
</template>
<script>
import { mapGetters } from "vuex";

export default {
  props: {
    rowData: {
      type: Object,
      default() {
        return {};
      },
    },
  },
  data() {
    return {
      refundForm: {
        id: "",
        bizRefundNo: "",
        amount: "",
        refundNo: "",
        totalAmount: "",
        gpayNo: "",
        refundStatus: "",
        payWay: "",
        refundTime: "",
        reason: "",
        callbackTime: "",
        memo: "",
        notifyUrl: "",
        callbackStatus: "",
      },
    };
  },
  computed: {
    ...mapGetters({
      payWayList: "payWayList",
      refundStatus: "refundStatus",
      callBackStatus: "callBackStatus",
    }),
  },
  watch: {
    rowData(newVal) {
      if (newVal && typeof newVal === "object") {
        this.getRefundDetails(newVal);
      }
    },
  },
  created() {
    this.$common.judgeState({
      payWayList: "getPayWayList",
      refundStatus: "getRefundStatus",
      callBackStatus: "getCallBackStatus",
    });
  },
  methods: {
    getRefundDetails(row) {
      this.$fetch("/refundOrder/detailQuery.json?id=" + row.id, {
        method: "get",
      }).then((res) => {
        if (res.code === 0) {
          this.refundForm = res.data;
        }
      });
    },
    handleClose() {
      this.$eventBus.$emit("dialog-visible", false);
    },
  },
};
</script>
<style lang="less" scoped>
.order-content {
  margin-bottom: 10px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
  color: #34384b;
  .content-title {
    display: inline-block;
    width: 120px;
    color: #8c9ab4;
  }
}
</style>
