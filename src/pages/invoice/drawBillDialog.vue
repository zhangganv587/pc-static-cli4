<!--
 * @Author: 张淦
 * @Date: 2020-03-25 15:52:54
 * @LastEditors: zhanggan
 * @Description: 发票系统--开票弹框
 * @FilePath: /gpay-ops-static/src/pages/invoice/drawBillDialog.vue
 -->
<template>
  <v-dialog
    title="开票确认"
    dialog-id="drawBill"
    @dialog-confirm="handleSubmitForm"
    @dialog-close="handleResetForm"
  >
    <el-form
      ref="dialogFormRef"
      label-width="120px"
      :model="formModel"
      :rules="rules"
    >
      <el-form-item label="发票代码：" prop="invoiceCode">
        <el-input
          v-model="formModel.invoiceCode"
          autocomplete="off"
          maxlength="12"
          placeholder="请输入发票代码"
        />
      </el-form-item>
      <el-form-item label="发票号码：" prop="invoiceNo">
        <el-input
          v-model="formModel.invoiceNo"
          autocomplete="off"
          maxlength="8"
          placeholder="请输入发票号码"
        />
      </el-form-item>
    </el-form>
  </v-dialog>
</template>

<script>
export default {
  props: {
    rowData: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    var validateCode = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入发票代码"));
      } else {
        this.formModel.invoiceCode = value.replace(/[^\d]/g, "");
        callback();
      }
    };
    var validateNo = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入发票号码"));
      } else {
        this.formModel.invoiceNo = value.replace(/[^\d]/g, "");
        callback();
      }
    };
    this.rules = {
      invoiceCode: [{ validator: validateCode, trigger: ["blur", "change"] }],
      invoiceNo: [{ validator: validateNo, trigger: ["blur", "change"] }],
    };
    this.submintUrl = "/invoice/ensure.json";
    return {
      isEditDisabled: true,
      formModel: {
        invoiceCode: "",
        invoiceNo: "",
      },
    };
  },
  methods: {
    handleSubmitForm() {
      this.$refs.dialogFormRef.validate((valid) => {
        if (valid) {
          this.$fetch(this.submintUrl, {
            method: "post",
            data: {
              orderNo: this.rowData.orderNo,
              ...this.formModel,
            },
          }).then((res) => {
            if (res.code === 0) {
              this.$message({
                type: "success",
                message: "开票成功!",
              });
              this.$parent.handleSearch();
              this.handleResetForm();
            }
          });
        } else {
          this.$message({
            type: "error",
            message: "提交失败请检查!",
          });
          return false;
        }
      });
    },
    // 重置表单
    handleResetForm() {
      this.$nextTick(() => {
        this.$refs.dialogFormRef.clearValidate();
      });
      this.$eventBus.$emit("dialog-visible", {
        visible: false,
        dialogId: "drawBill",
      });
    },
  },
};
</script>
