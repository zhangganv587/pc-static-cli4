<template>
  <div class="accountDividing">
    <div class="serchBox">
      <el-form
        ref="form"
        label-width="130px"
        :inline="true"
        :model="searchForm"
      >
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
        <el-form-item label="平台退款流水号：" prop="refundNo">
          <el-input
            v-model="searchForm.refundNo"
            placeholder="请输入平台退款流水号"
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
        <el-form-item label="业务编号：" prop="businessNo">
          <el-input
            v-model="searchForm.businessNo"
            placeholder="请输入业务编号"
            clearable
          />
        </el-form-item>
        <el-form-item label="收款账号：" prop="accountNo">
          <el-select
            v-model="searchForm.accountNo"
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
        <el-form-item label="三方退款流水号：" prop="refundLogNo">
          <el-input
            v-model="searchForm.refundLogNo"
            placeholder="请输入第三方退款流水号"
            clearable
          />
        </el-form-item>
        <el-form-item label="业务线：" prop="businessLine">
          <el-select
            v-model="searchForm.businessLine"
            placeholder="请选择业务线"
          >
            <el-option
              v-for="(channel, index) in channelList"
              :key="`channel${index}`"
              :label="channel.name"
              :value="channel.bankCode"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="交易方式：" prop="payWayCode">
          <el-select
            v-model="searchForm.payWayCode"
            placeholder="请选择交易方式"
          >
            <el-option
              v-for="(channel, index) in channelList"
              :key="`channel${index}`"
              :label="channel.name"
              :value="channel.bankCode"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="交易类型：" prop="transType">
          <el-select
            v-model="searchForm.transType"
            placeholder="请选择交易类型"
          >
            <el-option
              v-for="(channel, index) in channelList"
              :key="`channel${index}`"
              :label="channel.name"
              :value="channel.bankCode"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="交易时间：" prop="rangeData">
          <we-date-picker
            v-model="searchForm.rangeData"
            :default-range="30"
            :max-range="90"
            @currentChange="dateChangePicker"
          />
        </el-form-item>
        <el-form-item label=" ">
          <v-form-submit
            action="/subAccount/query.json"
            :form-ref="$refs['form']"
          />
          <v-form-reset :form-ref="$refs['form']" />
        </el-form-item>
      </el-form>
    </div>
    <div class="tableBox">
      <v-table
        v-loading="loading"
        :data="tableData"
        :columns="columns"
        :pagination="pagination"
        @currentChange="currentChange"
      />
    </div>
  </div>
</template>

<script type="text/jsx">
import { mapActions, mapGetters } from 'vuex';
import VFormSubmit from '@/components/form/v-form-submit.vue';

export default {
  components: {
    'v-form-submit': VFormSubmit,
  },
  data() {
    return {
      loading: true,
      searchForm: { // 搜索form
        bizOrderNo: '',
        payLogNo: '',
        paidNo: '',
        refundNo: '',
        merchantNo: '',
        businessNo: '',
        accountNo: '',
        refundLogNo: '',
        businessLine: '',
        payWayCode: '',
        rangeData: [],
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
  },
  mounted() {
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
        { prop: 'refundNo', label: '平台退款流水号', width: '100' },
        { prop: 'refundLogNo', label: '三方退款流水号', width: '100' },
        { prop: 'tradeAmount',
          label: '交易金额(元)',
          width: '100',
          render: (h, value, row) => {
            return <span class="tableRight">{this.$common.moneyFormat(value)}</span>;
          },
        },
        { prop: 'tradeType',
          label: '交易类型',
          width: '120',
          render: (h, value, row) => {

          },
        },
        { prop: 'payWays',
          label: '交易方式',
          width: '120',
          render: (h, value, row) => {

          },
        },
        { prop: 'otherAccountNo', label: '支付账号', width: '100' },
        { prop: 'accountNo', label: '收款账号', width: '120' },
        { prop: 'merchantNo', label: '商户号', width: '200' },
        { prop: 'bussinessCode', label: '业务编号', width: '200' },
        { prop: 'businessName',
          label: '业务线名称',
          width: '100',
          render: (h, value, row) => {

          },
        },
        { prop: 'statDate',
          label: '交易时间',
          width: '100',
          render: (h, value, row) => {
            return this.$common.timeFormat(value, 'YYYY-MM-DD HH:mm:ss');
          },
        },
        { prop: 'gmtCreated',
          label: '创建时间',
          width: '100',
          render: (h, value, row) => {
            return this.$common.timeFormat(value, 'YYYY-MM-DD HH:mm:ss');
          },
        },
      ];
      return columns;
    },
    handleSearch() {
      this.$fetch('/subAccount/query.json', {
        method: 'post',
        data: {...this.searchForm, ...this.pagination}
      }).then(res => {
        this.loading = false;
        if (res.data) {
          this.tableData = res.data.dataList;
          this.pagination.totalNum = res.data.totalNum;
        } else {
          this.tableData = [];
          this.pagination.totalNum = 0;
        }
      });
    },
    currentChange(val) {
      this.pagination = {...this.pagination, ...val};
      this.handleSearch();
    },
    dateChangePicker(datePicker) {
      this.searchForm.startDate = datePicker[0] || '';
      this.searchForm.endDate = datePicker[1] || '';
    },
  }
};
</script>
