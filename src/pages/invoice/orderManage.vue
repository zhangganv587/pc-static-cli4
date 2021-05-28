<!--
 * @Author: 张淦
 * @Date: 2019-12-09 16:59:16
 * @LastEditors: zhanggan
 * @Description: 发票系统 订单管理页
 * @FilePath: /gpay-ops-static/src/pages/invoice/orderManage.vue
 -->
<template>
  <div class="finance-summary">
    <el-form
      ref="inOrderForm"
      label-width="130px"
      :inline="true"
      :model="searchForm"
    >
      <el-form-item prop="invoiceTitle">
        <el-input
          v-model="searchForm.invoiceTitle"
          placeholder="发票抬头"
          clearable
        />
      </el-form-item>
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
      <el-form-item prop="myDate">
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
          placeholder="请输入开票状态"
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
        <el-button
          v-download="{
            fetchUrl: '/invoice/export.json',
            dataRef: this,
            formRef: 'inOrderForm',
            fileName: '订单管理',
          }"
          type="primary opcity"
        >
          导出
        </el-button>
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
import {BILLING_STATUS_ARR, BILLING_STATUS, ORDER_SOURCE_ARR, ENTERPRISE_STATUS} from '@/utils/constants';
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
    this.ORDER_SOURCE_ARR = ORDER_SOURCE_ARR;
    this.pickerProps = {
      startPlaceholder: '申请开始时间',
      endPlaceholder: '申请结束时间',
    };
    return {
      // 搜索form
      billingStatus: null,
      searchForm: {
        invoiceTitle: null,
        orderNo: null,
        enterpriseId: null,
        orderSourceFlag: null,
        invoiceCode: null,
        invoiceNo: null,
        billingStatus: null,
        enterpriseType: null,
        startDate: null,
        endDate: null,
        invoiceType: 1,
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
        { prop: 'orderNo', label: '发票订单号', width: '200' },
        { prop: 'orderSourceFlag', label: '业务类型', width: '200'},
        { prop: 'enterpriseName', label: '开票主体', width: '280' },
        { prop: 'enterpriseType',
          label: '开票方式',
          width: '100',
          render: (h, value, row) => {
            return ENTERPRISE_STATUS[value];
          }
        },
        { prop: 'invoiceCode', label: '发票代码', width: '140' },
        { prop: 'invoiceNo', label: '发票号码', width: '100' },
        { prop: 'invoiceTitle', label: '发票抬头', width: '200' },
        { prop: 'taxId', label: '税号', width: '200' },
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
          label: '发票金额(元)',
          width: '120',
          render: (h, value, row) => {
            return <span class="tableRight">{this.$common.moneyFormat(value)}</span>;
          }
        },
        { prop: 'userReceiveMail', label: '发送邮箱', width: '210' },
        { prop: 'billingStatus',
          label: '状态',
          width: '100',
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
        { prop: 'failureMessage', label: '失败原因', width: '200' },
        { prop: 'fpqqlsh', label: '开票流水号', width: '200' },
        { prop: 'applyDate',
          label: '申请开票时间',
          width: '190',
          render: (h, value, row) => {
            return this.$common.timeFormat(value, 'YYYY-MM-DD HH:mm:ss');
          }
        },
        { prop: 'reviewCompletionDate',
          label: '审核完成时间',
          width: '190',
          render: (h, value, row) => {
            return this.$common.timeFormat(value, 'YYYY-MM-DD HH:mm:ss');
          }
        },
        { prop: 'completionDate',
          label: '开票完成时间',
          width: '190',
          render: (h, value, row) => {
            return this.$common.timeFormat(value, 'YYYY-MM-DD HH:mm:ss');
          }
        },
        { prop: 'operation', label: '操作人', width: '100' },
        { prop: 'instructions', label: '操作说明', width: '100' },
        { prop: 'billingStatus',
          fixed: 'right',
          label: '操作',
          width: '120',
          render: (h, value, row) => {
            if (row.billingStatus === 1) {
              if (row.enterpriseType === '1') {
                return (<el-button onClick={() => this.handleTargetUrl(row.orderNo)} type="text">审核</el-button>);
              } else {
                return (<el-button onClick={() => this.handleInfo(row, 'drawBill')} type="text">开票确认</el-button>);
              }
            } else if (row.billingStatus === 2 && row.enterpriseType === '1') {
              const url = encodeURIComponent(row.downLoadUrl);
              // return (
              //   <div>
              //     <el-button onClick={() => this.handlePDF(url)} type="text">查看</el-button>
              //     <el-button onClick={() => this.handleEdit(row.orderNo)} type="text">修改</el-button>
              //   </div>
              // );
              return (
                  <div style="display:flex;">
                  <el-button onClick={() => this.handleReMessage(row.orderNo)} type="text">消息重发</el-button>
                  <el-button onClick={() => this.handlePDF(url)} type="text">查看</el-button>
                  </div>
              );
            } else if (row.billingStatus === 4 && row.enterpriseType === '1' && row.fpqqlsh === null) {
              return (<el-button onClick={() => this.handelReset(row.orderNo)} type="text">重试</el-button>);
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
    // 点击重试
    handelReset(orderNo) {
      this.$confirm('确定要将当前开票申请重新提交开票?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'info'
      }).then(() => {
        this.$fetch('/invoice/applyInvoice.json', {
          data: {
            orderNo,
          },
          method: 'post',
        }).then(res => {
          if (res.data) {
            this.$message({
              type: 'success',
              message: '提交成功'
            });
          } else {
            this.$message({
              type: 'error',
              message: '提交失败'
            });
          }
        });
      }).catch(() => {});
    },
    // 点击重新发送
    handleReMessage(orderNo) {
      this.$confirm('确定要重新推送开票成功信息给业务方?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'info'
      }).then(() => {
        this.$fetch('/invoice/sendInvoiceMQ.json', {
          data: {
            orderNo,
          },
          method: 'post',
        }).then(res => {
          if (res.data) {
            this.$message({
              type: 'success',
              message: '推送成功'
            });
          } else {
            this.$message({
              type: 'error',
              message: '推送失败'
            });
          }
        });
      }).catch(() => {});
    },
    datePickerChange(datePicker) {
      this.searchForm.startDate = datePicker ? datePicker[0] : '';
      this.searchForm.endDate = datePicker ? datePicker[1] : '';
    },
    handleTargetUrl(orderNo) {
      this.$router.push({ path: `/invoice/audit/${orderNo}`});
    },
    handlePDF(url) {
      this.$router.push({ path: `/invoice/pdf/${encodeURIComponent(url)}`});
    },
    handleEdit(orderNo) {
      this.$confirm('确定要求改吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'info'
      }).then(() => {
        this.$fetch('/invoice/status.json', {
          data: {
            orderNo,
          },
          method: 'post',
        }).then(res => {
          if (res.code === 0) {
            this.$message({
              type: 'success',
              message: '修改成功'
            });
          }
        });
      }).catch(() => {});
    }
  }
};
</script>
