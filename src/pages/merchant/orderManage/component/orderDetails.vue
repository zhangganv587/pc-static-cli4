<!--
 * @Author: 张淦
 * @Date: 2019-11-26 16:29:25
 * @LastEditors: zhanggan
 * @Description: 订单列表详情
 * @FilePath: /gpay-ops-static/src/pages/merchant/orderManage/component/orderDetails.vue
 -->
<template>
  <v-dialog
    title="订单详情"
    dialog-id="orderDetails"
    @dialog-close="handleClose"
  >
    <div class="order-content">
      <span class="content-title">业务订单号：</span
      ><span>{{ orderForm.bizOrderNo }}</span>
    </div>
    <div class="order-content">
      <span class="content-title">订单金额：</span
      ><span>{{ $common.moneyFormat(orderForm.amount) }}</span>
    </div>
    <div class="order-content">
      <span class="content-title">平台支付流水号：</span
      ><span>{{ orderForm.gpayNo }}</span>
    </div>
    <div class="order-content">
      <span class="content-title">订单状态：</span
      ><span>{{
        $common.tableFormat(
          orderStatus,
          orderForm.orderStatus,
          "dictValue",
          "dictText"
        )
      }}</span>
    </div>
    <div class="order-content">
      <span class="content-title">三方支付流水号：</span
      ><span>{{ orderForm.thirdPayNo }}</span>
    </div>
    <div class="order-content">
      <span class="content-title">订单标题：</span
      ><span>{{ orderForm.title }}</span>
    </div>
    <div class="order-content">
      <span class="content-title">支付方式：</span
      ><span>{{
        $common.tableFormat(
          payWayList,
          orderForm.payWay,
          "dictValue",
          "dictText"
        )
      }}</span>
    </div>
    <div class="order-content">
      <span class="content-title">订单描述：</span
      ><span>{{ orderForm.body }}</span>
    </div>
    <div class="order-content">
      <span class="content-title">机构名称：</span
      ><span>{{ orderForm.ownerCom }}</span>
    </div>
    <div class="order-content">
      <span class="content-title">下单时间：</span
      ><span>{{
        $common.timeFormat(orderForm.createTime, "YYYY-MM-DD HH:mm:ss")
      }}</span>
    </div>
    <div class="order-content">
      <span class="content-title">机构编号：</span
      ><span>{{ orderForm.accountNo }}</span>
    </div>
    <div class="order-content">
      <span class="content-title">支付时间：</span
      ><span>{{
        $common.timeFormat(orderForm.payTime, "YYYY-MM-DD HH:mm:ss")
      }}</span>
    </div>
    <div class="order-content">
      <span class="content-title">备注：</span><span>{{ orderForm.memo }}</span>
    </div>
    <div class="order-content">
      <span class="content-title">过期时间：</span
      ><span>{{
        $common.timeFormat(orderForm.expiredTime, "YYYY-MM-DD HH:mm:ss")
      }}</span>
    </div>
    <template slot="footer">
      <span class="dialog-footer">
        <el-button type="primary opcity" @click="handleClose">关 闭</el-button>
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
      orderForm: {
        bizOrderNo: "",
        amount: "",
        gpayNo: "",
        orderStatus: "",
        thirdPayNo: "",
        title: "",
        payWay: "",
        body: "",
        ownerCom: "",
        createTime: "",
        accountNo: "",
        payTime: "",
        memo: "",
        expiredTime: "",
      },
    };
  },
  computed: {
    ...mapGetters({
      payWayList: "payWayList",
      orderStatus: "orderStatus",
    }),
  },
  watch: {
    rowData(newVal) {
      this.getOrderDetail(newVal);
    },
  },
  created() {
    this.$common.judgeState({
      payWayList: "getPayWayList",
      orderStatus: "getOrderStatus",
    });
  },
  methods: {
    getOrderDetail(row) {
      this.$fetch("/order/detailQuery.json?id=" + row.id, {
        method: "get",
      }).then((res) => {
        if (res.code === 0) {
          this.orderForm = res.data;
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
