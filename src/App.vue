<!--
 * @Author: zhanggan
 * @Date: 2021-04-13 10:52:42
 * @LastEditors: zhanggan
 * @Description: app
 * @FilePath: /pc-static-cli4/src/App.vue
-->
<template>
  <div id="app">
    <v-layout></v-layout>
    <v-preview-dialog />
  </div>
</template>

<script>
import { types } from "./store";
import VLayout from "@/layout/index";
import VPreviewDialog from "./components/base/v-preview-dialog";
export default {
  name: "App",
  components: {
    "v-layout": VLayout,
    "v-preview-dialog": VPreviewDialog,
  },
  created() {
    this.$store.dispatch({
      type: "setUserRoles",
    });
  },
  mounted() {
    // dialog 显示、隐藏事件
    this.$eventBus.$on("dialog-visible", (dialogPayload) => {
      this.$store.commit(types.DIALOG_VISIBLE, dialogPayload);
    });

    // dialog 图片预览
    this.$eventBus.$on("dialog-upload-preview", (payload) => {
      this.$store.commit(types.DIALOG_PREVIEW_STATUS, payload);
    });
  },
};
</script>

<style></style>
