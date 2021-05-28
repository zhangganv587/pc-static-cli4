<template>
  <el-button
    type="primary"
    size="small"
    narrow
    :loading="loading"
    :disabled="loading"
    @click="handleSearch('clickSearch')"
  >
    <template v-if="$slots.default">
      <slot />
    </template>
    <template v-else>
      {{ text }}
    </template>
  </el-button>
</template>
<script>
export default {
  name: "VFormSubmit",
  props: {
    action: {
      type: String,
      default: "",
    },
    text: {
      type: String,
      default: "查询",
    },
    formRef: {
      type: Object,
      default: () => null,
    },
    immediate: {
      type: Boolean,
      default: false,
    },
    pagination: {
      type: Object,
      default: () => null,
    },
  },
  computed: {
    loading() {
      return this.$store.state.effectLoading[this.action];
    },
  },
  watch: {
    pagination() {
      this.handleSearch();
    },
  },
  created() {
    if (this.immediate) {
      // 确保所有查询条件的初始值都加载完成
      this.$nextTick(() => {
        this.handleSearch();
      });
    }
  },
  methods: {
    search() {
      this.handleSearch("clickSearch");
    },
    handleSearch(clickFlag) {
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
      // console.log($formRef.model);

      for (const i in $formRef.model) {
        if ($formRef.model[i] === "") {
          $formRef.model[i] = null;
        }
      }

      // 点击查询按钮时重置分页信息
      let resetPagination = {};

      if (clickFlag === "clickSearch") {
        resetPagination = {
          pageIndex: 1,
          totalNum: 0,
        };
      }
      $formRef.validate((valid) => {
        if (valid) {
          this.$fetch(this.action, {
            data: {
              ...$formRef.model,
              ...this.pagination,
              ...resetPagination,
            },
          }).then((res) => {
            this.$emit("click:search", res);
          });
        }
      });
    },
  },
};
</script>
