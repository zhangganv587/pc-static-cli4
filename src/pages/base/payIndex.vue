<!--
 * @Author: 张淦
 * @Date: 2020-03-02 11:25:26
 * @LastEditors: zhanggan
 * @Description: 收银台PC端-基础版（支付页）
 * @FilePath: /gpay-pc-static/src/pages/base/payIndex.vue
 -->
<template>
  <div class="pay-base">
    <vError v-show="shownfalse" tip-text="支付单号不能为空" />
    <payHeader v-show="!shownfalse" :pay-info="payInfo" />
    <payInsurance
      v-show="!shownfalse && miSettleData"
      :mi-settle-data="miSettleData"
    />
    <div v-show="!shownfalse" class="pay-ways">
      <div class="pay-title">自费:</div>
      <el-radio-group v-model="activeName" size="small">
        <el-radio-button label="在线支付" />
        <el-radio-button label="线下支付" />
      </el-radio-group>
      <div v-show="activeName === '在线支付'" class="pay-list">
        <div
          v-for="online in onLineType"
          :key="online.payWay"
          class="pay-box"
          @click="handleOnLineRadio(online.payWay)"
        >
          <img
            class="pay-box-icon"
            :src="onLineIndex === online.payWay ? radioChecked : radioCheck"
          />
          <img class="pay-box-img" :src="online.imgUrl" />
          <p>{{ online.payWayName }}</p>
        </div>
      </div>
      <div v-show="activeName === '线下支付'" class="pay-list">
        <div class="pay-box" @click="handleUnderLineRadio('cashpay', '现金')">
          <img
            class="pay-box-icon"
            :src="underLineIndex === 'cashpay' ? radioChecked : radioCheck"
          />
          <img class="pay-box-img" src="../../assets/images/cash.png" />
          <p>现金</p>
        </div>
        <div
          class="pay-box"
          @click="handleUnderLineRadio('alipay_pos', '支付宝(pos)')"
        >
          <img
            class="pay-box-icon"
            :src="underLineIndex === 'alipay_pos' ? radioChecked : radioCheck"
          />
          <img class="pay-box-img" src="../../assets/images/alipay.png" />
          <p>支付宝(pos)</p>
        </div>
        <div
          class="pay-box"
          @click="handleUnderLineRadio('wxpay_pos', '微信(pos)')"
        >
          <img
            class="pay-box-icon"
            :src="underLineIndex === 'wxpay_pos' ? radioChecked : radioCheck"
          />
          <img class="pay-box-img" src="../../assets/images/wxpay.png" />
          <p>微信(pos)</p>
        </div>
        <div
          class="pay-box"
          @click="handleUnderLineRadio('unionpay', '银行卡(pos)')"
        >
          <img
            class="pay-box-icon"
            :src="underLineIndex === 'unionpay' ? radioChecked : radioCheck"
          />
          <img
            class="pay-box-img"
            style="height: 25px"
            src="../../assets/images/bankcard.png"
          />
          <p>银行卡(pos)</p>
        </div>
      </div>
      <div class="pay-submit" @click="handleSubmit">立即支付</div>
    </div>
    <onLineDialog
      :on-line-form-visible="onLineFormVisible"
      :on-line-index="onLineIndex"
      :pay-info="payInfo"
    />
    <underLineDialog
      :under-line-form-visible="underLineFormVisible"
      :under-line-index="underLineIndex"
      :pay-info="payInfo"
      :pay-title="payTitle"
    />
  </div>
</template>

<script>
import vError from "@/components/base/v-error";
import payHeader from "./payHeader";
import onLineDialog from "./onLineDialog";
import underLineDialog from "./underLineDialog.vue";
import payInsurance from "./payInsurance";
import { mapActions } from "vuex";
import radioCheck from "../../assets/images/radioCheck.png";
import radioChecked from "../../assets/images/radioChecked.png";

