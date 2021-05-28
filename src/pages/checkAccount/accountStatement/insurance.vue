<!--
 * @Author: 张淦
 * @Date: 2020-06-11 19:47:27
 * @LastEditors: zhanggan
 * @Description: 对账管理 - 医保对账
 * @FilePath: /gpay-ops-static/src/pages/checkAccount/accountStatement/insurance.vue
-->
<template>
  <div class="insurance-statement">
    <el-form
      ref="insuranceStatement"
      label-width="130px"
      :inline="true"
      :model="searchForm"
      :rules="rules"
    >
      <el-form-item prop="createTime">
        <we-date-picker
          v-model="createTime"
          :picker-props="creatPickerProps"
          :default-range="30"
          :max-range="31"
          @currentChange="creatDatePickerChange"
        />
      </el-form-item>
      <el-form-item prop="modifyTime">
        <we-date-picker
          v-model="modifyTime"
          :picker-props="modifyPickerProps"
          :default-range="0"
          :max-range="31"
          @currentChange="modifyDatePickerChange"
        />
      </el-form-item>
      <el-form-item prop="hospitalName">
        <el-autocomplete
          v-model="searchForm.hospitalName"
          popper-class="my-autocomplete"
          :fetch-suggestions="partnerQuerySearch"
          placeholder="机构名称"
          @select="handlePartnerSelect"
        >
          <template slot-scope="{ item }">
            {{ item.channelPartnerName }}
          </template>
        </el-autocomplete>
      </el-form-item>
      <el-form-item prop="miCenterName">
        <el-autocomplete
          v-model="searchForm.miCenterName"
          popper-class="my-autocomplete"
          :fetch-suggestions="accountQuerySearch"
          placeholder="医保名称"
          @select="handleAccountSelect"
        >
          <template slot-scope="{ item }">
            {{ item.channelAccountName }}
          </template>
        </el-autocomplete>
      </el-form-item>
      <el-form-item prop="transactionType">
        <el-select
          v-model="searchForm.transactionType"
          placeholder="交易类型"
          filterable
          clearable
        >
          <el-option
            v-for="(value, key) in TRANSACTION_TYPE_LIST"
            :key="key"
            :label="value"
            :value="key"
          />
        </el-select>
      </el-form-item>
      <el-form-item prop="accountResult">
        <el-select
          v-model="searchForm.accountResult"
          placeholder="对账结果"
          filterable
          clearable
          @change="changeResult"
        >
          <el-option
            v-for="(value, key) in ACCOUNT_RESULT_STATUS"
            :key="key"
            :label="value"
            :value="key"
          />
        </el-select>
      </el-form-item>
      <el-form-item prop="oriBizOrderNo">
        <el-input
          v-model="searchForm.oriBizOrderNo"
          placeholder="原始业务订单号"
          clearable
        />
      </el-form-item>
      <el-form-item prop="billNo">
        <el-input
          v-model="searchForm.billNo"
          placeholder="业务订单号"
          clearable
        />
      </el-form-item>
      <el-form-item prop="bizOrderNo">
        <el-input
          v-model="searchForm.bizOrderNo"
          placeholder="支付流水号"
          clearable
        />
      </el-form-item>
      <el-form-item prop="miTradeNo">
        <el-input
          v-model="searchForm.miTradeNo"
          placeholder="医保流水号"
          clearable
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleSearch('clickSearch')">
          查询
        </el-button>
        <v-form-reset :form-ref="$refs['insuranceStatement']" />
        <el-button
          v-download="{
            fetchUrl: '/medicalAccount/exportResult.json',
            dataRef: this,
            formRef: 'insuranceStatement',
            fileName: '医保对账列表',
          }"
          type="primary opcity"
        >
          导出
        </el-button>
      </el-form-item>
    </el-form>
    <div class="text-area">
      <div class="text-left-area">
        <div class="flex-1">收银台侧</div>
        <div class="flex-2">
          <p>支付总笔数 : {{ $common.setCount(totalFetchData.gpayPaySum) }}</p>
          <p>
            退款总笔数 : {{ $common.setCount(totalFetchData.gpayRefundSum) }}
          </p>
        </div>
        <div class="flex-2">
          <p>
            支付总金额 : {{ $common.setMoney(totalFetchData.gpayPayAmount) }}
          </p>
          <p>
            退款总金额 : {{ $common.setMoney(totalFetchData.gpayRefundAmount) }}
          </p>
        </div>
      </div>
      <div class="text-right-area">
        <div class="flex-1">渠道侧</div>
        <div class="flex-2">
          <p>支付总笔数 : {{ $common.setCount(totalFetchData.miPaySum) }}</p>
          <p>退款总笔数 ：{{ $common.setCount(totalFetchData.miRefundSum) }}</p>
        </div>
        <div class="flex-2">
          <p>支付总金额 ：{{ $common.setMoney(totalFetchData.miPayAmount) }}</p>
          <p>
            退款总金额 ：{{ $common.setMoney(totalFetchData.miRefundAmount) }}
          </p>
        </div>
      </div>
    </div>
    <v-table
      v-loading="loading"
      type="index"
      :data="tableDataList"
      :columns="columns"
      :pagination="pagination"
      @currentChange="currentChange"
    />
    <balance-bills :row-data="row" @dialogClose="dialogClose" />
  </div>
