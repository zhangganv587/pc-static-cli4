<!--
 * @Author: zhanggan
 * @Date: 2020-08-05 17:13:31
 * @LastEditors: zhanggan
 * @FilePath: /gpay-pc-static/src/pages/base/underLineDialog.vue
-->
<template>
  <el-dialog
    title="提示"
    :visible.sync="underLineFormVisible"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :show-close="false"
  >
    <el-form ref="validateForm" :model="form">
      <el-form-item label-width="140px">
        <span v-show="errorMessage" class="pay-tip-error"
          >失败原因：{{ errorMessage }}</span
        >
      </el-form-item>
      <el-form-item label="待支付：" label-width="140px">
        <span class="pay-tip-money">
          {{ payInfo.payAmount | checkxPrice }}
          <span class="pay-tip-money-text">元</span>
        </span>
      </el-form-item>
      <el-form-item label="收款方式：" label-width="140px">
        {{ payTitle }}
      </el-form-item>
      <el-form-item label="实收现金：" label-width="140px">
        {{ payInfo.payAmount | checkxPrice }}元
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button :loading="loading" type="primary" @click="handleSure">
        确定支付
      </el-button>
      <el-button @click="handleClose"> 取消 </el-button>
    </div>
  </el-dialog>
</template>

<script>
import { mapActions } from "vuex";

export default {
  props: {
    underLineFormVisible: {
      type: Boolean,
      default: false,
    },
    underLineIndex: {
      type: String,
      default: "",
    },
    payInfo: {
      type: Object,
      default: () => {},
    },
    payTitle: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      errorMessage: "",
      loading: false,
      form: {
        prePayId: null,
        sign: null,
        totalAmount: null,
        payways: [
          {
            payWay: null,
            amount: null,
          },
        ],
      },
    };
  },
  methods: {
    ...mapActions({
      getCashPay: "base/getCashPay",
    }),
    handleClose() {
      this.errorMessage = "";
      this.$refs["validateForm"].resetFields();
      this.$parent.closeDialog();
    },
    handleSure() {
      // setInterval(() => {
      //   this.$parent.getInfo();
      // }, 1000);
      this.loading = true;
      this.form.prePayId = this.$route.query.prePayId;
      this.form.totalAmount = this.payInfo.totalAmount;
      this.form.payways[0].payWay = this.underLineIndex;
      this.form.payways[0].amount = this.payInfo.payAmount;
      this.getCashPay({
        ...this.form,
      })
        .then((res) => {
          this.loading = false;
          if (res) {
            this.$router.push({
              path: "/result",
              query: { prePayId: this.$route.query.prePayId },
            });
          }
        })
        .catch(() => {
          this.loading = false;
        });
    },
  },
};
</script>
<style lang="less" scoped>
.pay-tip-error {
  font-family: PingFangSC, PingFangSC-Medium;
  font-size: 18px;
  font-weight: 500;
  line-height: 18px;
  color: #ea6953;
}
.pay-tip-money {
  font-family: HelveticaNeue, HelveticaNeue-Medium;
  font-size: 24px;
  font-weight: 500;
  line-height: 20px;
  color: #f90;
  .pay-tip-money-text {
    font-size: 12px;
  }
}
</style>
