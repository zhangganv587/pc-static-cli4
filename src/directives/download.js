/*
 * @Author: langshuang1
 * @Date: 2019-12-19 18:11:49
 * @LastEditors: zhanggan
 * @Description:
 * @FilePath: /pc-static-cli4/src/directives/download.js
 */
// 处理下载逻辑
const handleDownload = (args) => {
  return () => {
    if (args && Object.keys(args).length > 0) {
      const { value: bindVal } = args.binding;
      let { formRef } = bindVal;
      formRef = formRef || "form";

      if (process.env.NODE_ENV !== "production") {
        if (!bindVal.dataRef) {
          console.error(
            "Please set the 'dataRef' property for the directive！"
          );
        } else if (!bindVal.dataRef.$refs[formRef]) {
          console.error(
            "There are no form components in the parent component！"
          );
        } else if (!bindVal.dataRef.$refs[formRef].model) {
          console.error(
            "Please set the 'model' property for the form component！"
          );
        }
      }

      const { dataRef, fetchUrl, fileName } = bindVal;
      const formData =
        dataRef && dataRef.$refs[formRef] && dataRef.$refs[formRef].model;
      // 发票前端限制导出
      const myform = { ...formData };
      if (Object.keys(myform).indexOf("billingStatus") > -1) {
        myform.billingStatus = 1;
        myform.enterpriseType = 0;
      }
      dataRef
        .$fetch(fetchUrl, {
          data: { ...myform, ...dataRef.pagination },
          responseType: "blob",
        })
        .then((blob) => {
          // 获取文件后缀
          const fileExt = blob.type && blob.type.split("/")[1];

          // 参考 https://blog.csdn.net/mobius_z/article/details/82790327
          const downloadElement = document.createElement("a");
          const href = window.URL.createObjectURL(blob);

          // 创建下载的链接
          downloadElement.href = href;

          // 下载后文件名
          downloadElement.download = `${fileName}.${fileExt || "xls"}`;
          document.body.appendChild(downloadElement);

          // 点击下载
          downloadElement.click();

          // 下载完成移除元素
          document.body.removeChild(downloadElement);
          window.URL.revokeObjectURL(href);
        });
    }
  };
};

export default {
  bind(el, binding, vnode) {
    el.addEventListener("click", handleDownload({ el, binding, vnode }));
  },
  unbind(el, binding, vnode) {
    el.removeEventListener("click", handleDownload({ el, binding, vnode }));
  },
};
