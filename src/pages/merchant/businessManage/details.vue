<!--
 * @Author: 张淦
 * @Date: 2019-12-04 15:28:44
 * @LastEditors: 张淦
 * @Description: 商户2.0 机构业务详情页
 * @FilePath: /gpay-ops-static/src/pages/businessManage/details.vue
 -->
<template>
  <div class="business-details">
    <el-card style="margin-bottom: 16px">
      <business-header />
    </el-card>
    <el-tabs v-model="activeName">
      <el-tab-pane label="支付配置" name="config">
        <config />
      </el-tab-pane>
      <el-tab-pane label="支付运营" name="operate">
        <operate />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script type="text/jsx">
import { mapGetters } from 'vuex';
import businessHeader from './component/business-header.vue';
import config from './component/config.vue';
import operate from './component/operate.vue';

export default {
  components: {
    businessHeader,
    config,
    operate
  },
  data() {
    return {
      activeName: 'config',
      institution: {
        institutionName: null,
        institutionCode: null,
        memo: null,
        person: null,
        phone: null,
        content: null,
      },
      business: {
        businessName: null,
        businessCode: null,
        companyName: null,
        companyCode: null,
        businessLineCode: null,
        businessLineName: null,
        person: null,
        phone: null,
        protocolAddress: null,
        content: null,
      },
    };
  },
  computed: {
    ...mapGetters({
      merchantList: 'merchantList',
    }),
  },
  created() {
    this.$common.judgeState({
      merchantList: 'getMerchantList',
    });
    this.getFormData(this.$route.params.id);
  },
  methods: {
    getFormData(id) {
      const data = {
        institution: {
          institutionName: '浙江妇幼保健医院',
          institutionCode: 'C201912241234',
          memo: '浙江妇幼保健医院成立于xxxxx，位于xxxxxx浙江妇幼保健医院成立于xxxxx，位于xxxxxx浙江妇幼保健医院成立于xxxxx，位于xxxxxx浙江妇幼保健医院成立于xxxxx，位于xxxxxx',
          person: '张淦',
          phone: '18301293775',
          content: '',
        },
        business: {
          businessName: '处方共享',
          businessCode: 'yaowu',
          companyName: '乌镇互联网医院',
          companyCode: '',
          businessLineCode: '',
          businessLineName: '消费事业群',
          person: '张淦',
          phone: '18301293775',
          protocolAddress: '浙江妇幼保健医院成立于xxxxx，位于xxxxxx浙江妇幼保健医院成立于xxxxx，位于xxxxxx浙江妇幼保健医院成立于xxxxx，位于xxxxxx浙江妇幼保健医院成立于xxxxx，位于xxxxxx',
          content: '',
        },
      };
      if (data.institution.memo.length > 40) {
        this.institution = data.institution;
        this.institution.content = data.institution.memo;
        this.institution.memo = data.institution.memo.substring(0, 40) + '...';
      } else {
        this.institution = data.institution;
      }
      if (data.business.protocolAddress.length > 40) {
        this.business = data.business;
        this.business.content = data.business.protocolAddress;
        this.business.protocolAddress = data.business.protocolAddress.substring(0, 40) + '...';
      } else {
        this.business = data.business;
      }
    }
  }
};
</script>
<style lang="less" scoped>
.business-details {
  /deep/ .el-card__body {
    padding: 0;
  }
}
</style>
