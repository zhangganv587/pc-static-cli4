<!--
 * @Author: 张淦
 * @Date: 2019-11-20 17:35:38
 * @LastEditors: zhanggan
 * @Description: 商户2.0首页修改
 * @FilePath: /gpay-ops-static/src/pages/home/index.vue
 -->
<template>
  <div style="overflow: hidden; width: 100%; height: 100%">
    <div class="page-box">
      <iframe ref="iframe" class="iframe-box" :src="src" />
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      src: "",
    };
  },
  created() {
    if (
      location.href.indexOf("guahao.cn") > -1 ||
      location.href.indexOf("guahao.com") > -1
    ) {
      this.src = "https://gpay-merchant.guahao.com/#/work";
    } else {
      this.src = "http://gpay-merchant-static-qa1.guahao-test.com/#/work";
    }
  },
};
</script>
<style lang="less" scoped>
.page-box {
  margin-top: -64px;
  margin-left: -263px;
}
.iframe-box {
  width: 100%;
  height: 100%;
}

@media screen and (min-width: 1700px) {
  .page-box {
    height: 900px;
  }
}

@media screen and (max-width: 1700px) {
  .page-box {
    height: 600px;
  }
}
</style>
