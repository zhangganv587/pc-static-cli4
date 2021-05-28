<template>
  <div class="finance-summary">
    <el-form ref="form" label-width="130px" :inline="true" :model="searchForm">
      <el-form-item label="业务签约公司：" prop="merchantNo">
        <el-select
          v-model="searchForm.merchantNo"
          placeholder="请选择业务签约公司"
          clearable
          style="margin-right: 10px"
        >
          <el-option
            v-for="(merchant, index) in merchantList"
            :key="`merchant${index}`"
            :label="merchant.merchant"
            :value="merchant.merchantNo"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="业务：" prop="businessCode">
        <el-select
          v-model="searchForm.businessCode"
          filterable
          placeholder="请选择业务"
        >
          <el-option
            v-for="business in businessAdministration"
            :key="business.id"
            :label="business.business"
            :value="business.businessCode"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="业务状态：" prop="status">
        <el-select v-model="searchForm.status" placeholder="请选择业务状态">
          <el-option
            v-for="(value, key) in availableState"
            :key="key"
            :label="value"
            :value="key"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="入驻时间：" prop="applyDate">
        <we-date-picker
          v-model="searchForm.applyDate"
          @currentChange="applyDatePickerChange"
        />
      </el-form-item>
      <el-form-item label="更新时间：" prop="modifyDate">
        <we-date-picker
          v-model="searchForm.modifyDate"
          @currentChange="modifyDatePickerChange"
        />
      </el-form-item>
      <el-form-item label=" ">
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
import { AVAILABLE_STATE } from '@/utils/constants';
import tableFormMixin from '@/mixins/tableFormMixin';
import prohibitMixin from '@/mixins/prohibitMixin';

export default {
  mixins: [tableFormMixin, prohibitMixin],
  data() {
    this.availableState = AVAILABLE_STATE;
    this.columns = this.getColumns();
    this.queryUrl = '/merchant/business/query.json';
    this.prohibitArr = [
      {
        url: '/merchant/business/disable.json',
        message: '禁用'
      },
      {
        url: '/merchant/business/enable.json',
        message: '启用'
      },
    ];
    return {
      searchForm: { // 搜索form
        bizOrderNo: '',
        payLogNo: '',
        paidNo: '',
        merchantNo: '',
        businessNo: '',
        status: '',
        bizLine: '',
        payWay: '',
        applyDate: [],
        applyStartDate: '',
        applyEndDate: '',
        modifyDate: [],
        modifyStartDate: '',
        modifyEndDate: '',
      },
    };
  },
  computed: {
    ...mapGetters({
      merchantList: 'merchantList',
      businessAdministration: 'businessAdministration',
    }),
  },
  created() {
    this.$common.judgeState({
      merchantList: 'getMerchantList',
      businessAdministration: 'getBusinessAdministration',
    });
  },
  methods: {
    getColumns() {
      return [
        { prop: 'businessCode', label: '业务编号', width: 240 },
        { prop: 'businessName', label: '业务名称', width: 240 },
        { prop: 'businessLine', label: '业务线', width: 240 },
        { prop: 'businessAdminAccount', label: '管理员', width: 150 },
        { prop: 'merchantNo', label: '商户号', width: 240 },
        { prop: 'merchantName', label: '业务签约公司', width: 240 },
        { prop: 'businessStatus',
          label: '业务状态',
          width: '120',
          render: (h, value, row) => {
            return (
              <span class="status-flex">
                <span class={AVAILABLE_STATE[value].className}></span>
                <span>{AVAILABLE_STATE[value].text}</span>
              </span>
            );
          }
        },
        {
          prop: 'gmtCreated',
          label: '入住时间',
          width: '120',
          render: (h, value, row) => {
            return this.$common.timeFormat(value, 'YYYY-MM-DD HH:mm:ss');
          }
        },
        {
          prop: 'gmtModified',
          label: '更新时间',
          width: '120',
          render: (h, value, row) => {
            return this.$common.timeFormat(value, 'YYYY-MM-DD HH:mm:ss');
          }
        },
        {
          prop: 'businessStatus',
          label: '操作',
          width: '120',
          fixed: 'right',
          render: (h, value, row) => {
            const html = ['禁用', '启用'];
            return (
              <div>
                <el-button onClick={() => this.handleDetails(row)} type="text">详情</el-button>
                <el-button onClick={() => this.handleProhibit(row.id, value, '商户')} type="text">{html[value]}</el-button>
              </div>
            );
          }
        }
      ];
    },
    applyDatePickerChange(datePicker) {
      this.searchForm.applyStartDate = datePicker ? datePicker[0] : '';
      this.searchForm.applyEndDate = datePicker ? datePicker[1] : '';
    },

    modifyDatePickerChange(datePicker) {
      this.searchForm.modifyStartDate = datePicker ? datePicker[0] : '';
      this.searchForm.modifyEndDate = datePicker ? datePicker[1] : '';
    },
    handleDetails(row) {
      this.$store.commit('GET_ADUIT_STATUS', {
        step: row.phase,
        status: 0,
        style: 2,
        from: 2,
      });
      this.$router.push({ path: `/merchant/enterApply/info/${row.id}`});
    },
  }
};
</script>
