export default {
  methods: {
    handleProhibit(id, status, pageTitle = "", supplementValue = "") {
      const currentData = this.prohibitArr[status];
      let html = "";
      if (supplementValue) {
        html = supplementValue;
      } else {
        html = `您确定要${currentData.message}该${pageTitle}吗？`;
      }

      this.$confirm(html, "提示", {
        dangerouslyUseHTMLString: true,
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.$fetch(currentData.url, {
            method: "post",
            data: {
              id,
            },
          }).then((res) => {
            if (res.code === 0) {
              this.$message({
                type: "success",
                message: `${currentData.message}成功`,
              });
              this.$refs.formSubmit.handleSearch();
            } else {
              this.$message({
                type: "error",
                message: `${currentData.message}失败`,
              });
            }
          });
        })
        .catch(() => {});
    },
  },
};