</template>

<script type="text/jsx">
import balanceBills from '../component/balanceBillsDialog';
import { TRANSACTION_TYPE_LIST, ACCOUNT_RESULT_STATUS } from '@/utils/constants';

export default {
  components: {
    'balance-bills': balanceBills,
  },
  data() {
    this.columns = this.getColumns();
    this.TRANSACTION_TYPE_LIST = TRANSACTION_TYPE_LIST;
    this.ACCOUNT_RESULT_STATUS = ACCOUNT_RESULT_STATUS;
    this.queryUrl = '/medicalAccount/pageList.json';
    this.creatPickerProps = {
      startPlaceholder: '对账开始时间',
      endPlaceholder: '对账结束时间',
    };
    this.modifyPickerProps = {
      startPlaceholder: '交易开始时间',
      endPlaceholder: '交易结束时间',
    };
    var timeValidator = (rule, value, callback) => {
      if (
        this.searchForm.createTime.length > 0 ||
        this.searchForm.modifyTime.length > 0 ||
        this.searchForm.oriBizOrderNo ||
        this.searchForm.billNo ||
        this.searchForm.bizOrderNo ||
        this.searchForm.miTradeNo) {
        callback();
      } else {
        callback(new Error('对账时间和交易时间不能同时为空!'));
      }
    };
    this.rules = {
      createTime: [
        { required: true, validator: timeValidator }
      ],
      modifyTime: [
        { required: true, validator: timeValidator }
      ],
    };
    return {
      totalFetchData: {
        gpayPaySum: 0,
        gpayPayAmount: 0,
        gpayRefundSum: 0,
        gpayRefundAmount: 0,
        channelPaySum: 0,
        channelPayAmount: 0,
        channelRefundSum: 0,
        channelRefundAmount: 0,
      },
      tableDataList: [],
      accountResult: null,
      createTime: [],
      modifyTime: [],
      searchForm: { // 搜索formv
        hospitalName: null,
        miCenterName: null,
        transactionType: null,
        accountResultList: null,
        bizOrderNo: null,
        billNo: null,
        miTradeNo: null,
        accountTimeStart: null,
        accountTimeEnd: null,
        orderTimeStart: null,
        orderTimeEnd: null,
        oriBizOrderNo: null
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
    loading() {
      return this.$store.state.effectLoading[this.queryUrl];
    }
  },
  mounted() {
    this.getChannelList();
    this.handleSearch();
  },
  methods: {
    getChannelList() {
      this.$fetch('/bill/search_channel.json', {
        method: 'post',
      }).then(res => {
        if (res.code === 0) {
          this.channelList = res.data;
        }
      });
      this.$fetch('bill/search_channel_account', {
        method: 'post',
      }).then(res => {
        if (res.code === 0) {
          this.accountList = res.data;
        }
      });
    },
    accountQuerySearch(queryString, cb) { // 查询是否存在该渠道
      var restaurants = this.accountList;
      const results = queryString ? restaurants.filter(this.accountCreateFilter(queryString)) : restaurants;
      // 调用 callback 返回建议列表的数据
      cb(results);
    },
    accountCreateFilter(queryString) {
      return (restaurant) => {
        return (restaurant.channelAccountName.toLowerCase().indexOf(queryString.toLowerCase()) > -1);
      };
    },
    handleAccountSelect(item) { // 选择已有的医保中心
      this.searchForm.miCenterName = item.channelAccountName;
    },
    partnerQuerySearch(queryString, cb) { // 查询是否存在该机构
      var restaurants = this.channelList;
      var results = queryString ? restaurants.filter(this.partnerCreateFilter(queryString)) : restaurants;
      // 调用 callback 返回建议列表的数据
      cb(results);
    },
    partnerCreateFilter(queryString) {
      return (restaurant) => {
        return (restaurant.channelPartnerName.toLowerCase().indexOf(queryString.toLowerCase()) > -1);
      };
    },
    handlePartnerSelect(item) { // 选择已有的机构
      this.searchForm.hospitalName = item.channelPartnerName;
    },
    changeResult(res) { // 选择对账结果
      if (res === '9') {
        this.accountResultList = [1, 2];
      } else {
        this.accountResultList = [0];
      }
    },
    getColumns() {
      const columns = [
        { prop: 'orderTime',
          label: '交易时间',
          render: (h, value, row) => {
            return this.$common.timeFormat(value, 'YYYY-MM-DD HH:mm:ss');
          },
        },
        { prop: 'patientName', label: '就诊人'},
        { prop: 'idNo', label: '身份证'},
        { prop: 'hospitalName', label: '机构名称' },
        { prop: 'miCenterName', label: '医保中心' },
        { prop: 'transactionType',
          label: '交易类型',
          render: (h, value, row) => {
            return TRANSACTION_TYPE_LIST[value];
          },
        },
        { prop: 'totalExpense',
          label: '总费用支出(元)',
          render: (h, value, row) => {
            return <span class="tableRight">{this.$common.moneyFormat(value)}</span>;
          }
        },
        { prop: 'cashExpense',
          label: '个人现金支付(元)',
          render: (h, value, row) => {
            const selfOne = row.cashExpense + row.fundExpense;
            const selfTwo = row.miCenterCashExpense + row.miCenterFundExpense;
            const myMoney = selfOne >= selfTwo ? row.cashExpense : row.miCenterCashExpense;
            return <span class="tableRight">{this.$common.moneyFormat(myMoney)}</span>;
          }
        },
        { prop: 'fundExpense',
          label: '医保支出(元)',
          render: (h, value, row) => {
            const selfOne = row.cashExpense + row.fundExpense;
            const selfTwo = row.miCenterCashExpense + row.miCenterFundExpense;
            const myMoney = selfOne >= selfTwo ? row.fundExpense : row.miCenterFundExpense;
            return <span class="tableRight">{this.$common.moneyFormat(myMoney)}</span>;
          }
        },
        { prop: 'accountTime',
          label: '对账日期',
          render: (h, value, row) => {
            return this.$common.timeFormat(value, 'YYYY-MM-DD');
          },
        },
        { prop: 'accountResult',
          label: '对账结果',
          width: '100',
          render: (h, value, row) => {
            if (value === 0) {
              return '对平';
            } else if (value === 1 || value === 2) {
              return '未对平';
            } else {
              return '';
            }
          },
        },
        { prop: 'resultInstructions', label: '说明' },
        { prop: 'oriBizOrderNo', label: '原始业务订单号' },
        { prop: 'miTradeNo', label: '医保结算流水号' },
        { prop: 'bizOrderNo', label: '支付业务订单号' },
        { prop: 'billNo', label: '业务交易流水号' },
        { prop: 'opUserName', label: '操作人' },
        { prop: 'opTime',
          label: '操作时间',
          render: (h, value, row) => {
            return this.$common.timeFormat(value, 'YYYY-MM-DD');
          },
        },
        { prop: 'status',
          label: '操作',
          width: '100',
          render: (h, value, row) => {
            return (
              <el-button onClick={() => this.handleInfo(row, 'balanceBills')} type="text">查看</el-button>
            );
          }
        }
      ];
      return columns;
    },
    creatDatePickerChange(datePicker) {
      this.searchForm.createTime = datePicker;
      this.searchForm.accountTimeStart = datePicker ? (new Date(datePicker[0])).getTime() : '';
      this.searchForm.accountTimeEnd = datePicker ? (new Date(datePicker[1])).getTime() : '';
    },
    modifyDatePickerChange(datePicker) {
      this.searchForm.modifyTime = datePicker; // 与 createTime 保持一致
      this.searchForm.orderTimeStart = datePicker ? (new Date(datePicker[0])).getTime() : '';
      this.searchForm.orderTimeEnd = datePicker ? (new Date(datePicker[1])).getTime() : '';
    },
    handleSearch(clickFlag) {
      this.$refs.insuranceStatement.validate((valid) => {
        if (valid) {
          if (!this.searchForm.accountResult) {
            this.accountResultList = null;
          }
          let resetPagination = {};
          if (clickFlag === 'clickSearch') {
            resetPagination = {
              pageIndex: 1,
              totalNum: 0,
            };
          }
          this.$fetch(this.queryUrl, {
            method: 'post',
            data: {
              ...this.searchForm,
              accountResultList: this.accountResultList,
              ...this.pagination,
              ...resetPagination,
            }
          }).then(res => {
            if (res.code === 0) {
              if (res.data && res.data.pageDTO) {
                this.totalFetchData = res.data;
                this.tableDataList = res.data.pageDTO.dataList;
                this.pagination.pageIndex = res.data.pageDTO.pageNum;
                this.pagination.pageSize = res.data.pageDTO.pageSize;
                this.pagination.totalNum = res.data.pageDTO.totalNum;
              } else {
                this.totalFetchData = {
                  gpayPaySum: 0,
                  gpayPayAmount: 0,
                  gpayRefundSum: 0,
                  gpayRefundAmount: 0,
                  channelPaySum: 0,
                  channelPayAmount: 0,
                  channelRefundSum: 0,
                  channelRefundAmount: 0,
                };
                this.tableDataList = [];
                this.pagination.totalNum = 0;
              }
            }
          });
        }
      });
    },
    currentChange(val) {
      this.pagination = {...this.pagination, ...val};
      this.handleSearch();
    },
    handleInfo(row, dialogId) {
      this.row = row;
      this.$eventBus.$emit('dialog-visible', {
        visible: true,
        dialogId
      });
    },
    dialogClose() {
      this.handleSearch();
    }
  }
};
</script>
<style lang="less" scoped>
.text-area {
  display: flex;
  margin: 20px 20px 40px 0px;
  font-size: 14px;
  line-height: 65px;
  color: #34384b;
  text-align: center;
  border-top: 1px solid #e9effd;
  border-right: 1px solid #e9effd;
  border-radius: 3px;
  .text-left-area,
  .text-right-area {
    flex: 1;
    display: flex;
    border-bottom: 1px solid #e9effd;
    border-left: 1px solid #e9effd;
    .flex-2 {
      flex: 2;
      p {
        border-bottom: 1px solid #e9effd;
        border-left: 1px solid #e9effd;
      }
    }
    .flex-1 {
      flex: 1;
      font-size: 18px;
      font-weight: 500;
      line-height: 110px;
      writing-mode: horizontal-tb;
      color: #34384b;
      background-color: #e9effd;
    }
  }
}
</style>
