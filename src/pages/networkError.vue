<template>
  <div class="notpermission">
    <v-exception
      :icon="require('@/assets/images/network.png')"
      tip-text="网络异常"
    />
  </div>
</template>
<script>
import VException from "@/components/base/v-exception.vue";

export default {
  name: "NetworkError",
  components: {
    "v-exception": VException,
  },
};
</script>
