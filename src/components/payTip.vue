<template>
  <div class="payTip">
    <div
      v-if="[1, 3].includes(type)"
      class="payTip__summary"
      :style="{ 'padding-bottom': type !== 3 ? '30px' : '' }"
    >
      <h3 v-if="type === 1" class="payTip__summary_h3">
        {{ tip }}
      </h3>
      <h3 v-if="type === 3" class="payTip__summary_h3">
        您的订单已经创建，请在<span class="payTip__summary_h3_span"
          ><i /><i>{{ h }}时</i><i>{{ m }}分</i><i>{{ s }}秒</i></span
        >内完成支付，逾期订单将取消！
      </h3>
      <div v-if="type === 3" class="payTip__summary_detail">
        <ul>
          <li>订单描述：挂号订单测试</li>
          <li>订单号：2020022614041122210500000001</li>
          <li>提交时间：2020-02-26 14:04:21</li>
        </ul>
        <div class="payTip__summary_money">
          <label
            >支付金额：<span class="payTip__summary_money_price"
              >0.01元</span
            ></label
          >
          <label
            >实付金额：<span
              class="payTip__summary_money_price payTip__summary_money_realprice"
              >0.01元</span
            ></label
          >
        </div>
      </div>
    </div>
    <div v-if="type === 2" class="payTip__error">
      <p class="payTip__error_p">错误信息: {{ tip }}</p>
    </div>
    <div v-if="type === 4" class="payTip__summary payTip__loading">
      <p class="payTip__error_p">
        {{ tip }}
      </p>
    </div>
  </div>
</template>
<script>
export default {
  name: "PayTip",
  props: {
    tip: {
      type: String,
      default: "",
    },
    type: {
      type: Number,
      default: 1, // 1 成功 2 失败 3 详情 4 等待
    },
    time: {
      type: String,
      default: "", // '2020/02/27, 16:26:00'
    },
  },
  data() {
    return {
      d: "",
      h: "",
      m: "",
      s: "",
    };
  },
  mounted() {
    if (this.type === 3) {
      this.countDown();
    }
  },
  methods: {
    countDown() {
      const nowtime = new Date();
      const endtime = new Date(this.time);
      const lefttime = parseInt((endtime.getTime() - nowtime.getTime()) / 1000);
      const _d = parseInt(lefttime / (24 * 60 * 60));
      const _h = parseInt((lefttime / (60 * 60)) % 24);
      const _m = parseInt((lefttime / 60) % 60);
      const _s = parseInt(lefttime % 60);
      this.d = this.addZero(_d);
      this.h = this.addZero(_h);
      this.m = this.addZero(_m);
      this.s = this.addZero(_s);
      setTimeout(this.countDown, 1000);
    },
    addZero(i) {
      return i < 10 ? "0" + i : i + "";
    },
  },
};
</script>
<style lang="less" scoped>
.payTip {
  width: 982px;
  margin: 20px auto;
  &__summary {
    position: relative;
    width: 980px;
    overflow: hidden;
    background: url(https://kano.guahao.cn/ZVa266695741) 54px 30px no-repeat
      #f5faf4;
    background-size: 48px 48px;
    border: 1px solid #dfefdb;
    &_h3 {
      margin-top: 30px;
      font-size: 18px;
      font-weight: 400;
      line-height: 48px;
      color: #666;
      text-indent: 120px;
      &_span {
        padding: 0 10px;
        font-size: 18px;
        color: #5ca946;
      }
      i {
        font-family: "Hiragino Sans GB", "Microsoft YaHei", "微软雅黑", "宋体",
          Arial, Verdana, sans-serif;
        font-size: 18px;
        font-style: normal;
      }
    }
    &_detail {
      width: 830px;
      padding: 20px 0 30px 120px;
      li {
        font-size: 12px;
        line-height: 20px;
        color: #888;
        list-style: none;
      }
    }
    &_money {
      position: absolute;
      right: 40px;
      bottom: 10px;
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
  &__error {
    padding: 40px 50px 50px 0;
    margin: 50px 0 50px;
    background: url(https://kano.guahao.cn/qZE266716289) 150px 30px no-repeat
      #fcf1f1;
    border: 1px solid #f6d1cf;
    &_p {
      margin-left: 230px;
      font-size: 22px;
      line-height: 42px;
    }
  }
  &__loading {
    padding: 40px 50px 50px 0;
    margin: 50px 0 50px;
    background: url(https://kano.guahao.cn/PbI267269374) 150px 35px no-repeat
      rgba(247, 158, 47, 0.2);
    border: 1px solid rgba(247, 158, 47, 0.3);
  }
}
</style>
