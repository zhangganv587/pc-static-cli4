<template>
  <div class="accountDividing">
    <div class="serchBox">
      <el-form
        ref="form"
        label-width="120px"
        :model="searchForm"
        :inline="true"
      >
        <el-form-item>
          <el-input
            v-model="searchForm.merchantNo"
            placeholder="平台商户号"
            clearable
          />
        </el-form-item>
        <el-form-item>
          <el-input
            v-model="searchForm.merchantName"
            placeholder="商户名称"
            clearable
          />
        </el-form-item>
        <el-form-item>
          <el-input
            v-model="searchForm.channelAccountNo"
            placeholder="渠道账号"
            clearable
          />
        </el-form-item>
        <el-form-item>
          <el-input
            v-model="searchForm.contactsName"
            placeholder="姓名"
            clearable
          />
        </el-form-item>
        <el-form-item>
          <el-input
            v-model="searchForm.mobileNo"
            placeholder="手机号："
            clearable
          />
        </el-form-item>
        <el-form-item>
          <el-select
            v-model="searchForm.parentMerchantNo"
            placeholder="主账户"
            clearable
          >
            <el-option
              v-for="item in accountList"
              :key="item.id"
              :label="item.merchantName"
              :value="item.merchantNo"
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
          <el-button
            type="primary opcity"
            @click="handleInfo({}, 'openAccount')"
          >
            开户
          </el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="">
      <v-table
        v-loading="loading"
        type="index"
        :data="tableData"
        :columns="columns"
        :pagination="pagination"
        @currentChange="currentChange"
      />
    </div>
    <open-account :account-list="accountList" :channel-list="channelList" />
  </div>
</template>

<script type="text/jsx">
import { mapGetters } from 'vuex';
import tableFormMixin from '@/mixins/tableFormMixin';
import prohibitMixin from '@/mixins/prohibitMixin';
import OpenAccount from './openAccount';

export default {
  components: {
    OpenAccount
  },
  mixins: [tableFormMixin, prohibitMixin],
  data() {
    this.columns = this.getColumns();
    this.queryUrl = '/settlement/query.json';

    return {
      // 搜索form
      searchForm: {
        contactsName: '',
        channelAccountNo: '',
        merchantName: '',
        merchantNo: '',
        mobileNo: '',
        parentMerchantNo: ''
      },
    };
  },
  computed: {
    ...mapGetters({
      accountList: 'accountList',
      channelList: 'channelList'
    }),
  },
  created() {
    this.$common.judgeState({
      accountList: 'getAccountList',
      channelList: 'getChannelList'
    });
  },
  methods: {
    getColumns() {
      return [
        { prop: 'merchantNo', label: '平台商户号' },
        { prop: 'merchantName', label: '商户名称' },
        { prop: 'contactsName', label: '联系人姓名' },
        { prop: 'mobileNo', label: '手机号' },
        { prop: 'settlementChannel',
          label: '开户渠道',
          render: (h, value, row) => {
            let html = '';
            this.channelList.some(item => {
              if (item.bankCode === value) {
                html = item.name;
                return true;
              }
              return false;
            });
            return html;
          },
        },
        { prop: 'channelAccountNo', label: '渠道账号', width: '200' },
        { prop: 'merchantType', label: '账户类型' },
        { prop: 'parentMerchantName', label: '主账户'},
        { prop: 'gmtCreated', label: '创建时间' },
        { prop: 'operator', label: '操作人' },
        { prop: 'remark', label: '备注' },
      ];
    },
  }
};
</script>
