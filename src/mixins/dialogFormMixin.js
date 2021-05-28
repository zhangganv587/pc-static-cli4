export default {
  props: {
    rowData: {
      type: Object,
      default() {
        return {};
      },
    },
  },
  data() {
    // 用于重置表单数据
    this.cacheRow = {};
  },
  computed: {
    isConfirming() {
      const currentData = this.formModel.id
        ? this.submitFormArr[1]
        : this.submitFormArr[0];
      return this.$store.state.effectLoading[currentData.url];
    },
  },
  methods: {
    // 处理表单提交
    handleSubmit({ fetchData, callback }) {
      if (!this.isEditDisabled) {
        this.$refs.dialogFormRef.validate((valid) => {
          if (!valid) {
            return;
          }

          const currentData = this.formModel.id
            ? this.submitFormArr[1]
            : this.submitFormArr[0];

          this.$fetch(currentData.url, {
            method: "post",
            data: fetchData,
          }).then((res) => {
            if (res.code === 0) {
              this.$message({
                type: "success",
                message: `${currentData.message}成功！`,
              });

              this.$parent.$refs.formSubmit.handleSearch();
              this.handleResetForm(callback);
            }
          });
        });
      } else {
        this.handleResetForm(callback);
      }
    },

    // 重置表单
    handleResetForm(callback) {
      this.handleEditable(!!this.formModel.id);
      this.formModel = { ...this.cacheRow };
      this.$nextTick(() => {
        this.$refs.dialogFormRef.clearValidate();
      });
      callback && callback();
    },

    // 处理 dialog 编辑状态
    handleEditable(val) {
      this.isEditDisabled = val;
    },
  },
};
