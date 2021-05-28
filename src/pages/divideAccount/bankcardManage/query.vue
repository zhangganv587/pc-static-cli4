<template>
  <div class="accountDividing">
    <div class="serchBox">
      <el-form
        ref="form"
        label-width="120px"
        :inline="true"
        :model="searchForm"
      >
        <el-form-item prop="merchantNo">
          <el-input
            v-model="searchForm.merchantNo"
            placeholder="平台商户号"
            clearable
          />
        </el-form-item>
        <el-form-item prop="merchantName">
          <el-input
            v-model="searchForm.merchantName"
            placeholder="商户名称"
            clearable
          />
        </el-form-item>
        <el-form-item prop="channelAccountNo">
          <el-input
            v-model="searchForm.channelAccountNo"
            placeholder="渠道账号"
            clearable
          />
        </el-form-item>
        <el-form-item prop="settlementChannel">
          <el-select
            v-model="searchForm.settlementChannel"
            placeholder="分账渠道"
            clearable
          >
            <el-option
              v-for="channel in channelList"
              :key="channel.id"
              :label="channel.name"
              :value="channel.bankCode"
            />
          </el-select>
        </el-form-item>
        <el-form-item prop="cardUserName">
          <el-input
            v-model="searchForm.cardUserName"
            placeholder="姓名"
            clearable
          />
        </el-form-item>
        <el-form-item prop="mobileNo">
          <el-input
            v-model="searchForm.mobileNo"
            placeholder="手机号"
            clearable
          />
        </el-form-item>
        <el-form-item prop="bankCardNo">
          <el-input
            v-model="searchForm.bankCardNo"
            placeholder="银行卡号"
            clearable
          />
        </el-form-item>
        <el-form-item prop="bankStatus">
          <el-select
            v-model="searchForm.bankStatus"
            placeholder="状态"
            clearable
          >
            <el-option
              v-for="(key, value) in bankCardState"
              :key="value"
              :label="key"
              :value="value"
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
    </div>
    <v-table
      v-loading="loading"
      type="index"
      :data="tableData"
      :columns="columns"
      :pagination="pagination"
      @currentChange="currentChange"
    />
    <tie-on-card :dialog-info="dialogInfo" :row="row" />
    <untying-card :dialog-info="dialogInfo" />
  </div>
</template>

<script type="text/jsx">
import { mapGetters } from 'vuex';
import { SUB_ACCOUNT_TYPE, CARD_ACCOUNT_TYPE, BANK_CARD_TYPE, BANK_CARD_STATE } from '@/utils/constants';
import TieOnCard from './tieOnCard';
import UntyingCard from './untyingCard';
import tableFormMixin from '@/mixins/tableFormMixin';
import prohibitMixin from '@/mixins/prohibitMixin';

