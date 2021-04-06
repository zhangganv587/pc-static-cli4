<template>
  <div class="uploadPage">
    <pay-tip :tip="tip" :type="type" />
    <div class="uploadPage__btns">
      <div
        v-if="type === 1 && status"
        class="uploadPage__btns_success"
        @click="goUrl"
      >
        完成
      </div>
      <div v-else class="uploadPage__btns_success" @click="goPay">去结算</div>
      <div v-if="type !== 1" class="uploadPage__btns_success" @click="getInfo">
        刷新
      </div>
    </div>
  </div>
</template>
<script>
import payTip from "@/components/payTip";
import { mapActions } from "vuex";
export default {
  name: "UploadPage",
  components: {
    payTip,
  },
  data() {
    return {
      tip: "订单支付等待中...",
      status: false,
      type: 4,
      returnUri: "",
    };
  },
  mounted() {
    this.status = this.$route.query.status === "success";
    if (this.status) {
      // 支付成功
      this.goSuccess();
    } else {
      this.getInfo();
    }
  },
  methods: {
    ...mapActions({
      getPayGuangZhouSettle: "payStation/getPayGuangZhouSettle",
      getPayGuangZhouRetry: "payStation/getPayGuangZhouRetry",
      getPayResult: "payStation/getPayResult",
    }),
    goPay() {
      this.getPayGuangZhouSettle({
        prePayId: this.$route.query.prePayId,
      }).then((res) => {
        if (res) {
          this.$router.push(`/orderPay?prePayId=${this.$route.query.prePayId}`);
        }
      });
    },
    getInfo() {
      this.getPayGuangZhouRetry({
        prePayId: this.$route.query.prePayId,
      }).then((res) => {
        if (res) {
          this.goPay();
        }
      });
    },
    goSuccess() {
      this.getPayResult({
        prePayId: this.$route.query.prePayId,
      })
        .then((res) => {
          this.type = 1;
          this.tip = "订单支付成功";
          this.returnUri = res.returnUri;
        })
        .catch((err) => {
          this.type = 2;
          this.tip = err.message || "订单支付结果获取异常，请稍后再试！";
        });
    },
    goUrl() {
      window.location.href = this.returnUri;
    },
  },
};
</script>
<style lang="less" scoped>
.uploadPage {
  &__btns {
    display: flex;
    width: 982px;
    margin: 20px auto;
    &_success {
      display: block;
      float: left;
      width: 137px;
      padding: 12px 20px;
      margin: 20px 30px 0 0;
      font-size: 16px;
      color: #fff;
      text-align: center;
      cursor: pointer;
      background: #86bc4c;
      border: none;
      border-radius: 5px;
    }
    &_success:hover {
      opacity: 0.7;
    }
  }
}
</style>
