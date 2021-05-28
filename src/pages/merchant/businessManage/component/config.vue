<template>
  <div class="business-config">
    <v-form-card title="收款账号信息">
      <div class="config-account">
        <div class="account-title">收款方式：</div>
        <div class="account-content">
          <span style="color: #34384b">代收</span>
          <span style="font-size: 12px"
            >(代收为资金先收入微医集团的收款账号再按固定时间结算给对应商家)</span
          >
        </div>
      </div>
      <div v-show="payments.length" class="config-account">
        <div class="account-title">收款账号：</div>
        <div
          v-for="(payment, index) in payments"
          :key="index"
          class="account-content"
        >
          <div class="config-payment">
            <img class="payment-icon" :src="payment.icon" />
            <div class="payment-content">
              <h3>{{ payment.payWayName }}</h3>
              <p>{{ payment.accountNo }}</p>
              <p>{{ payment.companyName }}</p>
            </div>
          </div>
        </div>
      </div>
    </v-form-card>
    <v-form-card title="支付场景">
      <div class="tab-box">
        <el-radio-group v-model="scene" size="medium" @change="changeScene">
          <el-radio-button label="手机支付场景" />
          <el-radio-button label="电脑支付场景" />
        </el-radio-group>
        <p v-show="scene === '手机支付场景'">
          <vit-icon
            type="info-circle"
            size="samll"
          />用户在手机上购买商品完成支付需要用到下方的支付产品，请根据业务需求选取合适的支付产品进行对接
        </p>
        <p v-show="scene === '电脑支付场景'">
          <vit-icon
            type="info-circle"
            size="samll"
          />用户在电脑上购买商品完成支付需要使用到下方的支付产品，请根据业务需求选取合适的支付产品进行对接
        </p>
      </div>
      <div v-show="payAccount.wxpay" class="sence-title">
        微信产品开通情况({{ payAccount.wxpay }})
      </div>
      <div v-show="payAccount.wxpay" class="pay-list">
        <div
          v-for="(pay, index) in wechart[chooseStyle]"
          :key="index"
          class="pay-box"
        >
          <div class="box-top">
            <img :src="pay.icon" />
            <div class="box-content">
              <h3>{{ pay.productName }}</h3>
              <div class="content-div">
                <div class="content-title">产品介绍:</div>
                <div class="content-text">
                  {{ pay.desc }}
                </div>
              </div>
              <div class="content-div">
                <div class="content-title">收款账号:</div>
                <div class="content-text">
                  {{ payAccount.wxpay }}
                </div>
              </div>
            </div>
          </div>
          <div v-show="pay.state" class="box-click">
            <vit-icon type="select-picture" size="small" class="iconfont" />
            <span style="width: 4px" />
            <span>已开通</span>
          </div>
          <div v-show="!pay.state" class="box-click">
            <span class="click-open" @click="apply(pay, payAccount.wxpay)"
              >申请开通</span
            >
          </div>
        </div>
      </div>
      <div v-show="payAccount.alipay" class="sence-title">
        支付宝产品开通情况({{ payAccount.alipay }})
      </div>
      <div v-show="payAccount.alipay" class="pay-list">
        <div
          v-for="(pay, index) in alipay[chooseStyle]"
          :key="index"
          class="pay-box"
        >
          <div class="box-top">
            <img :src="pay.icon" />
            <div class="box-content">
              <h3>{{ pay.productName }}</h3>
              <div class="content-div">
                <div class="content-title">产品介绍:</div>
                <div class="content-text">
                  {{ pay.desc }}
                </div>
              </div>
              <div class="content-div">
                <div class="content-title">收款账号:</div>
                <div class="content-text">
                  {{ payAccount.alipay }}
                </div>
              </div>
            </div>
          </div>
          <div v-show="pay.state" class="box-click">
            <vit-icon type="select-picture" size="small" class="iconfont" />
            <span style="width: 4px" />
            <span>已开通</span>
          </div>
          <div v-show="!pay.state" class="box-click">
            <span class="click-open" @click="apply(pay, payAccount.alipay)"
              >申请开通</span
            >
          </div>
        </div>
      </div>
      <div v-show="payAccount.wybank" class="sence-title">
        健康账户产品开通情况({{ payAccount.wybank }})
      </div>
      <div v-show="payAccount.wybank" class="pay-list">
        <div
          v-for="(pay, index) in wechart[chooseStyle]"
          :key="index"
          class="pay-box"
        >
          <div class="box-top">
            <img :src="pay.icon" />
            <div class="box-content">
              <h3>{{ pay.productName }}</h3>
              <div class="content-div">
                <div class="content-title">产品介绍:</div>
                <div class="content-text">
                  {{ pay.desc }}
                </div>
              </div>
              <div class="content-div">
                <div class="content-title">收款账号:</div>
                <div class="content-text">
                  {{ payAccount.wybank }}
                </div>
              </div>
            </div>
          </div>
          <div v-show="pay.state" class="box-click">
            <vit-icon type="select-picture" size="small" class="iconfont" />
            <span style="width: 4px" />
            <span>已开通</span>
          </div>
          <div v-show="!pay.state" class="box-click">
            <span class="click-open" @click="apply(pay, payAccount.wybank)"
              >申请开通</span
            >
          </div>
        </div>
      </div>
    </v-form-card>
  </div>
