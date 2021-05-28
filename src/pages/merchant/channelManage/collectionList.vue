<!--
 * @Author: 张淦
 * @Date: 2020-04-28 14:10:20
 * @LastEditors: 张淦
 * @Description: 商户系统 - 渠道账号管理 - 收款账号管理
 * @FilePath: /gpay-ops-static/src/pages/merchant/channelManage/collectionList.vue
 -->
<template>
  <div class="collectionList">
    <el-tabs v-model="activeName" type="card">
      <el-tab-pane label="微信收款账号管理" name="first">
        <wechat-collection />
      </el-tab-pane>
      <el-tab-pane label="微信产品管理" name="second">
        <wechat-product />
      </el-tab-pane>
      <el-tab-pane label="支付宝收款账号管理" name="third">
        <ali-collection />
      </el-tab-pane>
      <el-tab-pane label="其他收款账号管理" name="fourth">
        <other-collection />
      </el-tab-pane>
      <el-tab-pane label="收款账号查询" name="five">
        <payment-search ref="search" :data="query" />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script type="text/jsx">
import wechatCollection from './wechatCollection';
import wechatProduct from './wechatProduct';
import aliCollection from './aliCollection';
import otherCollection from './otherCollection';
import paymentSearch from './paymentSearch';

export default {
  components: {
    'wechat-collection': wechatCollection,
    'wechat-product': wechatProduct,
    'ali-collection': aliCollection,
    'other-collection': otherCollection,
    'payment-search': paymentSearch,
  },
  data() {
    return {
      activeName: 'first',
      query: {}
    };
  },
  mounted() {
    this.handleDefaultQuery();
  },
  methods: {
    handleDefaultQuery() {
      const {
        card,
        accountNo,
        payWayCode
      } = this.$route.query;
      if (!card) {
        return;
      }
      this.activeName = card;
      this.query = {
        accountNo,
        payWayCode
      };
      this.$nextTick(() => {
        if (card === 'five') {
          this.$refs['search'].search();
        }
      });
    }
  }
};
</script>
