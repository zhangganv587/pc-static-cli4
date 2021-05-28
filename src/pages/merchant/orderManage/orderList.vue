<!--
 * @Author: 张淦
 * @Date: 2019-12-09 16:59:16
 * @LastEditors: zhanggan
 * @Description: 商户2.0 订单数据页
 * @FilePath: /gpay-ops-static/src/pages/merchant/orderManage/orderList.vue
 -->
<template>
  <div class="finance-summary">
    <el-form
      ref="orderform"
      size="small"
      label-width="130px"
      :inline="true"
      :model="searchForm"
    >
      <el-form-item prop="bizOrderNo">
        <el-input
          v-model="searchForm.bizOrderNo"
          placeholder="业务订单号"
          clearable
          @input="inputChange"
        />
      </el-form-item>
      <el-form-item prop="gpayNo">
        <el-input
          v-model="searchForm.gpayNo"
          placeholder="平台流水号"
          clearable
          @input="inputChange"
        />
      </el-form-item>
      <el-form-item prop="orderStatus">
        <el-select
          v-model="searchForm.orderStatus"
          placeholder="订单状态"
          filterable
          clearable
        >
          <el-option
            v-for="(order, index) in orderStatus"
            :key="`order${index}`"
            :label="order.dictText"
            :value="order.dictValue"
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
            v-for="(deal, index) in payWayList"
            :key="`deal${index}`"
            :label="deal.dictText"
            :value="deal.dictValue"
          />
        </el-select>
      </el-form-item>
      <el-form-item prop="begTime">
        <we-date-picker
          v-model="searchForm.begTime"
          :picker-props="placePicker"
          :max-range="31"
          @currentChange="placeDatePickerChange"
        />
      </el-form-item>
      <el-form-item prop="startDate">
        <we-date-picker
          v-model="searchForm.startDate"
          :picker-props="payPicker"
          :default-range="0"
          :max-range="31"
          @currentChange="payDatePickerChange"
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
    <orderDetails :row-data="row" />
  </div>
</template>

<script type="text/jsx">
import { mapGetters } from 'vuex';
import orderDetails from './component/orderDetails';

export default {
  components: {
    orderDetails,
  },
  data() {
    this.columns = this.getColumns();
    this.queryUrl = '/order/query.json';
    this.placePicker = {
      startPlaceholder: '下单时间开始日期',
      endPlaceholder: '下单时间结束日期'
    };
    this.payPicker = {
      startPlaceholder: '支付时间开始日期',
      endPlaceholder: '支付时间结束日期'
    };
    return {
      searchForm: { // 搜索form
        bizOrderNo: null,
        gpayNo: null,
        orderStatus: null,
        payWay: null,
        createTimeStart: null,
        createTimeEnd: null,
        payTimeStart: null,
        payTimeEnd: null,
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
      orderStatus: 'orderStatus',
    }),
    loading() {
      return this.$store.state.effectLoading[this.queryUrl];
    }
  },
  created() {
    this.$common.judgeState({
      payWayList: 'getPayWayList',
      orderStatus: 'getOrderStatus',
    });
  },
  mounted() {
    this.handleSearch();
  },
  methods: {
    getColumns() {
      const columns = [
        { prop: 'bizOrderNo', label: '业务订单号' },
        { prop: 'gpayNo', label: '平台流水号' },
        { prop: 'amount',
          label: '订单金额（元）',
          width: '120',
          render: (h, value, row) => {
            return <span class="tableRight">{this.$common.moneyFormat(value)}</span>;
          }
        },
        { prop: 'payWay',
          label: '支付方式',
          width: '100',
          render: (h, value, row) => {
            return this.$common.tableFormat(this.payWayList, value, 'dictValue', 'dictText');
          }
        },
        { prop: 'orderStatus',
          label: '订单状态',
          width: '100',
          render: (h, value, row) => {
            return this.$common.tableFormat(this.orderStatus, value, 'dictValue', 'dictText');
          }
        },
        { prop: 'createTime',
          label: '下单时间',
          render: (h, value, row) => {
            return this.$common.timeFormat(value, 'YYYY-MM-DD HH:mm:ss');
          }
        },
        { prop: 'payTime',
          label: '支付时间',
          render: (h, value, row) => {
            return this.$common.timeFormat(value, 'YYYY-MM-DD HH:mm:ss');
          }
        },
        { prop: '',
          label: '操作',
          width: '100',
          render: (h, value, row) => {
            return (
              <el-button onClick={() => this.handleInfo(row, 'orderDetails')} type="text">详情</el-button>
            );
          }
        },
      ];
      return columns;
    },
    inputChange(value) {
      if (value) {
        this.$refs.orderform.clearValidate();
      }
    },
    placeDatePickerChange(datePicker) {
      this.$refs.orderform.clearValidate();
      this.searchForm.createTimeStart = datePicker ? datePicker[0] : '';
      this.searchForm.createTimeEnd = datePicker ? datePicker[1] : '';
    },
    payDatePickerChange(datePicker) {
      this.$refs.orderform.clearValidate();
      this.searchForm.payTimeStart = datePicker ? datePicker[0] : '';
      this.searchForm.payTimeEnd = datePicker ? datePicker[1] : '';
    },
    handleSearch(data) {
      if (this.searchForm.bizOrderNo || this.searchForm.gpayNo || this.searchForm.createTimeStart || this.searchForm.payTimeStart) {
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
          message: '业务订单号、平台流水号、下单时间、支付时间必填其中一项!'
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