export default {
  components: {
    TieOnCard,
    UntyingCard,
  },
  mixins: [tableFormMixin, prohibitMixin],
  data() {
    this.queryUrl = '/subAccount/query.json';
    this.columns = this.getColumns();
    this.bankCardState = BANK_CARD_STATE;

    return {
      // 搜索form
      searchForm: {
        settlementChannel: '',
        cardUserName: '',
        channelAccountNo: '',
        merchantName: '',
        merchantNo: '',
        mobileNo: '',
        bankCardNo: '',
        bankStatus: '',
      },
      // 分页
      pagination: {
        pageSize: 5,
        pageIndex: 1,
        totalNum: 0,
      },
      // dialog info
      dialogInfo: {
        merchantNo: '',
        settlementChannel: '',
      },
      row: {},
    };
  },
  computed: {
    ...mapGetters({
      channelList: 'channelList',
    }),
  },
  created() {
    this.$common.judgeState({
      channelList: 'getChannelList',
      bankList: 'getBankList',
    });
  },
  methods: {
    getColumns() {
      return [
        { prop: 'merchantNo', label: '平台商户号', width: '120' },
        { prop: 'merchantName', label: '商户名称', width: '120' },
        {
          prop: 'settlementChannel',
          label: '分账渠道',
          width: '100',
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
        {
          prop: 'routinglAccountType',
          label: '分账账户类型',
          width: '100',
          render: (h, value, row) => {
            return SUB_ACCOUNT_TYPE[value];
          },
        },
        {
          prop: 'cardAccountType',
          label: '绑卡账户类型',
          width: '100',
          render: (h, value, row) => {
            return CARD_ACCOUNT_TYPE[value];
          },
        },
        { prop: 'cardUserName', label: '绑卡人姓名', width: '100' },
        { prop: 'mobileNo', label: '手机号', width: '120' },
        { prop: 'certNo', label: '身份证号', width: '140' },
        {
          prop: 'cardType',
          label: '银行卡类型',
          width: '100',
          render: (h, value, row) => {
            return BANK_CARD_TYPE[value];
          },
        },
        { prop: 'bankName', label: '银行名称', width: '100' },
        { prop: 'bankCardNo', label: '银行卡号', width: '160' },
        { prop: 'bankProvince', label: '开户行省', width: '100' },
        { prop: 'bankCity', label: '开户行市', width: '100' },
        { prop: 'bankBranchName', label: '开户支行', width: '100' },
        { prop: 'correspondentNo', label: '联行号', width: '100' },
        {
          prop: 'bankStatus',
          label: '状态',
          width: '100',
          render: (h, value, row) => {
            return BANK_CARD_STATE[value];
          },
        },
        { prop: 'gmtCreated', label: '创建时间', width: '140' },
        { prop: 'operator', label: '操作人', width: '100' },
        { prop: 'gmtModified', label: '修改时间', width: '140' },
        { prop: 'remark', label: '备注', width: '100' },
        {
          prop: 'bankStatus',
          label: '操作',
          width: '100',
          fixed: 'right',
          render: (h, value, row) => {
            if (value === '0') {
              return (
                <el-button onClick={() => this.handleInfo(row, 'untyingCard')} type="text" >
                  解绑
                </el-button>
              );
            } else if (value === '1') {
              return (
                <el-button onClick={() => this.handleInfo(row, 'tieOnCard')} type="text" >
                  绑卡
                </el-button>
              );
            } else if (value === '4') {
              return (
                <el-button onClick={() => this.handleEdit(row, 'tieOnCard')} type="text" >
                  修改
                </el-button>
              );
            } else {
              return (
                <div>
                  <el-button onClick={() => this.handleVerify(row)} type="text" >
                    验证
                  </el-button>
                  <el-button onClick={() => this.handleEdit(row, 'tieOnCard')} type="text" >
                    修改
                  </el-button>
                </div>
              );
            }
          },
        },
      ];
    },
    handleInfo(row, dialogId) {
      this.dialogInfo = {
        merchantNo: row.merchantNo || '',
        settlementChannel: row.settlementChannel || '',
      };

      this.$eventBus.$emit('dialog-visible', {
        visible: true,
        dialogId
      });
    },
    // 企业绑卡验证金额
    handleVerify(row) {
      this.$prompt('请输入验证金额：', '企业绑卡', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputPattern: /^(([1-9][0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2})))$/,
        inputErrorMessage: '验证金额格式不正确',
        closeOnClickModal: false,
      }).then(({ value }) => {
        return this.$fetch('/subAccount/check.json', {
          method: 'post',
          data: {
            ...row,
            checkAmount: parseFloat(value) * 100
          },
        });
      }).then(res => {
        if (res.code === 0) {
          this.$message({
            type: 'success',
            message: '企业绑卡成功!'
          });

          this.$refs.formSubmit.handleSearch();
        }
      }).catch(() => {});
    },
    // 企业修改填写信息
    handleEdit(row, dialogId) {
      this.row = row;

      this.$eventBus.$emit('dialog-visible', {
        visible: true,
        dialogId
      });
    }
  },
};
</script>
