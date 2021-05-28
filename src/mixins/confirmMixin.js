/*
 * @Author: zhanggan
 * @Date: 2020-10-15 15:19:16
 * @LastEditors: zhanggan
 * @FilePath: /gpay-ops-static/src/mixins/confirmMixin.js
 */
export default {
  methods: {
    handleCommonConfirm(id, url, text, datalist) {
      this.$confirm(`您确定要${text}吗？`, "提示", {
        dangerouslyUseHTMLString: true,
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          const loading = this.$loading({
            lock: true,
            text: "Loading",
            spinner: "el-icon-loading",
            background: "rgba(255, 255, 255, 0.7)",
          });
          const data = datalist
            ? { accountMemberId: id, ...datalist }
            : { accountMemberId: id };
          this.$fetch(url, {
            method: "post",
            data: data,
          }).then((res) => {
            loading.close();
            // 0 成功，1 失败
            if (res.data.status === 0) {
              this.$message(res.data.msg);
            } else {
              this.$message.warning(res.data.msg);
            }
            this.$refs.formSubmit.handleSearch();
          });
        })
        .catch(() => {});
    },
  },
};
