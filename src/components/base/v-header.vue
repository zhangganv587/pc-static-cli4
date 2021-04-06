<!--
 * @Author: 张淦
 * @Date: 2020-02-25 11:09:51
 * @LastEditors: 张淦
 * @Description: 收银台PC端
 * @FilePath: /gpay-pc-static/src/components/base/v-header.vue
 -->
<template>
  <div class="header">
    <div class="header-box">
      <img class="icon-logo" src="../../../src/assets/images/new-wy-logo.png" />
      <div class="header--tip">支付</div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Exceptiom",
};
</script>
<style lang="less" scoped>
.header {
  width: 98%;
  height: 100px;
  margin: 0 auto;
  text-align: center;
  border-bottom: 3px solid #377bee;
  box-sizing: border-box;
  .header-box {
    display: -webkit-flex; /* Safari */
    display: flex;
    align-items: center;
    width: 980px;
    height: 100px;
    margin: 0 auto;
    .icon-logo {
      display: block;
      height: 60px;
      padding-right: 50px;
      margin-right: 20px;
      border-right: 1px solid #e4e4e4;
    }
    .header--tip {
      font-size: 26px;
    }
  }
}
</style>
