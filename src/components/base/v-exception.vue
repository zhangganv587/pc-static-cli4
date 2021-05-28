<template>
  <div class="exception">
    <img v-if="icon" class="exception--icon" :src="icon" />
    <p v-if="tipText" class="exception--tip">
      {{ tipText }}
    </p>
  </div>
</template>

<script>
export default {
  name: "Exceptiom",
  props: {
    icon: {
      type: String,
      default: "",
    },
    tipText: {
      type: String,
      default: "异常了！",
    },
  },
};
</script>
<style lang="less" scoped>
@exception: exception;

.@{exception} {
  display: flex;
  flex-direction: column;
  align-items: center;
  &--icon {
    width: 145px;
  }
  &--tip {
    margin-top: 32px;
    color: #a9b5ca;
  }
}
</style>
