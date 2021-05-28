<!--
 * @Author: 张淦
 * @Date: 2020-04-28 14:39:15
 * @LastEditors: zhanggan
 * @Description: 商户系统 - 渠道账号管理 - 收款账号管理 - 其他收款账号管理
 * @FilePath: /gpay-ops-static/src/pages/merchant/channelManage/paymentSearch.vue
 -->
<template>
  <div class="wx-collection">
    <el-form ref="form" label-width="130px" :inline="true" :model="searchForm">
      <el-form-item prop="accountNo">
        <el-input
          v-model="searchForm.accountNo"
          placeholder="收款账号"
          clearable
        />
      </el-form-item>
      <el-form-item prop="payWayCode">
        <el-select
          v-model="searchForm.payWayCode"
          clearable
          placeholder="支付渠道"
        >
          <el-option
            v-for="channel in merchantChannelList"
            :key="channel.id"
            :label="channel.payWayName"
            :value="channel.payWayCode"
          />
        </el-select>
      </el-form-item>
      <el-form-item prop="status">
        <el-select
          v-model="searchForm.status"
          placeholder="账号状态"
          filterable
          clearable
        >
          <el-option
            v-for="(value, key) in availableState"
            :key="key"
            :label="value"
            :value="key"
          />
        </el-select>
      </el-form-item>
      <el-form-item prop="companyCode">
        <el-select
          v-model="searchForm.companyCode"
          placeholder="账号主体"
          filterable
          clearable
        >
          <el-option
            v-for="(company, index) in merchantList"
            :key="`company${index}`"
            :label="company.dictText"
            :value="company.dictValue"
          />
        </el-select>
      </el-form-item>
      <el-form-item prop="institutionCode">
        <el-select
          v-model="searchForm.institutionCode"
          placeholder="使用机构"
          filterable
          clearable
        >
          <el-option
            v-for="(institution, key) in restaurants"
            :key="`institution${key}`"
            :label="institution.institutionName"
            :value="institution.institutionCode"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <v-form-submit
          ref="formSubmit"
          :action="queryUrl"
          :immediate="true"
          :pagination="pagination"
          @click:search="handleSearch"
        >
          查询
        </v-form-submit>
        <v-form-reset :form-ref="$refs['form']" />
      </el-form-item>
    </el-form>
    <v-table
      v-loading="loading"
      :data="tableData"
      :columns="columns"
      type="index"
      :pagination="pagination"
      @currentChange="currentChange"
    />
  </div>
</template>

<script type="text/jsx">
import { mapGetters } from 'vuex';
import tableFormMixin from '@/mixins/tableFormMixin';
import { AVAILABLE_STATE, AVAILABLE_STATE_ARR } from '@/utils/constants.js';

export default {
  mixins: [tableFormMixin],
  props: {
    data: {
      type: Object,
      default: () => {
        return {};
      }
    }
  },
  data() {
    this.columns = this.getColumns();
    this.queryUrl = '/pay/payment/query.json';
    this.availableState = AVAILABLE_STATE;
    return {
      restaurants: [],
      // 搜索form
      searchForm: {
        payWayCode: null,
        accountNo: null,
        status: null,
        companyCode: null,
        institutionCode: null,
      },
    };
  },
  computed: {
    ...mapGetters({
      merchantList: 'merchantList',
      merchantChannelList: 'merchantChannelList'
    }),
  },
  watch: {
    data(val) {
      Object.assign(this.searchForm, val);
    }
  },
  mounted() {
    this.$common.judgeState({
      merchantList: 'getMerchantList',
      merchantChannelList: 'getMerchantChannelList',
    });
    this.getRestaurants();
  },
  methods: {
    search() {
      this.$refs['formSubmit'].search();
    },
    getRestaurants() { // 机构名称列表
      this.$fetch('/pay/apply/institution.json', {
        method: 'post',
        data: {
          institutionCode: '',
        }
      }).then(res => {
        if (res.code === 0 && res.data) {
          this.restaurants = res.data;
        }
      });
    },
    getColumns() {
      const columns = [
        { prop: 'payWayName', label: '支付渠道' },
        { prop: 'accountNo', label: '收款账号' },
        { prop: 'companyName', label: '账号主体' },
        { prop: 'institutionName', label: '使用机构' },
        { prop: 'status',
          label: '状态',
          width: '100',
          render: (h, value, row) => {
            if (value !== null || value !== '') {
              return (<span class="status-flex">
                <span class={AVAILABLE_STATE_ARR[value].className}></span>
                <span>{AVAILABLE_STATE_ARR[value].text}</span>
              </span>);
            } else {
              return '';
            }
          }
        },
      ];
      return columns;
    },
  }
};
</script>
