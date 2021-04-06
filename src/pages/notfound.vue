<!--
 * @Author: zhanggan
 * @Date: 2021-04-06 19:23:07
 * @LastEditors: zhanggan
 * @Description: 这里是描述
 * @FilePath: /pc-static-cli4/src/pages/notfound.vue
-->
<template>
  <div class="notfound">
    <v-exception
      :icon="require('@/assets/images/notfound.png')"
      tip-text="页面没有找到"
    />
  </div>
</template>
<script>
import VException from "@/components/base/v-exception.vue";

export default {
  name: "NotFound",
  components: {
    "v-exception": VException,
  },
};
</script>
