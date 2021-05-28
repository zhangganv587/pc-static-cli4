<!--
 * @Author: zhanggan
 * @Date: 2021-04-06 13:51:32
 * @LastEditors: zhanggan
 * @Description: app.vue
 * @FilePath: /pc-static-cli4/src/App.vue
-->
<template>
  <div>
    <v-layout />
    <v-api v-if="showApi" />
  </div>
</template>
<script>
import VLayout from "./layout/index";
import VApi from "components/base/v-api";
export default {
  name: "App",
  components: {
    "v-layout": VLayout,
    "v-api": VApi,
  },
  data() {
    return {
      showApi: false,
    };
  },
  created() {
    // 是否是测试环境
    this.showApi = window.location.hostname.includes("guahao-test.com");
  },
  mounted() {},
};
</script>
