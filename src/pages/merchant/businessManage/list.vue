<!--
 * @Author: 张淦
 * @Date: 2019-12-02 15:23:11
 * @LastEditors: zhanggan
 * @Description: 商户2.0 机构业务列表
 * @FilePath: /gpay-ops-static/src/pages/merchant/businessManage/list.vue
 -->
<template>
  <div class="finance-summary">
    <el-form ref="form" label-width="130px" :model="searchForm" :inline="true">
      <el-form-item prop="institutionName">
        <el-input
          v-model="searchForm.institutionName"
          placeholder="机构名称"
          clearable
        />
      </el-form-item>
      <el-form-item prop="institutionCode">
        <el-input
          v-model="searchForm.institutionCode"
          placeholder="机构编号"
          clearable
        />
      </el-form-item>
      <el-form-item prop="businessCode">
        <el-select
          v-model="searchForm.businessCode"
          filterable
          placeholder="接入业务"
          clearable
        >
          <el-option
            v-for="(business, index) in businessList"
            :key="`business${index}`"
            :label="business.dictText"
            :value="business.dictValue"
          />
        </el-select>
      </el-form-item>
      <el-form-item prop="companyCode">
        <el-select
          v-model="searchForm.companyCode"
          filterable
          placeholder="业务签约公司"
          clearable
        >
          <el-option
            v-for="(merchant, index) in merchantList"
            :key="`merchant${index}`"
            :label="merchant.dictText"
            :value="merchant.dictValue"
          />
        </el-select>
      </el-form-item>
      <el-form-item prop="businessLineCode">
        <el-select
          v-model="searchForm.businessLineCode"
          filterable
          placeholder="业务线"
          clearable
        >
          <el-option
            v-for="(business, index) in businessLine"
            :key="`business${index}`"
            :label="business.dictText"
            :value="business.dictValue"
          />
        </el-select>
      </el-form-item>
      <el-form-item prop="status">
        <el-select
          v-model="searchForm.status"
          filterable
          placeholder="业务状态"
          clearable
        >
          <el-option
            v-for="(state, index) in status"
            :key="`state${index}`"
            :label="state.label"
            :value="state.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item prop="applyDate">
        <el-date-picker
          v-model="datePicker"
          type="datetimerange"
          start-placeholder="入驻开始时间"
          end-placeholder="入驻结束时间"
          @change="applyDatePickerChange"
        />
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
      :pagination="pagination"
      @currentChange="currentChange"
    />
    <administrators :row-data="row" />
  </div>
</template>

<script type="text/jsx">
import { mapGetters } from 'vuex';
import store from '@/store';
import { APPROVAL_STATUS, APPROVAL_STATUS_ARR } from '@/utils/constants';
import tableFormMixin from '@/mixins/tableFormMixin';
import administrators from './component/administrators';
export default {
  components: {
    administrators,
  },
  mixins: [tableFormMixin],
  data() {
    this.columns = this.getColumns();
    this.queryUrl = '/pay/business/query.json';
    this.status = APPROVAL_STATUS_ARR;
    return {
      datePicker: [],
      searchForm: { // 搜索form
        institutionCode: null,
        institutionName: null,
        businessCode: null,
        companyCode: null,
        businessLineCode: null,
        status: null,
        applyStartDate: null,
        applyEndDate: null,
      },
    };
  },
  computed: {
    ...mapGetters({
      businessList: 'businessList',
      businessLine: 'businessLine',
      merchantList: 'merchantList',
      userRoles: '',
    }),
  },
  created() {
    this.$common.judgeState({
      businessList: 'getBusinessList',
      merchantList: 'getMerchantList',
      businessLine: 'getBusinessLine',
    });
    const startTime = this.$common.getUrlParams(location.href, 'startTime');
    const endTime = this.$common.getUrlParams(location.href, 'endTime');
    if (startTime && endTime) {
      this.datePicker = [new Date(2000, 10, 10, 10, 10), new Date(2000, 10, 11, 10, 10)];
    }
    this.$eventBus.$on('resetDatePicker', () => {
      this.datePicker = [];
      this.applyDatePickerChange(null);
    });
  },
  methods: {
    getColumns() {
      return [
        { prop: 'institutionName', label: '机构名称', width: 240 },
        { prop: 'institutionCode', label: '机构编号', width: 260 },
        { prop: 'businessName', label: '接入业务', width: 240 },
        { prop: 'status',
          label: '状态',
          width: 120,
          render: (h, value, row) => {
            return (
              <span class="status-flex">
                <span class={APPROVAL_STATUS[value].className}></span>
                <span>{APPROVAL_STATUS[value].text}</span>
              </span>
            );
          }
        },
        { prop: 'companyName', label: '业务签约公司', width: 320 },
        { prop: 'businessLineName', label: '业务线', width: 260 },
        {
          prop: 'applyDate',
          label: '入住时间',
          width: '240',
          render: (h, value, row) => {
            return this.$common.timeFormat(value, 'YYYY-MM-DD HH:mm:ss');
          }
        },
        {
          prop: 'status',
          label: '操作',
          width: '180',
          fixed: 'right',
          render: (h, value, row) => {
            const html = ['详情', '详情', '查看结果'];
            const { userRoles } = store.state;
            if (userRoles.includes('/button/admin')) {
              return (
                <div>
                  <el-button onClick={() => this.handleDetails(row)} type="text">{html[value]}</el-button>
                  <el-button onClick={() => this.handleInfo(row, 'adminSetting')} type="text">管理员设置</el-button>
                </div>
              );
            } else {
              return (
                <div>
                  <el-button onClick={() => this.handleDetails(row)} type="text">{html[value]}</el-button>
                </div>
              );
            }
          }
        }
      ];
    },
    applyDatePickerChange(datePicker) {
      this.searchForm.applyStartDate = datePicker ? this.dayjs(datePicker[0]).format('YYYY-MM-DD HH:mm:ss') : '';
      this.searchForm.applyEndDate = datePicker ? this.dayjs(datePicker[1]).format('YYYY-MM-DD HH:mm:ss') : '';
    },
    handleDetails(row) {
      localStorage.businessList = JSON.stringify(row);
      if (row.status === 0) { // 审核通过
        this.$router.push({ path: '/business/details'});
      } else if (row.status === 1) { // 待审核
        this.$router.push({ path: '/audit/pending/show'});
      } else { // 审核驳回
        this.$router.push({ path: '/audit/rejected'});
      }
    },
  }
};
</script>
