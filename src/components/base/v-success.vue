<!--
 * @Author: 张淦
 * @Date: 2020-02-25 14:34:29
 * @LastEditors: zhanggan
 * @Description: 收银台PC端
 * @FilePath: /gpay-pc-static/src/components/base/v-success.vue
 -->
<template>
  <div ref="exception" class="exception">
    <i class="el-icon-success exception--icon" />
    <div v-if="tipText" class="exception--tip">
      {{ tipText }}
    </div>
  </div>
</template>

<script>
export default {
  name: "Success",
  props: {
    tipText: {
      type: String,
      default: "成功！",
    },
  },
  data() {
    return {
      clientHeight: "",
    };
  },
  watch: {
    clientHeight: function () {
      this.changeFixed(this.clientHeight);
    },
  },
  mounted() {
    this.clientHeight = `${document.documentElement.clientHeight}`;
  },
  methods: {
    changeFixed(clientHeight) {
      this.$refs.exception.style.marginBottom = clientHeight - 620 + "px";
    },
  },
};
</script>
<style lang="less" scoped>
@exception: exception;

.@{exception} {
  display: -webkit-flex; /* Safari */
  display: flex;
  justify-content: center;
  align-items: center;
  width: 980px;
  padding: 45px 0;
  margin: 20px auto;
  background: #f1fbeb;
  border: 1px solid #62cb3f;
  box-sizing: border-box;
  &--icon {
    display: block;
    margin-right: 20px;
    font-size: 50px;
    line-height: 50px;
    color: #62cb3f;
  }
  &--tip {
    font-size: 30px;
  }
}
</style>
