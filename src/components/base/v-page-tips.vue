<!--
 * @Author: 张淦
 * @Date: 2019-12-17 10:11:20
 * @LastEditors: zhanggan
 * @Description: 商户2.0 提交结果页
 * @FilePath: /gpay-ops-static/src/components/base/v-page-tips.vue
 -->
<template>
  <div class="page-tip">
    <div class="sure-box">
      <img src="../../assets/images/tip-group.png" alt="" />
      <h3>提交成功</h3>
      <p>
        相关人员将会在2个工作日内进行审核<br />审核结果将以短信方式通知到手机{{
          phone
        }}请注意查收
      </p>
      <el-button type="primary" @click="targetUrl"> 知道了 </el-button>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      phone: "",
    };
  },
  created() {
    this.phone = this.$route.params.phone;
  },
  methods: {
    targetUrl() {
      if (this.$store.state.userRoles.includes("/business/admin")) {
        this.$router.push({ path: "/business/admin" });
      } else {
        this.$router.push({ path: "/business/list" });
      }
    },
  },
};
</script>
<style lang="less" scoped>
.page-tip {
  width: 100%;
  padding: 60px;
  background: rgba(248, 250, 254, 1);
  border-radius: 4px;
  .sure-box {
    width: 370px;
    margin: 0 auto;
    img {
      display: block;
      width: 48px;
      height: 48px;
      margin: 0 auto 16px;
    }
    h3 {
      margin-bottom: 24px;
      font-family: PingFangSC-Medium, PingFang SC;
      font-size: 24px;
      font-weight: 500;
      line-height: 28px;
      color: rgba(52, 56, 75, 1);
      text-align: center;
    }
    p {
      margin-bottom: 40px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-size: 14px;
      font-weight: 400;
      line-height: 24px;
      color: rgba(140, 154, 180, 1);
      text-align: center;
    }
    .el-button {
      display: block;
      margin: 0 auto;
    }
  }
}
</style>
