<template>
  <v-dialog
    title="账号支付信息"
    dialog-id="accountInfo"
    @dialog-close="handleResetForm"
  >
    <account ref="account" />
    <payment ref="payment" />
    <span slot="footer">
      <el-button @click="handleResetForm">关闭</el-button>
    </span>
  </v-dialog>
</template>

<script>
import account from "./account";
import payment from "./index";

export default {
  components: {
    account,
    payment,
  },
  methods: {
    handleResetForm() {
      this.$refs.account.resetForm();
      this.$store.commit("CONFIGURE_LIST", "");
      this.$eventBus.$emit("dialog-visible", false);
    },
  },
};
</script>
