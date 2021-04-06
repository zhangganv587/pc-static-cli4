<!--
 * @Author: zhanggan
 * @Date: 2020-08-27 16:48:49
 * @LastEditors: zhanggan
 * @FilePath: /gpay-pc-static/src/pages/base/payResult.vue
-->
<template>
  <div class="pay-result">
    <vError v-show="shownfalse" tip-text="支付单号不能为空" />
    <div v-show="!shownfalse">
      <i
        v-if="payResult.payStatus === 'suc'"
        class="el-icon-success icon-style icon-green"
      />
      <i
        v-if="payResult.payStatus === 'fail'"
        class="el-icon-error icon-style icon-red"
      />
      <p
        v-if="payResult.payStatus === 'suc'"
        class="pay-result-title icon-green"
      >
        支付成功
      </p>
      <p
        v-if="payResult.payStatus === 'fail'"
        class="pay-result-title icon-red"
      >
        支付失败
      </p>
      <p v-if="payResult.payStatus === 'fail'" class="pay-result-msg">
        失败：{{ payResult.errorMsg }}
      </p>
      <div class="pay-desc">
        <div class="pay-desc-text">
          <p>订单描述：{{ payInfo.body }}</p>
          <p>订单编号：{{ payInfo.bizOrderNo }}</p>
          <p>提交时间：{{ orderCreateDate }}</p>
        </div>
        <div class="pay-desc-money">
          <p>
            订单金额：
            <span>{{ payInfo.totalAmount | checkxPrice }}</span
            >元
          </p>
          <!-- <p>医保抵扣：{{ payInfo.insuranceData.miMoney | checkxPrice }}</p>
          <p>（个帐支付：{{ payInfo.insuranceData.accountMoney | checkxPrice }}元 统筹支付:{{ payInfo.insuranceData.feeMoney | checkxPrice }}元)）</p>-->
          <p>
            实付金额：
            <i>
              <span>{{ payInfo.payAmount | checkxPrice }}</span
              >元
            </i>
          </p>
        </div>
      </div>
      <div class="pay-target" @click="handleTarget">确定</div>
    </div>
  </div>
</template>
<script>
import { mapActions } from "vuex";
import vError from "@/components/base/v-error";
export default {
  components: {
    vError,
  },
  data() {
    return {
      shownfalse: true,
      orderCreateDate: "",
      // 当前支付信息
      payInfo: {
        body: null,
        bizOrderNo: null,
        orderCreateDate: null,
        totalAmount: null,
        payAmount: null,
      },
      // 当前支付结果信息
      payResult: {
        payStatus: null,
        errorMsg: null,
      },
    };
  },
  mounted() {
    this.getInfo();
    if (this.$route.query.prePayId) {
      this.shownfalse = false;
    } else {
      this.shownfalse = true;
    }
  },
  methods: {
    ...mapActions({
      getInfoByMedicalInsure: "base/getInfoByMedicalInsure",
    }),
    getInfo() {
      this.getInfoByMedicalInsure({
        prePayId: this.$route.query.prePayId,
      }).then((res) => {
        console.log(res);
        this.payInfo = res;
        this.orderCreateDate = this.$common.formatter(res.orderCreateDate);
        // 0待支付,1支付成功,3超时未支付,2支付失败
        switch (res.status) {
          case 1:
            if (res.checkReturn === 0) {
              location.href = res.returnUri;
            } else {
              this.payResult = {
                payStatus: "suc",
              };
            }
            break;
          case 2:
            this.payResult = {
              payStatus: "fail",
              errorMsg: "支付失败，请重新下单",
            };
            break;
          case 3:
            this.payResult = {
              payStatus: "fail",
              errorMsg: "支付超时，请重新下单",
            };
            break;
          case 0:
            // 虽然后台会变状态 但是有延迟 所以还是要加
            if (this.$route.query.timeOut === "true") {
              this.payResult = {
                payStatus: "fail",
                errorMsg: "支付超时，请重新下单",
              };
            } else {
              this.$router.push({
                path: "/index",
                query: { prePayId: this.$route.query.prePayId },
              });
            }
            break;
        }
      });
    },
    handleTarget() {
      location.href = this.payInfo.returnUri;
    },
  },
};
</script>
>
<style lang="less" scoped>
.pay-result {
  width: 980px;
  height: 378px;
  padding: 30px 160px;
  margin: 0 auto 100px;
  background: #fff;
  box-shadow: 0px 0px 10px 0px rgba(43, 49, 61, 0.06);
  .icon-style {
    display: block;
    width: 48px;
    margin: 0 auto 18px;
    font-size: 48px;
  }
  .icon-red {
    color: #ea6953;
  }
  .icon-green {
    color: #5ba946;
  }
  .pay-result-title {
    font-family: PingFangSC, PingFangSC-Medium;
    font-size: 18px;
    font-weight: 500;
    line-height: 18px;
    text-align: center;
  }
  .pay-result-msg {
    margin-top: 10px;
    font-family: PingFangSC, PingFangSC-Regular;
    font-size: 14px;
    font-weight: 400;
    line-height: 14px;
    color: #333;
    text-align: center;
  }
  .pay-desc {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px 0 57px;
    margin-top: 30px;
    border-top: 1px solid #eceef5;
  }
  .pay-desc-text {
    p {
      margin-bottom: 10px;
      font-family: PingFangSC, PingFangSC-Regular;
      font-size: 14px;
      font-weight: 400;
      line-height: 14px;
      color: #888;
    }
  }
  .pay-desc-money {
    p {
      margin-bottom: 10px;
      font-family: PingFangSC, PingFangSC-Regular;
      font-size: 14px;
      font-weight: 400;
      line-height: 14px;
      color: #333;
      i {
        color: #f90;
      }
      span {
        font-weight: 600;
      }
    }
  }
  .pay-target {
    width: 140px;
    height: 40px;
    margin: 0 auto;
    font-family: PingFangSC, PingFangSC-Medium;
    font-size: 16px;
    font-weight: 500;
    line-height: 40px;
    color: #fff;
    text-align: center;
    cursor: pointer;
    background: #377bee;
    border-radius: 4px;
  }
}
</style>
>
