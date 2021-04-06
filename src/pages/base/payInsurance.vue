<!--
 * @Author: 张淦
 * @Date: 2020-03-02 11:25:26
 * @LastEditors: zhanggan
 * @Description: 收银台PC端-医保组件
 * @FilePath: /gpay-pc-static/src/pages/base/payInsurance.vue
 -->
<template>
  <div class="pay-way-insurance">
    <div class="pay-title">医保：</div>
    <div class="pay-insurance">
      <div class="pay-insurance-header">
        <img class="insurance-icon" :src="insuranceData.imgUrl" alt />
        <div class="insurance-title">
          {{ insuranceData.miCenterName }}
        </div>
      </div>
      <div class="insurance-money">
        <div class="deduction-money">
          医保支付：
          <span style="color: #ea6953">{{
            insuranceData.miMoney | checkxPrice
          }}</span
          >元
        </div>
        <div class="contain-money">
          <span class="self-money"
            >个账支付：{{ insuranceData.accountMoney | checkxPrice }}元</span
          >
          <span class="common-money"
            >统筹支付：{{ insuranceData.feeMoney | checkxPrice }}元</span
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    miSettleData: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      insuranceData: {
        money: null,
        miMoney: null,
        feeMoney: null,
        accountMoney: null,
        cashMoney: null,
        miCenterName: null,
        imgUrl: null,
      },
    };
  },
  watch: {
    miSettleData(newVal) {
      console.log(newVal);
      Object.keys(this.insuranceData).forEach((key) => {
        this.insuranceData[key] = newVal[key];
      });
    },
  },
};
</script>

<style lang="less" scoped>
.pay-way-insurance {
  width: 980px;
  margin: 0 auto 40px;
  color: #444;
  .pay-title {
    margin-bottom: 16px;
    font-family: PingFangSC, PingFangSC-Medium;
    font-size: 18px;
    font-weight: 500;
    line-height: 24px;
    color: #333;
  }
  .pay-insurance {
    width: 980px;
    height: 136px;
    background: #fff;
    border: 2px solid #dff2ff;
    .pay-insurance-header {
      display: flex;
      padding: 17px 30px;
      background: #f1faff;
      .insurance-icon {
        display: block;
        width: 20px;
        height: 16px;
        margin-right: 10px;
      }
      .insurance-title {
        font-family: PingFangSC, PingFangSC-Medium;
        font-size: 16px;
        font-weight: 500;
        line-height: 16px;
        color: #666;
      }
    }
    .insurance-money {
      padding: 20px 60px;
      .deduction-money {
        margin-bottom: 16px;
        font-family: PingFangSC, PingFangSC-Medium;
        font-size: 16px;
        font-weight: 500;
        line-height: 14px;
        color: #333;
      }
      .self-money {
        display: inline-block;
        margin-right: 20px;
        font-family: PingFangSC, PingFangSC-Regular;
        font-size: 14px;
        font-weight: 400;
        line-height: 16px;
        color: #999;
      }
      .common-money {
        display: inline-block;
        font-family: PingFangSC, PingFangSC-Regular;
        font-size: 14px;
        font-weight: 400;
        line-height: 16px;
        color: #999;
      }
    }
  }
}
</style>
