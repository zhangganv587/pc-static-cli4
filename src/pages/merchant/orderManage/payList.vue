<!--
 * @Author: 张淦
 * @Date: 2019-11-28 11:12:48
 * @LastEditors  : 张淦
 * @Description: 商户2.0废弃
 * @FilePath: /gpay-ops-static/src/pages/orderManage/payList.vue
 -->
<template>
  <div class="finance-summary">
    <el-form ref="form" label-width="130px" :inline="true" :model="searchForm">
      <el-form-item label="业务订单号：" prop="bizOrderNo">
        <el-input
          v-model="searchForm.bizOrderNo"
          placeholder="请输入业务订单号"
          clearable
        />
      </el-form-item>
      <el-form-item label="平台支付流水号：" prop="payLogNo">
        <el-input
          v-model="searchForm.payLogNo"
          placeholder="请输入平台支付流水号"
          clearable
        />
      </el-form-item>
      <el-form-item label="三方支付流水号：" prop="paidNo">
        <el-input
          v-model="searchForm.paidNo"
          placeholder="请输入三方支付流水号"
          clearable
        />
      </el-form-item>
      <el-form-item label="商户：" prop="merchantNo">
        <el-select v-model="searchForm.merchantNo" placeholder="请选择商户">
          <el-option
            v-for="(channel, index) in channelList"
            :key="`channel${index}`"
            :label="channel.name"
            :value="channel.bankCode"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="业务：" prop="bussinessCode">
        <el-select v-model="searchForm.bussinessCode" placeholder="请选择业务">
          <el-option
            v-for="(channel, index) in channelList"
            :key="`channel${index}`"
            :label="channel.name"
            :value="channel.bankCode"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="订单状态：" prop="cardUserName">
        <el-select
          v-model="searchForm.settlementChannel"
          placeholder="请选择订单状态"
        >
          <el-option
            v-for="(channel, index) in channelList"
            :key="`channel${index}`"
            :label="channel.name"
            :value="channel.bankCode"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="收款账号：" prop="merchantName">
        <el-select
          v-model="searchForm.settlementChannel"
          placeholder="请选择收款账号"
        >
          <el-option
            v-for="(channel, index) in channelList"
            :key="`channel${index}`"
            :label="channel.name"
            :value="channel.bankCode"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="支付方式：" prop="payWays">
        <el-select v-model="searchForm.payWays" placeholder="请选择支付方式">
          <el-option
            v-for="(channel, index) in channelList"
            :key="`channel${index}`"
            :label="channel.name"
            :value="channel.bankCode"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="业务线：" prop="businessLine">
        <el-select v-model="searchForm.businessLine" placeholder="请选择业务线">
          <el-option
            v-for="(channel, index) in channelList"
            :key="`channel${index}`"
            :label="channel.name"
            :value="channel.bankCode"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="交易时间：" prop="begTime">
        <el-date-picker
          v-model="searchForm.begTime"
          type="datetimerange"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          value-format="yyyy-MM-dd HH:mm:ss"
        />
      </el-form-item>
      <el-form-item label=" ">
        <el-button type="primary"> 查询 </el-button>
        <v-form-reset :form-ref="$refs['form']" />
        <el-button type="primary"> 导出 </el-button>
      </el-form-item>
    </el-form>
    <v-table
      :data="tableData"
      :columns="columns"
      :pagination="pagination"
      @currentChange="currentChange"
    />
  </div>
</template>

<script type="text/jsx">
import { mapActions, mapGetters } from 'vuex';

export default {
  components: {},
  data() {
    return {
      loading: true,
      searchForm: { // 搜索form
        bizOrderNo: '',
        payLogNo: '',
        paidNo: '',
        refundNo: '',
        merchantNo: '',
        bussinessCode: '',
        accountNo: '',
        businessLine: '',
        payWays: '',
        transType: '',
        startDate: '',
        endDate: '',
      },
      pagination: {
        pageSize: 10,
        pageIndex: 1,
      },
      // table
      tableData: [],
      columns: this.getColumns(),
    };
  },
  computed: {
    ...mapGetters({
      channelList: 'channelList'
    }),
  },
  created() {
    this.getChannelList();
    this.handleSearch();
  },
  methods: {
    ...mapActions({
      getChannelList: 'getChannelList'
    }),
    getColumns() {
      const columns = [
        { prop: 'bizOrderNo', label: '业务订单号', width: '100' },
        { prop: 'payLogNo', label: '平台支付流水号', width: '100' },
        { prop: 'paidNo', label: '三方支付流水号', width: '100' },
        { prop: 'amount',
          label: '订单金额（元）',
          width: '100',
          render: (h, value, row) => {
            return <span class="tableRight">{this.$common.moneyFormat(value)}</span>;
          },
        },
        { prop: 'totalAmount',
          label: '实际支付金额（元）',
          width: '120',
          render: (h, value, row) => {
            return <span class="tableRight">{this.$common.moneyFormat(value)}</span>;
          },
        },
        { prop: 'payWays',
          label: '支付方式',
          width: '120',
          render: (h, value, row) => {

          },
        },
        { prop: 'orderStatus',
          label: '订单状态',
          width: '100',
          render: (h, value, row) => {

          },
        },
        { prop: 'accountNo', label: '收款账号', width: '120' },
        { prop: 'otherAccountNo', label: '支付账号', width: '200' },
        { prop: 'merchantNo', label: '商户号', width: '100' },
        { prop: 'bussinessCode', label: '业务编号', width: '100' },
        { prop: 'businessName', label: '业务名称', width: '100' },
        { prop: 'businessLine', label: '业务线', width: '100' },
        { prop: 'gmtCreated',
          label: '创建时间',
          width: '100',
          render: (h, value, row) => {

          },
        },
        { prop: 'paidTime',
          label: '支付时间',
          width: '100',
          render: (h, value, row) => {

          },
        },
        { prop: 'expiredTime',
          label: '过期时间',
          width: '100',
          render: (h, value, row) => {

          },
        },
        { prop: 'memo', label: '备注', width: '100' },
      ];
      return columns;
    },
    handleSearch() {
      const transactionDate = this.searchForm.startDate;
      this.searchForm.startDate = transactionDate[0];
      this.searchForm.endDate = transactionDate[1];

      this.$fetch('/subAccount/query.json', {
        method: 'post',
        data: {...this.searchForm, ...this.pagination}
      }).then(res => {
        this.tableData = res.data.dataList;
        this.pagination.totalNum = res.data.totalNum;
      });
    },
    currentChange(val) {
      this.pagination = {...this.pagination, ...val};
      this.handleSearch();
    },
  }
};
</script>
