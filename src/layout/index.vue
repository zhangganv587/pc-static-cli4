<!--
 * @Author: 张淦
 * @Date: 2020-02-13 09:56:46
 * @LastEditors: zhanggan
 * @Description: layout
 * @FilePath: /pc-static-cli4/src/layout/index.vue
 -->
<template>
  <div class="layout">
    <el-container>
      <el-header class="layout--header" style="height: 100px">
        <v-header />
      </el-header>
      <el-main class="layout--container_main">
        <router-view />
      </el-main>
      <el-footer class="layout--footer" style="height: 265px">
        <v-footer />
      </el-footer>
    </el-container>
  </div>
</template>

<script>
import VHeader from "components/base/v-header";
import VFooter from "components/base/v-footer";

export default {
  name: "Layout",
  components: {
    VHeader,
    VFooter,
  },
  data() {
    return {};
  },
  computed: {},
  watch: {},
  methods: {},
};
</script>
