<!--
 * @Author: 张淦
 * @Date: 2019-12-09 16:59:16
 * @LastEditors: zhanggan
 * @Description: 发票系统 发票企业管理页
 * @FilePath: /gpay-ops-static/src/pages/invoice/invoiceCompany.vue
 -->
<template>
  <div class="invoice-company">
    <el-form
      ref="companyForm"
      label-width="130px"
      :inline="true"
      :model="searchForm"
    >
      <el-form-item prop="id">
        <el-input v-model="searchForm.id" placeholder="企业ID" clearable />
      </el-form-item>
      <el-form-item prop="enterpriseName">
        <el-input
          v-model="searchForm.enterpriseName"
          placeholder="企业名称"
          clearable
        />
      </el-form-item>
      <el-form-item prop="enterpriseTaxCode">
        <el-input
          v-model="searchForm.enterpriseTaxCode"
          placeholder="公司税号"
          clearable
        />
      </el-form-item>
      <el-form-item prop="status">
        <el-select
          v-model="searchForm.status"
          placeholder="开票状态"
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
        <v-form-reset :form-ref="$refs['companyForm']" />
      </el-form-item>
    </el-form>
    <v-add-btn @click="handleInfo({}, 'invoiceCompany')">
      新增开票企业
    </v-add-btn>
    <v-table
      v-loading="loading"
      :data="tableData"
      :columns="columns"
      type="index"
      :pagination="pagination"
      @currentChange="currentChange"
    />
    <company-dialog :row-data="row" />
  </div>
</template>

<script type="text/jsx">
import companyDialog from './companyDialog.vue';
import tableFormMixin from '@/mixins/tableFormMixin';
import prohibitMixin from '@/mixins/prohibitMixin';
import { AVAILABLE_STATE, DICT_STATUS, ENTERPRISE_STATUS } from '@/utils/constants.js';

export default {
  components: {
    'company-dialog': companyDialog,
  },
  mixins: [tableFormMixin, prohibitMixin],
  data() {
    this.columns = this.getColumns();
    this.queryUrl = '/enterprise/query.json';
    this.prohibitArr = [
      {
        url: '/enterprise/disable.json',
        message: '禁用'
      },
      {
        url: '/enterprise/enable.json',
        message: '启用'
      },
    ];
    this.availableState = AVAILABLE_STATE;
    return {
      rangeData: [],
      // 搜索form
      searchForm: {
        id: null,
        enterpriseName: null,
        enterpriseTaxCode: null,
        status: null,
      },
    };
  },
  methods: {
    getColumns() {
      const columns = [
        { prop: 'id', label: '企业ID' },
        { prop: 'enterpriseName', label: '企业名称' },
        { prop: 'enterpriseTaxCode', label: '公司税号'},
        { prop: 'bank', label: '开户银行' },
        { prop: 'saleAccount', label: '银行账号' },
        { prop: 'saleAddress', label: '地址'},
        { prop: 'salePhone', label: '电话'},
        { prop: 'payee', label: '收款人'},
        { prop: 'reviewer', label: '复核人' },
        { prop: 'issuer', label: '开票人' },
        { prop: 'enterpriseType',
          label: '开票方式',
          width: '100',
          render: (h, value, row) => {
            return ENTERPRISE_STATUS[value];
          }
        },
        { prop: 'status',
          label: '开票状态',
          width: '100',
          render: (h, value, row) => {
            return AVAILABLE_STATE[value];
          }
        },
        { prop: 'operation', label: '操作人' },
        { prop: 'operatingDate',
          label: '操作时间',
          render: (h, value, row) => {
            return this.$common.timeFormat(value, 'YYYY-MM-DD HH:mm:ss');
          }
        },
        { prop: 'status',
          label: '操作',
          width: '100',
          render: (h, value, row) => {
            return (
              <div>
                <el-button onClick={() => this.handleInfo(row, 'invoiceCompany')} type="text">修改</el-button>
                <el-button onClick={() => this.handleProhibit(row.id, value, '公司')} type="text">{DICT_STATUS[value]}</el-button>
              </div>
            );
          }
        },
      ];
      return columns;
    },
    placeDatePickerChange(datePicker) {
      this.searchForm.startDate = datePicker ? datePicker[0] : '';
      this.searchForm.endDate = datePicker ? datePicker[1] : '';
    },
  }
};
</script>
