<template>
  <div class="finance-summary">
    <el-form ref="form" label-width="130px" :inline="true" :model="searchForm">
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
      <el-form-item label="收款账号：" prop="accountNo">
        <el-select v-model="searchForm.accountNo" placeholder="请选择收款账号">
          <el-option
            v-for="(channel, index) in channelList"
            :key="`channel${index}`"
            :label="channel.name"
            :value="channel.bankCode"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="三方退款流水号：" prop="paidNo">
        <el-input
          v-model="searchForm.paidNo"
          placeholder="请输入第三方退款流水号"
          clearable
        />
      </el-form-item>
      <el-form-item label="业务：" prop="businessNo">
        <el-select v-model="searchForm.businessNo" placeholder="请选择业务">
          <el-option
            v-for="(channel, index) in channelList"
            :key="`channel${index}`"
            :label="channel.name"
            :value="channel.bankCode"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="业务签约公司：" prop="ownerCompany">
        <el-select
          v-model="searchForm.ownerCompany"
          placeholder="请选择业务签约公司"
        >
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
      <el-form-item label="交易方式：" prop="tran">
        <el-select v-model="searchForm.tran" placeholder="请选择交易方式">
          <el-option
            v-for="(channel, index) in channelList"
            :key="`channel${index}`"
            :label="channel.name"
            :value="channel.bankCode"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="交易类型：" prop="transType">
        <el-select v-model="searchForm.transType" placeholder="请选择交易类型">
          <el-option
            v-for="(channel, index) in channelList"
            :key="`channel${index}`"
            :label="channel.name"
            :value="channel.bankCode"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="交易时间：" prop="datePicker">
        <el-date-picker
          v-model="searchForm.datePicker"
          type="datetimerange"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          value-format="yyyy-MM-dd HH:mm:ss"
          @change="dateChangePicker"
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
        merchantNo: '',
        accountNo: '',
        paidNo: '',
        businessNo: '',
        ownerCompany: '',
        businessLine: '',
        tran: '',
        transType: '',
        startDate: '',
        endDat: ''
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
        { prop: 'merchantNo', label: '商户号', width: '100' },
        { prop: 'merchantName', label: '商户名称', width: '100' },
        { prop: 'bussinessCode', label: '业务编号', width: '100' },
        { prop: 'businessName', label: '业务名称', width: '100'},
        { prop: 'ownerCompany', label: '业务签约公司', width: '100'},
        { prop: 'businessLine',
          label: '业务线',
          width: '120',
          render: (h, value, row) => {

          },
        },
        { prop: 'tradeType',
          label: '交易类型',
          width: '100',
          render: (h, value, row) => {

          },
        },
        { prop: 'tradeCount', label: '交易笔数', width: '120' },
        { prop: 'tradeTotalAmount',
          label: '交易金额（元）',
          width: '200',
          render: (h, value, row) => {
            return <span class="tableRight">{this.$common.moneyFormat(value)}</span>;
          },
        },
        { prop: 'payWays',
          label: '交易方式',
          width: '100',
          render: (h, value, row) => {

          },
        },
        { prop: 'accountNo', label: '收款账号', width: '100' },
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
      this.searchForm.startDate = datePicker[0];
      this.searchForm.endDate = datePicker[1];
    },
  }
};
</script>