</template>
<script>
import VFormCard from "@/components/form/v-form-card.vue";

export default {
  name: "BusinessConfig",
  components: {
    "v-form-card": VFormCard,
  },
  data() {
    return {
      institutionCode: "",
      businessCode: "",
      payments: [
        {
          icon: "",
          companyName: "",
          accountNo: "",
          payWayName: "",
          payWayCode: "",
          productType: "",
        },
      ],
      payAccount: {
        wxpay: "",
        alipay: "",
        wybank: "",
      },
      scene: "手机支付场景",
      chooseStyle: "mobile",
      wechart: {
        web: [
          {
            icon: require("../../../../assets/images/wepay-native.png"),
            productName: "Native支付",
            productType: 3,
            desc: "用户通过微信扫一扫，扫描PC中出现的付款二维码完成支付",
            payWayName: "微信支付",
            payWayCode: "wxpay",
            state: false,
          },
        ],
        mobile: [
          {
            icon: require("../../../../assets/images/wepay-hfive.png"),
            productName: "H5支付",
            productType: 5,
            desc: "手机浏览器中购买商品进行支付或APP中嵌入H5收银台进行支付",
            payWayName: "微信支付",
            payWayCode: "wxpay",
            state: false,
          },
          {
            icon: require("../../../../assets/images/wepay-jsapi.png"),
            productName: "JSAPI支付",
            productType: 2,
            desc: "微信公众号中购买商品进行支付",
            payWayName: "微信支付",
            payWayCode: "wxpay",
            state: false,
          },
          {
            icon: require("../../../../assets/images/wepay-s.png"),
            productName: "小程序支付",
            productType: 6,
            desc: "微信小程序中购买商品进行支付",
            payWayName: "微信支付",
            payWayCode: "wxpay",
            state: false,
          },
          {
            icon: require("../../../../assets/images/wepay-app.png"),
            productName: "APP支付",
            productType: 4,
            desc: "APP中使用原生收银台进行支付",
            payWayName: "微信支付",
            payWayCode: "wxpay",
            state: false,
          },
        ],
      },
      alipay: {
        web: [
          {
            icon: require("../../../../assets/images/alipay-web.png"),
            productName: "电脑网站支付",
            productType: 15,
            desc: "PC网站中购买商品进行支付",
            payWayName: "支付宝支付",
            payWayCode: "alipay",
            state: false,
          },
          {
            icon: require("../../../../assets/images/alipay-face.png"),
            productName: "当面付支付",
            productType: 11,
            desc: "展示用户微信付款码，商家扫码进行支付",
            payWayName: "支付宝支付",
            payWayCode: "alipay",
            state: false,
          },
        ],
        mobile: [
          {
            icon: require("../../../../assets/images/alipay-app.png"),
            productName: "APP支付",
            productType: 13,
            desc: "APP中使用原生收银台进行支付",
            payWayName: "支付宝支付",
            payWayCode: "alipay",
            state: false,
          },
          {
            icon: require("../../../../assets/images/alipay-m.png"),
            productName: "手机网站支付",
            productType: 14,
            desc: "手机浏览器中购买商品进行支付或APP中嵌入H5收银台进行支付",
            payWayName: "支付宝支付",
            payWayCode: "alipay",
            state: false,
          },
        ],
      },
      healthpay: {
        web: [
          {
            icon: require("../../../../assets/images/health-web.png"),
            productName: "电脑支付",
            productType: 17,
            desc: "PC网站中购买商品进行支付",
            payWayName: "健康账户",
            payWayCode: "wybank",
            state: false,
          },
        ],
        mobile: [
          {
            icon: require("../../../../assets/images/health-m.png"),
            productName: "手机支付",
            productType: 16,
            desc: "手机浏览器中购买商品进行支付或APP中嵌入H5收银台进行支付",
            payWayName: "健康账户",
            payWayCode: "wybank",
            state: false,
          },
        ],
      },
    };
  },
  created() {
    this.getAccountList(JSON.parse(localStorage.businessList));
  },
  methods: {
    getAccountList(mylist) {
      // 获取收款账号信息
      this.$fetch("/pay/account/info.json", {
        method: "post",
        data: {
          businessCode: mylist.businessCode,
          institutionCode: mylist.institutionCode,
        },
      })
        .then((res) => {
          if (res.code === 0) {
            res.data.forEach((item) => {
              this.payAccount[item.payWayCode] = item.accountNo;
              this.getPaymentList(item.accountNo);
            });
            this.payments = res.data;
          }
        })
        .catch(() => {});
    },
    getPaymentList(accountNo) {
      // 获取已开通的产品
      this.$fetch("/pay/account/productList.json", {
        method: "post",
        data: {
          accountNo,
        },
      })
        .then((res) => {
          if (res.code === 0) {
            res.data.forEach((item) => {
              if (item.payWayCode === "wxpay") {
                this.wechart.web.forEach((element) => {
                  if (element.productType === item.productType) {
                    element.state = true;
                  }
                });
                this.wechart.mobile.forEach((element) => {
                  if (element.productType === item.productType) {
                    element.state = true;
                  }
                });
              } else if (item.payWayCode === "alipay") {
                this.alipay.web.forEach((element) => {
                  if (element.productType === item.productType) {
                    element.state = true;
                  }
                });
                this.alipay.mobile.forEach((element) => {
                  if (element.productType === item.productType) {
                    element.state = true;
                  }
                });
              } else {
                this.healthpay.web.forEach((element) => {
                  if (element.productType === item.productType) {
                    element.state = true;
                  }
                });
                this.healthpay.mobile.forEach((element) => {
                  if (element.productType === item.productType) {
                    element.state = true;
                  }
                });
              }
            });
          }
        })
        .catch(() => {});
    },
    changeScene(value) {
      // 点击切换支付场景按钮
      if (value === "电脑支付场景") {
        this.chooseStyle = "web";
      } else {
        this.chooseStyle = "mobile";
      }
    },
    apply(row, accountNo) {
      // 点击申请开通
      this.$fetch("/pay/product/create.json", {
        method: "post",
        data: {
          accountNo,
          ...row,
        },
      }).then((res) => {
        if (res.code === 0) {
          this.$alert(res.message, "提示", {
            confirmButtonText: "知道了",
          });
        }
      });
    },
  },
};
</script>
<style lang="less" scoped>
.business-config {
  font-family: PingFangSC-Regular, PingFang SC;
  .config-account {
    margin-bottom: 16px;
    .account-title {
      display: inline-block;
      margin-right: 16px;
      font-size: 14px;
      line-height: 20px;
      color: rgba(140, 154, 180, 1);
    }
    .account-content {
      display: inline-block;
      margin-right: 16px;
      font-size: 14px;
      line-height: 20px;
      color: rgba(140, 154, 180, 1);
    }
  }
  .config-payment {
    display: -webkit-flex; /* Safari */
    display: flex;
    width: 240px;
    height: 100px;
    padding: 16px;
    overflow: hidden;
    background: linear-gradient(
      134deg,
      rgba(243, 248, 255, 1) 0%,
      rgba(237, 245, 255, 1) 100%
    );
    border-radius: 12px 2px 12px 2px;
    img {
      display: block;
      width: 20px;
      height: 20px;
      margin: 2px 8px 0 0;
    }
    h3 {
      margin-bottom: 8px;
      font-size: 16px;
      font-weight: 500;
      line-height: 24px;
      color: rgba(52, 56, 75, 1);
    }
    p {
      margin-bottom: 4px;
      font-size: 12px;
      font-weight: 400;
      line-height: 16px;
      color: rgba(89, 101, 122, 1);
    }
  }
  .el-radio-group {
    margin-bottom: 16px;
  }
  /deep/ .el-radio-button__inner {
    font-weight: 400;
  }
  .tab-box {
    margin-bottom: 24px;
    p {
      width: 794px;
      height: 32px;
      padding: 8px;
      font-size: 14px;
      line-height: 16px;
      color: #34384b;
      background-color: #fff7eb;
      border-radius: 4px;
      .iconfont {
        margin: 8px;
        font-size: 16px;
        color: #ffad3b;
      }
    }
  }
  .sence-title {
    margin-bottom: 16px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-size: 18px;
    font-weight: 400;
    line-height: 24px;
    color: rgba(52, 56, 75, 1);
  }
  .pay-list {
    display: -webkit-flex; /* Safari */
    display: flex;
    flex-wrap: wrap;

    margin-bottom: 32px;
  }
  .pay-box {
    width: 400px;
    height: 176px;
    margin: 0 16px 16px 0;
    background: rgba(255, 255, 255, 1);
    border: 1px solid rgba(213, 217, 227, 1);
    border-radius: 4px;
    .box-top {
      display: -webkit-flex; /* Safari */
      display: flex;
      height: 128px;
      padding: 16px;
      border-bottom: 1px solid #d5d9e3;
    }
    img {
      display: block;
      width: 48px;
      height: 48px;
      margin-right: 16px;
    }
    h3 {
      margin-bottom: 8px;
      font-family: PingFangSC-Medium, PingFang SC;
      font-size: 16px;
      font-weight: 500;
      line-height: 24px;
      color: rgba(52, 56, 75, 1);
    }
    .content-div {
      display: -webkit-flex; /* Safari */
      display: flex;
      margin-bottom: 4px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-size: 12px;
      font-weight: 400;
      line-height: 16px;
      color: rgba(140, 154, 180, 1);
      .content-title {
        width: 60px;
      }
      .content-text {
        width: 240px;
      }
    }
    .box-click {
      display: table;
      height: 45px;
      margin: 0 auto;
      font-family: PingFangSC-Regular, PingFang SC;
      font-size: 14px;
      font-weight: 400;
      line-height: 45px;
      color: #59657a;
      .iconfont {
        display: table-cell;
        margin-right: 2px;
        color: #32b107;
        vertical-align: middle;
      }
      span {
        display: table-cell;
        vertical-align: middle;
      }
      .click-open {
        color: #3e7fee;
      }
      .click-open:hover {
        color: rgba(26, 103, 235, 1);
        cursor: pointer;
      }
    }
  }
  .pay-box:last-child {
    margin: 0;
  }
  .pay-box:hover {
    cursor: default;
    box-shadow: 0px 2px 8px 0px rgba(52, 56, 75, 0.2);
  }
}
</style>
