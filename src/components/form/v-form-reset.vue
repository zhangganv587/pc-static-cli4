<!--
 * @Author: langshuang1
 * @Date: 2019-12-09 16:16:23
 * @LastEditors  : 张淦
 * @Description:
 * @FilePath: /gpay-ops-static/src/components/form/v-form-reset.vue
 -->
<template>
  <el-button type="primary" size="small" narrow plain="" @click="handleReset">
    {{ text }}
  </el-button>
</template>

<script>
export default {
  name: "VFormReset",
  props: {
    text: {
      type: String,
      default: "清空",
    },
    formRef: {
      type: Object,
      default: () => null,
    },
  },

  methods: {
    resetDatepicker() {
      const $formRef = this.formRef;
      // this.$set($formRef.model, 'datePicker', []);

      $formRef.$parent.datePicker = [];
      $formRef.$parent.orderTimePicker = [];
    },
    handleReset() {
      let $formRef = this.formRef;

      if (!$formRef) {
        $formRef = this.$parent.form;
      }

      if (process.env.NODE_ENV !== "production") {
        if (!$formRef) {
          throw new Error(
            "There are no form components in the parent component！"
          );
        }

        if (!$formRef.model) {
          throw new Error(
            "Please set the 'model' property for the form component！"
          );
        }
      }
      $formRef.resetFields();
      this.$eventBus.$emit("resetDatePicker");
      this.resetDatepicker();
    },
  },
};
</script>
