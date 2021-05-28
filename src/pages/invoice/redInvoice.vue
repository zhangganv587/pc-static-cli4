<!--
 * @Author: 张淦
 * @Date: 2019-12-09 16:59:16
 * @LastEditors: zhanggan
 * @Description: 发票系统 红票订单管理页
 * @FilePath: /gpay-ops-static/src/pages/invoice/redInvoice.vue
 -->
<template>
  <div class="finance-summary">
    <el-form
      ref="inOrderForm"
      label-width="130px"
      :inline="true"
      :model="searchForm"
    >
      <el-form-item prop="orderNo">
        <el-input v-model="searchForm.orderNo" placeholder="订单号" clearable />
      </el-form-item>
      <el-form-item prop="enterpriseId">
        <el-select
          v-model="searchForm.enterpriseId"
          placeholder="开票主体"
          filterable
          clearable
        >
          <el-option
            v-for="(billing, index) in enterpriseList"
            :key="`billing${index}`"
            :label="billing.enterpriseName"
            :value="billing.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item prop="orderSourceFlag">
        <el-select
          v-model="searchForm.orderSourceFlag"
          placeholder="业务类型"
          filterable
          clearable
        >
          <el-option
            v-for="(billing, index) in bizInvoiceList"
            :key="`billing${index}`"
            :label="billing.dictText"
            :value="billing.dictValue"
          />
        </el-select>
      </el-form-item>
      <el-form-item prop="rangeData">
        <we-date-picker
          v-model="rangeData"
          :picker-props="pickerData"
          :default-range="0"
          :max-range="31"
          @currentChange="datePickerChange"
        />
      </el-form-item>
      <el-form-item prop="invoiceCode">
        <el-input
          v-model="searchForm.invoiceCode"
          placeholder="发票代码"
          clearable
        />
      </el-form-item>
      <el-form-item prop="invoiceNo">
        <el-input
          v-model="searchForm.invoiceNo"
          placeholder="发票号码"
          clearable
        />
      </el-form-item>
      <el-form-item prop="billingStatus">
        <el-select
          v-model="billingStatus"
          placeholder="开票状态"
          filterable
          clearable
        >
          <el-option
            v-for="(billing, index) in BILLING_STATUS_ARR"
            :key="`billing${index}`"
            :label="billing.label"
            :value="billing.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          size="small"
          @click="handleSearch({ pageIndex: 1, pageSize: 10 })"
        >
          查询
        </el-button>
        <v-form-reset :form-ref="$refs['inOrderForm']" />
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
    <detailsDialog :row-data="row" />
    <drawBillDialog :row-data="row" />
  </div>
</template>

<script type="text/jsx">
import { mapGetters } from 'vuex';
import detailsDialog from './invoiceDetailsDialog.vue';
import {BILLING_STATUS_ARR, BILLING_STATUS, ENTERPRISE_STATUS} from '@/utils/constants';
import drawBillDialog from './drawBillDialog.vue';

