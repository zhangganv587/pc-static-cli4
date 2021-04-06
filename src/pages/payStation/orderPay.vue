<template>
  <div class="orderPay">
    <pay-tip :tip="tip" :type="type" />
    <div
      v-if="type === 1 && infos.miSettleData && infos.miSettleData.money"
      class="orderPay__content"
      style="margin-bottom: 20px; padding: 15px 50px"
    >
      <h2 style="color: #999; padding-top: 0; padding-bottom: 20px">
        医疗保险在线报销
      </h2>
      <p class="orderPay__content_yibao">
        <span>医保：{{ getMoneyNumber(infos.miSettleData.money) }}元</span>
        <span
          >（个人帐户支付：{{
            getMoneyNumber(infos.miSettleData.accountMoney)
          }}元</span
        >
        <span
          >统筹基金支付：{{
            getMoneyNumber(infos.miSettleData.feeMoney)
          }}元</span
        >
        <span
          >抵扣支付：{{ getMoneyNumber(infos.miSettleData.miMoney) }}元</span
        >
        <span
          >自费支付：{{
            getMoneyNumber(infos.miSettleData.cashMoney)
          }}元）</span
        >
      </p>
    </div>
    <div v-if="type === 1" class="orderPay__content">
      <h2>自费支付方式</h2>
      <el-form label-position="right" label-width="80px" :model="payItem">
        <el-form-item label="现金" prop="cashpay">
          <el-input
            v-model.trim="payItem.cashpay"
            class="orderPay__content_input"
            step="0.01"
            placeholder="0.00"
            @keyup.native="handleKeyup('cashpay', $event)"
            @input="handleInput"
          >
            <i slot="suffix">元</i>
          </el-input>
        </el-form-item>
        <el-form-item label="银行卡" prop="unionpay">
          <el-input
            v-model.trim="payItem.unionpay"
            class="orderPay__content_input"
            step="0.01"
            placeholder="0.00"
            @keyup.native="handleKeyup('unionpay', $event)"
            @input="handleInput"
          >
            <i slot="suffix">元</i>
          </el-input>
        </el-form-item>
        <el-form-item label="支付宝" prop="alipay">
          <el-input
            v-model.trim="payItem.alipay"
            class="orderPay__content_input"
            step="0.01"
            placeholder="0.00"
            @keyup.native="handleKeyup('alipay', $event)"
            @input="handleInput"
          >
            <i slot="suffix">元</i>
          </el-input>
        </el-form-item>
        <el-form-item label="微信" prop="wxpay">
          <el-input
            v-model.trim="payItem.wxpay"
            class="orderPay__content_input"
            step="0.01"
            placeholder="0.00"
            @keyup.native="handleKeyup('wxpay', $event)"
            @input="handleInput"
          >
            <i slot="suffix">元</i>
          </el-input>
        </el-form-item>
      </el-form>
      <div class="orderPay__btns">
        <div class="orderPay_money">
          <label
            >支付金额：<span class="orderPay_money_price"
              >{{ getMoneyNumber(infos.payAmount) }}元</span
            ></label
          >
          <label
            >实付金额：<span
              class="orderPay_money_price orderPay_money_realprice"
              >{{ realPay.toFormat(2) }}元</span
            ></label
          >
        </div>
        <div class="orderPay__btns_success" :loading="loading" @click="submit">
          提交
        </div>
      </div>
    </div>
    <div v-else class="orderPay__btns" style="width: 982px; align-items: start">
      <div class="orderPay__btns_success" @click="getInfo">刷新</div>
    </div>
  </div>
