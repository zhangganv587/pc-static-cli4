<template>
  <v-form-card title="支付信息">
    <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
      <template v-if="paymentChannel.payWayId === 3">
        <el-tab-pane label="JSAPI支付" name="first">
          <el-badge is-dot class="item">
            <wxpay-jsapi />
          </el-badge>
        </el-tab-pane>
        <el-tab-pane label="Native支付" name="second">
          <el-badge is-dot class="item">
            <wxpay-native />
          </el-badge>
        </el-tab-pane>
        <el-tab-pane label="H5支付" name="third">
          <el-badge is-dot class="item">
            <wxpay-five />
          </el-badge>
        </el-tab-pane>
        <el-tab-pane label="APP支付" name="fourth">
          <el-badge is-dot class="item">
            <wxpay-app />
          </el-badge>
        </el-tab-pane>
        <el-tab-pane label="小程序支付" name="fifth">
          <el-badge is-dot class="item">
            <wxpay-procedures />
          </el-badge>
        </el-tab-pane>
      </template>

      <template v-if="paymentChannel.payWayId === 1">
        <el-tab-pane label="手机网站支付" name="sixth">
          <el-badge is-dot class="item">
            <alipay-mobileWeb />
          </el-badge>
        </el-tab-pane>
        <el-tab-pane label="电脑网站支付" name="seventh">
          <el-badge is-dot class="item">
            <alipay-pcWeb />
          </el-badge>
        </el-tab-pane>
        <el-tab-pane label="APP支付" name="eighth">
          <el-badge is-dot class="item">
            <alipay-app />
          </el-badge>
        </el-tab-pane>
        <el-tab-pane label="当面付" name="ninth">
          <el-badge is-dot class="item">
            <alipay-inPerson />
          </el-badge>
        </el-tab-pane>
      </template>

      <template v-if="paymentChannel.payWayId === 2">
        <el-tab-pane label="H5支付" name="tenth">
          <el-badge is-dot class="item">
            <jkpay-five />
          </el-badge>
        </el-tab-pane>
        <el-tab-pane label="WEB支付" name="eleventh">
          <el-badge is-dot class="item">
            <jkpay-web />
          </el-badge>
        </el-tab-pane>
      </template>
    </el-tabs>
  </v-form-card>
</template>

<script>
import { mapGetters } from "vuex";
import VFormCard from "@/components/form/v-form-card.vue";
import wxpayJsapi from "./wxpayJsapi";
import wxpayNative from "./wxpayNative";
import wxpayProcedures from "./wxpayProcedures";
import wxpayApp from "./wxpayApp";
import wxpayFive from "./wxpayFive";
import alipayApp from "./alipayApp";
import alipayInPerson from "./alipayInPerson";
import alipayMobileWeb from "./alipayMobileWeb";
import alipayPcWeb from "./alipayPcWeb";
import jkpayFive from "./jkpayFive";
import jkpayWeb from "./jkpayWeb";

export default {
  name: "PaymentInfo",
  components: {
    VFormCard,
    wxpayJsapi,
    wxpayNative,
    wxpayProcedures,
    wxpayApp,
    wxpayFive,
    alipayApp,
    alipayInPerson,
    alipayMobileWeb,
    alipayPcWeb,
    jkpayFive,
    jkpayWeb,
  },
  props: {
    row: {
      type: Object,
      default: () => {
        return {};
      },
    },
  },
  data() {
    return {
      activeName: "first",
    };
  },
  computed: {
    ...mapGetters({
      paymentChannel: "paymentChannel",
    }),
  },
  watch: {
    paymentChannel: {
      handler(newValue) {
        if (newValue.payWayId === 3) {
          this.activeName = "first";
        } else if (newValue.payWayId === 2) {
          this.activeName = "tenth";
        } else {
          this.activeName = "sixth";
        }
      },
      immediate: true,
    },
  },
  methods: {
    handleClick(tab, event) {
      // console.log(tab, event);
    },
    resetForm() {},
  },
};
</script>
<style lang="less" scoped>
.item {
  margin-top: 10px;
  margin-right: 40px;
}
</style>