export default {
  components: {
    detailsDialog,
    drawBillDialog,
  },
  data() {
    this.columns = this.getColumns();
    this.queryUrl = '/invoice/query.json';
    this.pickerData = {
      startPlaceholder: '申请开始时间',
      endPlaceholder: '申请结束时间',
    };
    this.BILLING_STATUS_ARR = BILLING_STATUS_ARR;
    return {
      // 搜索form
      billingStatus: null,
      searchForm: {
        orderNo: null,
        enterpriseId: null,
        orderSourceFlag: null,
        invoiceCode: null,
        invoiceNo: null,
        billingStatus: null,
        enterpriseType: null,
        startDate: null,
        endDate: null,
        invoiceType: 2,
      },
      rangeData: [],
      row: [],
      // 分页
      pagination: {
        pageSize: 10,
        pageIndex: 1,
        totalNum: 0,
      },
      // table
      tableData: [],
    };
  },
  computed: {
    ...mapGetters({
      enterpriseList: 'enterpriseList',
      bizInvoiceList: 'bizInvoiceList',
    }),
    loading() {
      return this.$store.state.effectLoading[this.queryUrl];
    }
  },
  created() {
    this.$common.judgeState({
      enterpriseList: 'getEnterpriseList',
      bizInvoiceList: 'getBizInvoiceList'
    });
    this.handleSearch();
  },
  methods: {
    getColumns() {
      const columns = [
        { prop: 'orderNo', label: '红字发票订单号' },
        { prop: 'originOrderNo', label: '原发票订单号' },
        { prop: 'orderSourceFlag', label: '业务类型'},
        { prop: 'enterpriseName', label: '开票主体' },
        { prop: 'invoiceType',
          label: '发票类型',
          render: (h, value, row) => {
            return '电子发票';
          }
        },
        { prop: 'enterpriseType',
          label: '开票方式',
          width: '100',
          render: (h, value, row) => {
            return ENTERPRISE_STATUS[value];
          }
        },
        { prop: 'invoiceCode', label: '红字发票代码'},
        { prop: 'invoiceNo', label: '红字发票号码'},
        { prop: 'titleType', label: '抬头类型'},
        { prop: 'invoiceTitle', label: '发票抬头' },
        { prop: 'taxId', label: '税号' },
        { prop: 'address', label: '地址' },
        { prop: 'phoneNo', label: '电话' },
        { prop: 'bankType', label: '开户银行' },
        { prop: 'bankAccount', label: '银行账号' },
        { prop: 'invoiceDetailList',
          label: '开票内容',
          width: '100',
          render: (h, value, row) => {
            return (
            <el-button onClick={() => this.handleInfo(row.invoiceDetailList, 'invoiceDetails')} type="text">明细</el-button>
            );
          }
        },
        { prop: 'payAmt',
          label: '红字发票金额(元)',
          width: '100',
          render: (h, value, row) => {
            return <span class="tableRight">{this.$common.moneyFormat(value)}</span>;
          }
        },
        { prop: 'userReceiveMail', label: '发送邮箱' },
        { prop: 'remark', label: '备注' },
        { prop: 'payee', label: '收款人' },
        { prop: 'reviewer', label: '复核人' },
        { prop: 'issuer', label: '开票人' },
        { prop: 'billingStatus',
          label: '状态',
          render: (h, value, row) => {
            if (value === 1) {
              if (row.enterpriseType === '1') {
                return '待审核';
              } else if (row.enterpriseType === '0') {
                return '待开票';
              }
            } else {
              return BILLING_STATUS[value];
            }
          }
        },
        { prop: 'applyDate',
          label: '申请开票时间',
          render: (h, value, row) => {
            return this.$common.timeFormat(value, 'YYYY-MM-DD HH:mm:ss');
          }
        },
        { prop: 'reviewCompletionDate',
          label: '审核完成时间',
          render: (h, value, row) => {
            return this.$common.timeFormat(value, 'YYYY-MM-DD HH:mm:ss');
          }
        },
        { prop: 'completionDate',
          label: '开票完成时间',
          render: (h, value, row) => {
            return this.$common.timeFormat(value, 'YYYY-MM-DD HH:mm:ss');
          }
        },
        { prop: 'operation', label: '操作人' },
        { prop: 'instructions', label: '操作说明' },
        { prop: 'operatingDate',
          label: '操作时间',
          render: (h, value, row) => {
            return this.$common.timeFormat(value, 'YYYY-MM-DD HH:mm:ss');
          }
        },
        { prop: '',
          label: '操作',
          width: '100',
          render: (h, value, row) => {
            if (row.billingStatus === 1 && row.enterpriseType === '1') {
              return (
                <el-button onClick={() => this.handleTargetUrl(row.orderNo)} type="text">审核</el-button>
              );
            } else if (row.billingStatus === 2 && row.enterpriseType === '1') {
              const url = encodeURIComponent(row.downLoadUrl);
              return (
                <el-button onClick={() => this.handlePDF(url)} type="text">查看</el-button>
              );
            } else if (row.billingStatus === 1 && row.enterpriseType === '0') {
              return (
                <el-button onClick={() => this.handleInfo(row, 'drawBill')} type="text">开票确认</el-button>
              );
            } else {
              return '';
            }
          }
        },
      ];
      return columns;
    },
    handleSearch(data) {
      if (this.billingStatus === '10') {
        this.searchForm.billingStatus = 1;
        this.searchForm.enterpriseType = 0;
      } else if (this.billingStatus === '11') {
        this.searchForm.billingStatus = 1;
        this.searchForm.enterpriseType = 1;
      } else {
        this.searchForm.billingStatus = this.billingStatus;
        this.searchForm.enterpriseType = null;
      }
      this.$fetch(this.queryUrl, {
        method: 'post',
        data: {
          ...this.searchForm,
          ...this.pagination,
          ...data,
        }
      }).then(res => {
        this.tableData = res.data.dataList;
        this.pagination.pageIndex = res.data.pageNum;
        this.pagination.pageSize = res.data.pageSize;
        this.pagination.totalNum = res.data.totalNum;
      });
    },
    currentChange(val) {
      this.handleSearch({...this.pagination, ...val});
    },
    handleInfo(row, dialogId) {
      this.row = row;
      this.$eventBus.$emit('dialog-visible', {
        visible: true,
        dialogId
      });
    },
    datePickerChange(datePicker) {
      this.searchForm.startDate = datePicker ? datePicker[0] : '';
      this.searchForm.endDate = datePicker ? datePicker[1] : '';
    },
    handleTargetUrl(orderNo) {
      this.$router.push({ path: `/invoice/audit/${orderNo}`});
    },
    handleSubmitForm(orderNo) {
      this.$confirm('确认开票完成?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {

      }).catch(() => {});
    },
    handlePDF(url) {
      this.$router.push({ path: `/invoice/pdf/${encodeURIComponent(url)}`});
    }
  }
};
</script>
