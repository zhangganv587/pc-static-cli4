<!--
 * @Author: zhanggan
 * @Date: 2020-08-26 10:09:36
 * @LastEditors: zhanggan
 * @FilePath: /gpay-pc-static/src/pages/base/payHeader.vue
-->
<template>
  <div class="pay-header">
    <img src="https://kano.guahao.cn/ZVa266695741" class="pay-header-icon" />
    <div class="pay-header-index">
      <div class="pay-header-time">
        下单成功,请在
        <i>{{ remainingTime }}</i
        >内完成支付！
      </div>
      <div class="pay-header-desc">
        <p>订单描述：{{ payInfo.body }}</p>
        <p>订单编号：{{ payInfo.bizOrderNo }}</p>
        <p>提交时间：{{ orderCreateDate }}</p>
      </div>
    </div>
    <div class="pay-header-money">
      <p>
        订单金额：
        <span>{{ payInfo.totalAmount | checkxPrice }}</span
        >元
      </p>
      <p>
        实付金额：
        <span style="color: #ff9900">{{ payInfo.payAmount | checkxPrice }}</span
        >元
      </p>
    </div>
  </div>
</template>
<script>
export default {
  name: "PayTip",
  props: {
    payInfo: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      orderCreateDate: null,
      remainingTime: null,
    };
  },
  watch: {
    payInfo(newVal) {
      if (newVal) {
        this.countDown();
        this.orderCreateDate = this.$common.formatter(
          this.payInfo.orderCreateDate
        );
      }
    },
  },
  methods: {
    // 倒计时
    countDown() {
      const nowtime = new Date();
      const endtime = new Date(this.payInfo.expiredTime);
      const lefttime = parseInt((endtime.getTime() - nowtime.getTime()) / 1000);
      const remainingTime = this.$common.timeFormatter(lefttime);
      if (endtime.getTime() - nowtime.getTime() < 0) {
        this.$router.push({
          path: "/result",
          query: { prePayId: this.$route.query.prePayId, timeOut: "true" },
        });
      }
      if (remainingTime.length === 12) {
        this.remainingTime = remainingTime;
      }
      setTimeout(this.countDown, 1000);
    },
    addZero(i) {
      return i < 10 ? "0" + i : i + "";
    },
  },
};
//
</script>
<style lang="less" scoped>
.pay-header {
  display: flex;
  width: 980px;
  height: 144px;
  padding: 30px;
  margin: 0 auto 20px;
  background: #f5faf3;
  border: 1px solid #dfefdb;
  box-sizing: border-box;
  .pay-header-icon {
    width: 48px;
    height: 48px;
    margin-right: 20px;
  }
  .pay-header-money {
    margin-top: 24px;
    font-size: 0;
    p {
      margin-bottom: 8px;
      font-family: PingFangSC, PingFangSC-Regular;
      font-size: 12px;
      font-weight: 400;
      color: #333;
      span {
        font-family: HelveticaNeue, HelveticaNeue-Medium;
        font-size: 22px;
        font-weight: 500;
        color: #333;
        text-align: left;
      }
    }
  }
  .pay-header-index {
    width: 680px;
    .pay-header-time {
      margin-bottom: 20px;
      font-family: PingFangSC, PingFangSC-Regular;
      font-size: 18px;
      font-weight: 400;
      line-height: 18px;
      color: #333;
      i {
        color: #5ba946;
      }
    }
    .pay-header-desc {
      font-family: PingFangSC, PingFangSC-Regular;
      font-size: 12px;
      font-weight: 400;
      line-height: 12px;
      color: #888;
      p {
        width: 680px;
        margin-bottom: 5px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }
  }
}
</style>
