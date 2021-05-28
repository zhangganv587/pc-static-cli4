<!--
 * @Author: 张淦
 * @Date: 2019-12-02 15:23:30
 * @LastEditors: zhanggan
 * @Description: 商户2.0 机构入驻审核列表
 * @FilePath: /gpay-ops-static/src/pages/merchant/businessManage/audit.vue
 -->
<template>
  <div class="finance-summary">
    <el-form ref="form" label-width="130px" :inline="true" :model="searchForm">
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
          clearable
          placeholder="业务线"
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
          clearable
          placeholder="业务状态"
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
        <we-date-picker
          v-model="searchForm.applyDate"
          :picker-props="pickerData"
          :default-range="0"
          @currentChange="applyDatePickerChange"
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
  </div>
</template>

<script type="text/jsx">
import { mapGetters } from 'vuex';
import { APPROVAL_STATUS, APPROVAL_STATUS_ARR } from '@/utils/constants';
import tableFormMixin from '@/mixins/tableFormMixin';

export default {
  mixins: [tableFormMixin],
  data() {
    this.columns = this.getColumns();
    this.queryUrl = '/pay/business/query.json';
    this.pickerData = {
      startPlaceholder: '添加开始时间',
      endPlaceholder: '添加结束时间',
    };
    this.status = APPROVAL_STATUS_ARR;
    return {
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
    }),
  },
  created() {
    this.$common.judgeState({
      businessList: 'getBusinessList',
      merchantList: 'getMerchantList',
      businessLine: 'getBusinessLine',
    });
  },
  methods: {
    getColumns() {
      return [
        { prop: 'institutionName', label: '机构名称', width: 240 },
        { prop: 'institutionCode', label: '机构编号', width: 240 },
        { prop: 'businessName', label: '接入业务', width: 120 },
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
        { prop: 'companyName', label: '业务签约公司', width: 260 },
        { prop: 'businessLineName', label: '业务线', width: 240 },
        { prop: 'creator',
          label: '申请人',
          width: 120,
          render: (h, value, row) => {
            return value.toLowerCase();
          }
        },
        {
          prop: 'applyDate',
          label: '添加时间',
          width: '250',
          render: (h, value, row) => {
            return this.$common.timeFormat(value, 'YYYY-MM-DD HH:mm:ss');
          }
        },
        {
          prop: 'status',
          label: '操作',
          width: '120',
          fixed: 'right',
          render: (h, value, row) => {
            if (value === 1) {
              return (
                <div>
                  <el-button onClick={() => this.handleAudit(row)} type="text">审核</el-button>
                </div>
              );
            }
          }
        }
      ];
    },
    applyDatePickerChange(datePicker) {
      this.searchForm.applyStartDate = datePicker ? datePicker[0] : '';
      this.searchForm.applyEndDate = datePicker ? datePicker[1] : '';
    },
    handleAudit(row) {
      localStorage.businessList = JSON.stringify(row);
      this.$router.push({ path: '/audit/pending/operate'});
    },
  }
};
</script>