</template>
<script>
import payTip from "@/components/payTip";
import { BigNumber } from "bignumber.js";
import { mapActions } from "vuex";
export default {
  name: "OrderPay",
  components: {
    payTip,
  },
  data() {
    return {
      payItem: {
        cashpay: "",
        unionpay: "",
        alipay: "",
        wxpay: "",
      },
      tip: "等待订单提交...",
      type: 4,
      realPay: new BigNumber(0),
      infos: {},
      loading: false,
    };
  },
  mounted() {
    this.getInfo();
  },
  methods: {
    ...mapActions({
      getPayInfoByComm: "payStation/getPayInfoByComm",
      getPayCashPay: "payStation/getPayCashPay",
    }),
    getInfo() {
      this.getPayInfoByComm({
        prePayId: this.$route.query.prePayId,
      })
        .then((res) => {
          this.type = 1;
          this.tip = "订单提交";
          this.infos = res;
          if (res.payAmount === 0) {
            this.payItem = {
              cashpay: 0,
              unionpay: 0,
              alipay: 0,
              wxpay: 0,
            };
          }
        })
        .catch((err) => {
          this.tip = err.message;
          this.type = 2;
        });
    },
    handleKeyup(type, e) {
      this.payItem[type] = this.payItem[type].replace(/[^0-9.]/gi, "");
      this.payItem[type] = String(this.payItem[type]).replace(
        /^(\d+)\.(\d\d).*$/,
        "$1.$2"
      );
      if (!e.target.value) {
        e.target.value = "";
      }
    },
    submit() {
      if (this.infos.payAmount !== this.realPay.multipliedBy(100).toNumber()) {
        return this.$message({
          type: "error",
          message: "支付金额与实付金额不一致，请检查自费金额！",
        });
      }
      this.$confirm(
        `确认支付金额：${this.getMoneyNumber(
          this.infos.payAmount
        )}元,实付金额：${this.realPay.toFixed(2)}元`,
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      )
        .then(() => {
          this.loading = true;
          const payways = [];
          for (const key in this.payItem) {
            if (this.payItem[key]) {
              let num = new BigNumber(this.payItem[key]);
              num = num.multipliedBy(100).toNumber();
              payways.push({ payWay: key, amount: num });
            }
          }
          this.getPayCashPay({
            prePayId: this.$route.query.prePayId,
            sign: this.infos.sign,
            totalAmount: this.infos.totalAmount,
            payways: payways,
          })
            .then(() => {
              this.loading = false;
              this.$message({
                type: "success",
                message: "提交成功!",
              });
              this.$router.push(
                `/accountPay?prePayId=${this.$route.query.prePayId}&status=success`
              );
            })
            .catch(() => {
              this.loading = false;
            });
        })
        .catch(() => {
          this.loading = false;
          this.$message({
            type: "info",
            message: "提交取消!",
          });
        });
    },
    getMoneyNumber(num) {
      return num ? (num / 100).toFixed(2) : "0.00";
    },
    handleInput() {
      this.realPay = new BigNumber(0);
      for (const key in this.payItem) {
        this.payItem[key] = this.payItem[key].replace(/[^0-9.]/gi, "");
        if (this.payItem[key]) {
          this.realPay = this.realPay.plus(this.payItem[key]);
        }
      }
    },
  },
};
</script>
<style lang="less" scoped>
.inputNumber input[type="number"]::-webkit-outer-spin-button,
.inputNumber input[type="number"]::-webkit-inner-spin-button {
  margin: 0;
  -webkit-appearance: none !important;
}
input[type="number"] {
  -moz-appearance: textfield;
}
.orderPay {
  &__content {
    width: 982px;
    padding: 25px 45px 50px;
    margin: 20px auto 80px;
    overflow: hidden;
    color: #444;
    border: 2px solid #dff2ff;
    border-radius: 2px;

    h2 {
      padding: 10px 0 30px;
      font-size: 18px;
      font-weight: 400;
    }

    &_input {
      width: 300px;
      /deep/ input {
        text-align: right;
      }
    }
    &_yibao {
      span {
        margin-right: 20px;
      }
    }
  }
  &__btns {
    position: relative;
    display: flex;
    margin: 20px auto;
    align-items: flex-end;
    flex-direction: column;
    &_success {
      display: block;
      float: left;
      width: 137px;
      padding: 12px 20px;
      margin: 20px 30px 0 0;
      font-size: 16px;
      color: #fff;
      text-align: center;
      cursor: pointer;
      background: #86bc4c;
      border: none;
      border-radius: 5px;
    }
    &_success:hover {
      opacity: 0.7;
    }
  }
  &_money {
    margin-right: 30px;
    font-size: 14px;
    label {
      display: block;
      margin-bottom: 10px;
      font-size: 12px;
      color: #333;
    }
    &_price {
      font-family: "Hiragino Sans GB", "Microsoft YaHei", "微软雅黑", "宋体",
        Arial, Verdana, sans-serif;
      font-size: 18px;
    }
    &_realprice {
      color: #f90;
    }
  }
}
</style>
