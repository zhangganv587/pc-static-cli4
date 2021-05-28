<template>
  <div>
    <el-form ref="form" label-width="120px" :inline="true" :model="formInline">
      <el-form-item>
        <el-input
          v-model="formInline.merchantNo"
          placeholder="平台商户号"
          clearable
        />
      </el-form-item>
      <el-form-item>
        <el-input
          v-model="formInline.merchantName"
          placeholder="商户名称"
          clearable
        />
      </el-form-item>
      <el-form-item>
        <el-input
          v-model="formInline.channelAccountNo"
          placeholder="渠道账号"
          clearable
        />
      </el-form-item>
      <el-form-item>
        <el-select
          v-model="formInline.settlementChannel"
          clearable
          placeholder="分账渠道"
        >
          <el-option
            v-for="item in channelOption"
            :key="item.bankCode"
            :label="item.name"
            :value="item.bankCode"
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
      </el-form-item>
    </el-form>
    <v-table
      v-loading="loading"
      type="index"
      :data="tableData"
      :columns="columns"
      :pagination="pagination"
      @currentChange="currentChange"
    />
    <balance-detail :row-data="row" />
  </div>
</template>

<script type="text/jsx">
import { mapGetters } from 'vuex';
import tableFormMixin from '@/mixins/tableFormMixin';
import balanceDetail from './detail';

export default {
  components: {
    'balance-detail': balanceDetail
  },
  mixins: [tableFormMixin],
  data() {
    this.columns = this.getColumns();
    this.queryUrl = '/merchant/query.json';

    return {
      formInline: {
        settlementChannel: null,
        channelAccountNo: null,
        merchantName: null,
        merchantNo: null,
      },
    };
  },
  computed: {
    ...mapGetters({
      channelOption: 'channelList',
    }),
  },
  created() {
    this.$common.judgeState({
      channelList: 'getChannelList',
    });
  },
  methods: {
    getColumns() {
      return [
        { prop: 'merchantNo', label: '平台商户号' },
        { prop: 'merchantName', label: '商户名称' },
        { prop: 'settlementChannel',
          label: '分账渠道',
          render: (h, value, row) => {
            return this.$common.tableFormat(this.channelOption, value, 'bankCode', 'name');
          }
        },
        { prop: 'channelAccountNo', label: '渠道账号', width: 200 },
        { prop: 'routinglAccountType', label: '分账账户类型'},
        { prop: 'masterAccount', label: '主账户号' },
        { prop: 'accountBlance',
          label: '账户余额',
          render: (h, value, row) => {
            return this.$common.moneyFormat(value);
          }
        },
        {
          prop: '',
          label: '查看',
          fixed: 'right',
          render: (h, value, row) => {
            return (
              <el-button onClick={() => this.handleInfo(row, 'balanceInfo')} type="text" >
                分账明细
              </el-button>
            );
          },
        },
      ];
    },

    currentDatePickerChange(datePicker) {
      this.formInline.timeConditionStart = datePicker[0] || null;
      this.formInline.timeConditionEnd = datePicker[1] || null;
    },
  },
};
</script>
