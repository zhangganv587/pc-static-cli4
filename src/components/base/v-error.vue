<!--
 * @Author: 张淦
 * @Date: 2020-02-25 14:34:29
 * @LastEditors: zhanggan
 * @Description: 收银台PC端
 * @FilePath: /gpay-pc-static/src/components/base/v-error.vue
 -->
<template>
  <div ref="baseSuc" class="baseSuc">
    <i class="el-icon-error baseSuc--icon" />
    <div v-if="tipText" class="baseSuc--tip">错误信息：{{ tipText }}</div>
  </div>
</template>

<script>
export default {
  name: "Error",
  props: {
    tipText: {
      type: String,
      default: "异常了！",
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
      this.$refs.baseSuc.style.marginBottom = clientHeight - 620 + "px";
    },
  },
};
</script>
<style lang="less" scoped>
@baseSuc: baseSuc;

.@{baseSuc} {
  display: -webkit-flex; /* Safari */
  display: flex;
  justify-content: center;
  align-items: center;
  width: 980px;
  padding: 45px 0;
  margin: 20px auto;
  background: #fff2f3;
  border: 1px solid #f35e5e;
  box-sizing: border-box;
  &--icon {
    display: block;
    margin-right: 20px;
    font-size: 50px;
    line-height: 50px;
    color: #f35e5e;
  }
  &--tip {
    font-size: 30px;
  }
}
</style>
