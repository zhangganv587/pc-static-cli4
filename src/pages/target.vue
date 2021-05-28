<!--
 * @Author: 张淦
 * @Date: 2020-01-16 15:54:23
 * @LastEditors: zhanggan
 * @Description: 商户开始的跳转页
 * @FilePath: /gpay-ops-static/src/pages/target.vue
 -->
<template>
  <div />
</template>
<script>
export default {
  name: "UrlTarget",
  created() {
    this.targetUrl();
  },
  methods: {
    targetUrl() {
      this.$fetch("/pay/home/jump.json", {
        method: "post",
      }).then((res) => {
        if (res.code === 0) {
          const urlArr = ["/home", "/enterApply", "/business/list"];
          this.$router.push({ path: urlArr[res.data] });
        }
      });
    },
  },
};
</script>