export default {
  name: "Index",
  components: {
    vError,
    payHeader,
    payInsurance,
    onLineDialog,
    underLineDialog,
  },
  data() {
    return {
      shownfalse: true,
      payInfo: {
        prePayId: null,
        bizOrderNo: null,
        title: null,
        body: null,
        status: null,
        totalAmount: null,
        payAmount: null,
        checkReturn: null,
        criticals: [],
        expiredTime: null,
        miSettleData: null,
        orderCreateDate: null,
        paidTime: null,
        payWayCode: null,
        payways: [],
        platId: null,
        remainingTime: null,
        returnUri: null,
        sourceId: null,
      },
      miSettleData: {
        money: null,
        miMoney: null,
        feeMoney: null,
        accountMoney: null,
        cashMoney: null,
        miCenterName: null,
        imgUrl: null,
      },
      radioCheck: radioCheck,
      radioChecked: radioChecked,
      onLineType: [],
      onLineIndex: "",
      underLineType: [],
      underLineIndex: "cashpay",
      payTitle: "现金",
      activeName: "在线支付",
      // polling
      timeoutID: null,
      // dialog
      onLineFormVisible: false,
      underLineFormVisible: false,
    };
  },
  created() {
    if (this.$route.query.prePayId) {
      this.shownfalse = false;
      this.getInfo();
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
        // 信息存入state
        this.payInfo = res;
        // 0待支付,1支付成功,3超时未支付,2支付失败
        switch (res.status) {
          case 1:
            if (res.checkReturn === 0) {
              location.href = res.returnUri;
            } else {
              this.$router.push({
                path: "/result",
                query: { prePayId: this.$route.query.prePayId },
              });
            }
            break;
          case 2:
          case 3:
            this.$router.push({
              path: "/result",
              query: { prePayId: this.$route.query.prePayId },
            });
            break;
          case 0:
            Object.keys(this.payInfo).forEach((key) => {
              this.payInfo[key] = res[key];
            });
            this.miSettleData = this.payInfo.miSettleData;
            if (res.payways.length && this.onLineIndex === "") {
              this.onLineType = res.payways;
              this.onLineIndex = res.payways[0].payWay;
            }
        }
      });
    },
    pollingInfo() {
      clearTimeout(this.timeoutID);
      // 轮询查找
      this.timeoutID = setTimeout(() => {
        this.getInfo();
        this.pollingInfo();
      }, 5000);
    },
    handleOnLineRadio(val) {
      this.onLineIndex = val;
    },
    handleUnderLineRadio(val, payTitle) {
      this.underLineIndex = val;
      this.payTitle = payTitle;
    },
    handleSubmit() {
      this.pollingInfo();
      if (this.activeName === "在线支付") {
        this.onLineFormVisible = true;
      } else {
        this.underLineFormVisible = true;
      }
    },
    closeDialog() {
      this.onLineFormVisible = false;
      this.underLineFormVisible = false;
    },
  },
};
</script>

<style lang="less" scoped>
.pay-base {
  min-height: 200px;
}
.pay-ways {
  width: 980px;
  margin: 0 auto 40px;
  overflow: hidden;
  color: #444;
  .pay-title {
    padding: 10px 0 20px;
    font-size: 18px;
    font-weight: 400;
  }
  .pay-insurance {
    -webkit-dispplay: flex;
    display: flex;
    align-items: center;
    .insurance-icon {
      display: block;
      width: 50px;
      height: 50px;
      margin-right: 20px;
    }
    .insurance-title {
      height: 18px;
      margin-right: 20px;
      font-size: 18px;
      font-weight: 400;
    }
    .deduction-money {
      margin-right: 20px;
      font-size: 16px;
      font-weight: 400;
    }
    .self-money {
      display: inline-block;
      margin-right: 20px;
      font-size: 12px;
      font-weight: 400;
    }
    .common-money {
      display: inline-block;
      font-size: 12px;
      font-weight: 400;
    }
  }
  .pay-tips {
    padding: 0 0 30px;
    font-size: 12px;
    font-weight: 400;
  }
  .pay-tab {
    height: 35px;
  }
  .constantly-money {
    margin-top: 20px;
    font-size: 16px;
    font-weight: 400;
  }
  .pay-list {
    width: 980px;
    padding-top: 20px;
    .pay-box {
      display: flex;
      align-items: center;
      height: 74px;
      padding: 20px 30px;
      margin-bottom: 20px;
      border: 2px solid #dff2ff;
      box-sizing: border-box;
      .pay-box-icon {
        width: 20px;
        height: 20px;
        margin-right: 20px;
      }
      .pay-box-img {
        width: 32px;
        height: 32px;
        margin-right: 20px;
      }
      p {
        font-family: PingFangSC, PingFangSC-Medium;
        font-size: 16px;
        font-weight: 500;
        line-height: 16px;
        color: #333;
      }
    }
  }
  .pay-submit {
    width: 137px;
    padding: 12px 20px;
    margin: 20px 0 0 840px;
    font-size: 16px;
    color: #fff;
    text-align: center;
    cursor: pointer;
    background: #f90;
    border: none;
    border-radius: 4px;
  }
}
</style>
