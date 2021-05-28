<!--
 * @Author: 张淦
 * @Date: 2019-11-20 17:35:38
 * @LastEditors: zhanggan
 * @Description: 支付配置二期 入驻页修改
 * @FilePath: /gpay-ops-static/src/pages/merchant/enterApply/home.vue
 -->
<template>
  <div class="home">
    <div class="home_banner">
      <div class="home-img">
        <img src="../../../assets/images/home-icon-1.png" alt="" />
        <img src="../../../assets/images/home-icon-2.png" alt="" />
        <img src="../../../assets/images/home-icon-3.png" alt="" />
      </div>
      <div class="home_link">
        <router-link to="/enterApply/info"> 立即入驻 </router-link>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "Home",
};
</script>
<style lang="less" scoped>
.home {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  padding: 0px 16px;
  overflow: hidden;
  background-color: #fff;
  .home_banner {
    width: 100%;
    height: 640px;
    margin: 20px auto;
    overflow: hidden;
    background: url(../../../assets/images/home-back.png) no-repeat;
    background-size: cover;
    .home-img {
      display: -webkit-flex; /* Safari */
      display: flex;
      width: 640px;
      height: 160px;
      margin: 220px auto 80px;
      img {
        display: block;
        width: 160px;
        height: 160px;
        margin-right: 80px;
      }
      img:last-child {
        margin-right: 0;
      }
    }
    .home_link {
      width: 300px;
      padding: 15px 0;
      margin: 0 auto;
      text-align: center;
      background-color: #fff;
      border-radius: 26px;
      a {
        font-size: 20px;
        color: #1a67eb;
      }
    }
  }
}
</style>
