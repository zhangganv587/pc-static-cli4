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
