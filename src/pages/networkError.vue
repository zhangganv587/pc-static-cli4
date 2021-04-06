<!--
 * @Author: zhanggan
 * @Date: 2021-04-06 19:23:07
 * @LastEditors: zhanggan
 * @Description: 这里是描述
 * @FilePath: /pc-static-cli4/src/pages/networkError.vue
-->
<template>
  <div class="notpermission">
    <v-error tip-text="网络异常" />
  </div>
</template>
<script>
import VError from "@/components/base/v-error.vue";

export default {
  name: "NetworkError",
  components: {
    "v-error": VError,
  },
};
</script>
