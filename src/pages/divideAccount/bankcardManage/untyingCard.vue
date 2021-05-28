<template>
  <v-dialog
    title="解绑"
    dialog-id="untyingCard"
    :is-confirming="isConfirming"
    @dialog-confirm="handleSubmitForm"
    @dialog-close="handleResetForm"
  >
    <el-form
      ref="untyingForm"
      label-width="110px"
      :model="untyingForm"
      :rules="rules"
    >
      <el-form-item label="解绑原因：" prop="reason">
        <el-input
          v-model="untyingForm.reason"
          autocomplete="off"
          type="textarea"
          placeholder="请输入解绑原因"
          :rows="3"
        />
      </el-form-item>
    </el-form>
  </v-dialog>
</template>
<script>
export default {
  props: {
    dialogInfo: {
      type: Object,
      default: () => ({
        merchantNo: "",
        settlementChannel: "",
      }),
    },
  },
  data() {
    this.queryUrl = "/subAccount/untied.json";
    this.rules = {
      reason: [{ required: true, message: "请输入解绑原因", trigger: "blur" }],
    };

    return {
      untyingForm: {
        reason: "",
        settlementChannel: "",
        merchantNo: "",
      },
    };
  },
  computed: {
    isConfirming() {
      return this.$store.state.effectLoading[this.queryUrl];
    },
  },
  watch: {
    dialogInfo(newVal) {
      this.untyingForm = {
        ...this.untyingForm,
        ...newVal,
      };
    },
  },
  methods: {
    handleSubmitForm(callback) {
      this.$refs.untyingForm.validate((valid) => {
        if (valid) {
          this.$confirm("确定解绑该银行卡?", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning",
          })
            .then(() => {
              this.$fetch(this.queryUrl, {
                method: "post",
                data: { ...this.untyingForm },
              }).then((res) => {
                if (res.code === 0) {
                  this.$message({
                    type: "success",
                    message: "解绑成功!",
                  });

                  this.$parent.$refs.formSubmit.handleSearch();
                  this.handleResetForm(callback);
                }
              });
            })
            .catch(() => {});
        }
      });
    },
    handleResetForm(callback) {
      this.$refs.untyingForm.resetFields();
      typeof callback === "function" && callback();
    },
  },
};
</script>
