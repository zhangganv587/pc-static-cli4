<template>
  <div class="notpermission">
    <v-exception
      :icon="require('@/assets/images/notpremission.png')"
      tip-text="暂无权限访问页面"
    />
  </div>
</template>
<script>
import VException from "@/components/base/v-exception.vue";

export default {
  name: "NotPremission",
  components: {
    "v-exception": VException,
  },
};
</script>
<style lang="less" scoped>
.notpermission {
  margin-top: 100px;
}
</style>
