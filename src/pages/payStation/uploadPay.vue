<template>
  <div class="uploadPage">
    <pay-tip :tip="tip" :type="type" />
    <div class="uploadPage__btns">
      <div class="uploadPage__btns_success" @click="btnEvent">
        {{ type === 1 ? "完成" : "刷新" }}
      </div>
      <div
        class="uploadPage__btns_success uploadPage__btns_back"
        @click="goBack"
      >
        返回
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
      type: 4,
      tip: "您的处方未上传，请尽快到上传!",
    };
  },
  mounted() {
    this.getInfo();
  },
  methods: {
    ...mapActions({
      getPayGuangZhouStatus: "payStation/getPayGuangZhouStatus",
    }),
    async getInfo() {
      this.getPayGuangZhouStatus({
        prePayId: this.$route.query.prePayId,
      })
        .then((res) => {
          if (res) {
            this.type = 1;
            this.tip = "您的处方凭证已上传，请尽快到医保台结算!";
          }
        })
        .catch((err) => {
          this.type = 2;
          this.tip = err.message;
        });
    },
    // 返回
    goBack() {
      if (window.history.length) {
        window.history.go(-1);
      } else {
        window.close();
      }
    },
    btnEvent() {
      if (this.type !== 1) {
        return this.getInfo();
      }
      this.$router.push(`/accountPay?prePayId=${this.$route.query.prePayId}`);
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
    &_back:hover {
      opacity: 0.7;
    }
  }
}
</style>
