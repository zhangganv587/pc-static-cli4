<template>
  <div class="finance-summary">
    <el-form ref="form" label-width="130px" :inline="true" :model="searchForm">
      <el-form-item prop="bizRefundNo">
        <el-input
          v-model="searchForm.bizRefundNo"
          placeholder="业务退款订单号"
          clearable
          @change="inputChange"
        />
      </el-form-item>
      <el-form-item prop="refundNo">
        <el-input
          v-model="searchForm.refundNo"
          placeholder="平台退款流水号"
          clearable
          @change="inputChange"
        />
      </el-form-item>
      <el-form-item prop="refundStatus">
        <el-select
          v-model="searchForm.refundStatus"
          placeholder="退款状态"
          filterable
          clearable
        >
          <el-option
            v-for="(refund, index) in refundStatus"
            :key="`refund${index}`"
            :label="refund.dictText"
            :value="refund.dictValue"
          />
        </el-select>
      </el-form-item>
      <el-form-item prop="payWay">
        <el-select
          v-model="searchForm.payWay"
          placeholder="支付方式"
          filterable
          clearable
        >
          <el-option
            v-for="(payway, index) in payWayList"
            :key="`payway${index}`"
            :label="payway.dictText"
            :value="payway.dictValue"
          />
        </el-select>
      </el-form-item>
      <el-form-item prop="createTime">
        <we-date-picker
          v-model="searchForm.createTime"
          :picker-props="refundPicker"
          :max-range="31"
          @currentChange="refundDatePickerChange"
        />
      </el-form-item>
      <el-form-item>
        <el-button ref="formSubmit" type="primary" @click="handleSearch">
          查询
        </el-button>
        <v-form-reset :form-ref="$refs['orderform']" />
      </el-form-item>
    </el-form>
    <v-table
      v-loading="loading"
      :data="tableData"
      :columns="columns"
      :pagination="pagination"
      @currentChange="currentChange"
    />
    <refund-details :row-data="row" />
    <refund-particular :biz-order-no="row.bizOrderNo" />
    <refund-update :row-data="row" />
  </div>
</template>

<script type="text/jsx">
import { mapGetters } from 'vuex';
import refundDetails from './component/refundDetails';
import refundParticular from './component/refundParticular';
import refundUpdate from './component/refundUpdate';

export default {
  components: {
    'refund-details': refundDetails,
    'refund-particular': refundParticular,
    'refund-update': refundUpdate,
  },
  data() {
    this.columns = this.getColumns();
    this.queryUrl = '/refundOrder/query.json';
    this.refundPicker = {
      startPlaceholder: '退款时间开始日期',
      endPlaceholder: '退款时间结束日期'
    };
    return {
      searchForm: { // 搜索form
        bizRefundNo: '',
        refundNo: '',
        refundStatus: '',
        payWay: '',
        createTimeStart: '',
        createTimeEnd: '',
      },
      // 分页
      pagination: {
        pageSize: 10,
        pageIndex: 1,
        totalNum: 0,
      },
      // table
      tableData: [],
      // dialog
      row: {},
    };
  },
  computed: {
    ...mapGetters({
      payWayList: 'payWayList',
      refundStatus: 'refundStatus',
      callBackStatus: 'callBackStatus',
    }),
    loading() {
      return this.$store.state.effectLoading[this.queryUrl];
    }
  },
  created() {
    this.$common.judgeState({
      payWayList: 'getPayWayList',
      refundStatus: 'getRefundStatus',
      callBackStatus: 'getCallBackStatus',
    });
  },
  mounted() {
    this.handleSearch();
  },
  methods: {
    getColumns() {
      const columns = [
        { prop: 'refundNo', label: '平台退款流水号'},
        { prop: 'bizRefundNo', label: '业务退款订单号' },
        { prop: 'amount',
          label: '退款金额(元)',
          width: '120',
          render: (h, value, row) => {
            return <span class="tableRight">{this.$common.moneyFormat(value)}</span>;
          },
        },
        { prop: 'totalAmount',
          label: '实际退款金额(元)',
          width: '140',
          render: (h, value, row) => {
            return <span class="tableRight">{this.$common.moneyFormat(value)}</span>;
          },
        },
        { prop: 'payWay',
          label: '支付方式',
          width: '100',
          render: (h, value, row) => {
            return this.$common.tableFormat(this.payWayList, value, 'dictValue', 'dictText');
          },
        },
        { prop: 'refundStatus',
          label: '退款状态',
          width: '100',
          render: (h, value, row) => {
            return this.$common.tableFormat(this.refundStatus, value, 'dictValue', 'dictText');
          },
        },
        { prop: 'refundTime',
          label: '退款时间',
          render: (h, value, row) => {
            return this.$common.timeFormat(value, 'YYYY-MM-DD HH:mm:ss');
          },
        },
        { prop: 'callbackTime',
          label: '通知时间',
          render: (h, value, row) => {
            return this.$common.timeFormat(value, 'YYYY-MM-DD HH:mm:ss');
          },
        },
        { prop: 'callbackStatus',
          label: '通知状态',
          width: '100',
          render: (h, value, row) => {
            return this.$common.tableFormat(this.callBackStatus, value, 'dictValue', 'dictText');
          },
        },
        { prop: '',
          label: '操作',
          width: '100',
          render: (h, value, row) => {
            return (
              <div>
                <el-button onClick={() => this.handleInfo(row, 'refundDetails')} type="text">查看</el-button>
                <el-button onClick={() => this.handleInfo(row, 'refundUpdate')} type="text">
                  更新
                </el-button>
                <el-button onClick={() => this.handleInfo(row, 'refundDetail')} type="text">
                  分账明细
                </el-button>
              </div>
            );
          },
        },
      ];
      return columns;
    },
    inputChange(value) {
      if (value) {
        this.$refs.form.clearValidate();
      }
    },
    refundDatePickerChange(datePicker) {
      this.$refs.form.clearValidate();
      this.searchForm.createTimeStart = datePicker ? datePicker[0] : '';
      this.searchForm.createTimeEnd = datePicker ? datePicker[1] : '';
    },
    handleSearch(data) {
      if (this.searchForm.bizRefundNo || this.searchForm.refundNo || this.searchForm.createTimeStart) {
        this.$fetch(this.queryUrl, {
          method: 'post',
          data: {
            ...this.searchForm,
            ...data
          },
        }).then(res => {
          if (res.code === 0) {
            this.tableData = res.data.dataList;
            this.pagination.pageIndex = res.data.pageNum;
            this.pagination.pageSize = res.data.pageSize;
            this.pagination.totalNum = res.data.totalNum;
          }
        }).catch(() => {});
      } else {
        this.$message({
          type: 'error',
          message: '业务退款订单号、平台退款流水号、退款时间必填其中一项!'
        });
      }
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
  }
};
</script>
