<!--
 * @Author: zhanggan
 * @Date: 2020-08-05 17:13:31
 * @LastEditors: zhanggan
 * @FilePath: /gpay-pc-static/src/pages/base/onLineDialog.vue
-->
<template>
  <el-dialog
    title="提示"
    :visible.sync="onLineFormVisible"
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
      <el-form-item
        label="付款码："
        label-width="140px"
        prop="payAuthCode"
        :rules="[
          { required: true, message: '请扫描用户付款码', trigger: 'change' },
        ]"
      >
        <el-row :gutter="20">
          <el-col :span="18">
            <el-input
              id="input"
              ref="input"
              v-model="form.payAuthCode"
              v-focus
              required
              autofocus
              width="120px"
              placeholder="请扫描用户付款码"
            />
          </el-col>
          <el-col :span="4">
            <el-button @click="handleClear()"> 清空 </el-button>
          </el-col>
        </el-row>
      </el-form-item>
      <input id="text" type="text" style="display: none" />
      <input id="text" type="text" style="display: none" />
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" :loading="loading" @click="handleSure">
        确定支付
      </el-button>
      <el-button @click="handleClose"> 取消 </el-button>
    </div>
  </el-dialog>
</template>

<script>
import { mapActions } from "vuex";

export default {
  directives: {
    focus: {
      inserted: function (el) {
        el.querySelector("#input").focus();
      },
    },
  },
  props: {
    onLineFormVisible: {
      type: Boolean,
      default: false,
    },
    onLineIndex: {
      type: String,
      default: "",
    },
    payInfo: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      errorMessage: "",
      loading: false,
      form: {
        payAuthCode: "",
      },
    };
  },
  watch: {
    onLineFormVisible(newVal) {
      if (newVal) {
        this.errorMessage = "";
        this.form.payAuthCode = "";
        this.$nextTick(() => {
          this.$refs["input"].focus();
        });
      }
    },
  },
  methods: {
    ...mapActions({
      getaliPay: "base/getaliPay",
      getwxPay: "base/getwxPay",
    }),
    handleClear() {
      this.errorMessage = "";
      this.$refs["validateForm"].resetFields();
      this.$refs["input"].focus();
    },
    handleClose() {
      this.errorMessage = "";
      this.$refs["validateForm"].resetFields();
      this.$parent.closeDialog();
    },
    handleSure() {
      this.$refs["validateForm"].validate((valid) => {
        if (valid) {
          this.loading = true;
          if (this.onLineIndex === "alipayScan") {
            this.getaliPay({
              prePayId: this.$route.query.prePayId,
              payAuthCode: this.form.payAuthCode,
            }).then((res) => {
              this.loading = false;
              if (res.payStatus === "fail") {
                this.errorMessage = res.errorMsg;
              } else {
                this.$router.push({
                  path: "/result",
                  query: { prePayId: this.$route.query.prePayId },
                });
              }
            });
          } else if (this.onLineIndex === "wxpayscan") {
            this.getwxPay({
              prePayId: this.$route.query.prePayId,
              payAuthCode: this.form.payAuthCode,
            }).then((res) => {
              this.loading = false;
              if (res.payStatus === "fail") {
                this.errorMessage = res.errorMsg;
              } else if (res.payStatus === "suc") {
                this.$router.push({
                  path: "/result",
                  query: { prePayId: this.$route.query.prePayId },
                });
              }
            });
          }
        }
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
