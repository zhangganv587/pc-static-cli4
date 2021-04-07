<!--
 * @Author: zhanggan
 * @Date: 2021-04-06 13:51:32
 * @LastEditors: zhanggan
 * @Description: app.vue
 * @FilePath: /pc-static-cli4/src/App.vue
-->
<template>
  <div id="app">
    <Layout />
    <Api v-if="showApi" />
  </div>
</template>
<script>
import Layout from "./layout/index";
import Api from "components/base/v-api";
export default {
  name: "App",
  components: {
    Layout,
    Api,
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
