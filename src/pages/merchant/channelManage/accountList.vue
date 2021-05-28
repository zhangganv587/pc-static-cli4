<template>
  <div class="finance-summary">
    <el-form
      ref="accountListform"
      label-width="120px"
      :inline="true"
      :model="searchForm"
    >
      <el-form-item prop="accountNo">
        <el-select
          v-model="searchForm.accountNo"
          filterable
          placeholder="支付账号"
        >
          <el-option
            v-for="item in paymentAccountList"
            :key="item.id"
            :label="item.accountNo"
            :value="item.accountNo"
          />
        </el-select>
      </el-form-item>
      <el-form-item prop="ownerCompany">
        <el-select
          v-model="searchForm.ownerCompany"
          filterable
          placeholder="账户所属公司"
        >
          <el-option
            v-for="company in companyList"
            :key="company.id"
            :label="company.name"
            :value="company.name"
          />
        </el-select>
      </el-form-item>
      <el-form-item prop="businessCode">
        <el-select
          v-model="searchForm.businessCode"
          filterable
          placeholder="业务"
        >
          <el-option
            v-for="business in businessAdministration"
            :key="business.id"
            :label="business.business"
            :value="business.businessCode"
          />
        </el-select>
      </el-form-item>
      <el-form-item prop="merchantNo">
        <el-select
          v-model="searchForm.merchantNo"
          filterable
          placeholder="商户"
        >
          <el-option
            v-for="merchant in merchantList"
            :key="merchant.id"
            :label="merchant.merchant"
            :value="merchant.merchantNo"
          />
        </el-select>
      </el-form-item>
      <el-form-item prop="payWayId">
        <el-select v-model="searchForm.payWayId" filterable placeholder="渠道">
          <el-option
            v-for="channel in merchantChannelList"
            :key="channel.id"
            :label="channel.payWayName"
            :value="channel.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item prop="status">
        <el-select v-model="searchForm.status" placeholder="账户状态">
          <el-option
            v-for="(value, key) in availableState"
            :key="key"
            :label="value"
            :value="key"
          />
        </el-select>
      </el-form-item>
      <el-form-item prop="applyDate">
        <we-date-picker
          v-model="applyDate"
          :picker-props="applyDatePickerProps"
          @currentChange="applyDatePickerChange"
        />
      </el-form-item>
      <el-form-item prop="modifyDate">
        <we-date-picker
          v-model="modifyDate"
          :picker-props="modifyDatePickerProps"
          @currentChange="modifyDatePickerChange"
        />
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
        <v-form-reset :form-ref="$refs['accountListform']" />
        <el-button
          v-download="{
            fetchUrl: '/account/export.json',
            dataRef: this,
            formRef: 'accountListform',
            fileName: '账号列表',
          }"
          type="primary opcity"
        >
          导出
        </el-button>
      </el-form-item>
    </el-form>
    <v-add-btn @click="handleInfo({}, 'accountInfo')"> 新增账号 </v-add-btn>
    <v-table
      v-loading="loading"
      :data="tableData"
      :columns="columns"
      :pagination="pagination"
      @currentChange="currentChange"
    />
    <accountInfo />
  </div>
</template>

<script type="text/jsx">
import { mapGetters } from 'vuex';
import { AVAILABLE_STATE } from '@/utils/constants';
import tableFormMixin from '@/mixins/tableFormMixin';
import prohibitMixin from '@/mixins/prohibitMixin';
import accountInfo from './component/accountInfo';

export default {
  components: {
    accountInfo,
  },
  mixins: [tableFormMixin, prohibitMixin],
  data() {
    this.columns = this.getColumns();
    this.queryUrl = '/account/query.json';
    this.availableState = AVAILABLE_STATE;
    this.prohibitArr = [
      {
        url: '/account/disable.json',
        message: '禁用'
      },
      {
        url: '/account/enable.json',
        message: '启用'
      },
    ];
    this.applyDatePickerProps = {
      startPlaceholder: '新建开始时间',
      endPlaceholder: '新建结束时间',
    };
    this.modifyDatePickerProps = {
      startPlaceholder: '操作开始时间',
      endPlaceholder: '操作结束时间',
    };
    return {
      // 搜索form
      applyDate: [],
      modifyDate: [],
      searchForm: {
        accountNo: null,
        merchantNo: null,
        businessCode: null,
        payWayId: null,
        ownerCompany: null,
        status: null,
        channelId: null,
        applyStartDate: null,
        applyEndDate: null,
        modifyStartDate: null,
        modifyEndDate: null,
      },
    };
  },
  computed: {
    ...mapGetters({
      merchantChannelList: 'merchantChannelList',
      paymentAccountList: 'paymentAccountList',
      companyList: 'companyList',
      businessAdministration: 'businessAdministration',
      merchantList: 'merchantList',
    }),
  },
  created() {
    this.$common.judgeState({
      merchantChannelList: 'getMerchantChannelList',
      paymentAccountList: 'getPaymentAccountList',
      companyList: 'getCompanyList',
      businessAdministration: 'getBusinessAdministration',
      merchantList: 'getMerchantList',
    });
    this.$eventBus.$on('handle-search', () => {
      this.$refs.formSubmit.handleSearch();
    });
  },
  methods: {
    getColumns() {
      return [
        { prop: 'accountNo', label: '支付账号', width: '100' },
        { prop: 'businessCode', label: '新建账号业务', width: '100' },
        { prop: 'merchantNo',
          label: '账号所在商户',
          width: '100',
          // render: (h, value, row) => {
          //   this.merchantList.forEach(element => {
          //     if (element.merchantNo === param.row.merchantNo) {
          //       console.log(param.row.merchantNo);
          //       return element.merchantName;
          //     }
          //   });
          // },
        },
        { prop: 'ownerCompany', label: '账号所属公司', width: '180'},
        { prop: 'payWayName', label: '渠道', width: '100'},
        { prop: 'bankBranch', label: '开户行', width: '150'},
        { prop: 'accountAdminName', label: '管理人', width: '100'},
        { prop: 'accountAdminMail', label: '管理人联系方式', width: '170'},
        { prop: 'status',
          label: '账号状态',
          width: '100',
          render: (h, value, row) => {
            return (
              <span class="status-flex">
                <span class={AVAILABLE_STATE[value].className}></span>
                <span>{AVAILABLE_STATE[value].text}</span>
              </span>
            );
          },
        },
        { prop: 'gmtCreated',
          label: '创建时间',
          width: '100',
          render: (h, value, row) => {
            return this.$common.timeFormat(value, 'YYYY-MM-DD HH:mm:ss');
          },
        },
        { prop: 'gmtModified',
          label: '操作时间',
          width: '100',
          render: (h, value, row) => {
            return this.$common.timeFormat(value, 'YYYY-MM-DD HH:mm:ss');
          },
        },
        { prop: 'modifyOperator', label: '操作人', width: '100'},
        { prop: 'memo', label: '备注', width: '150'},
        { prop: 'status',
          label: '操作',
          width: '100',
          fixed: 'right',
          render: (h, value, row) => {
            const html = ['禁用', '启用'];
            return (
              <div>
                <el-button onClick={() => this.handleInfo(row, 'accountInfo')} type="text">详情</el-button>
                <el-button onClick={() => this.handleProhibit(row.id, value, '账号')} type="text">{html[value]}</el-button>
              </div>
            );
          }
        }
      ];
    },

    // 覆盖 tableFormMixin 里面的 handleInfo 方法
    handleInfo(data, dialogId) {
      if (Object.keys(data).length) {
        this.$store.commit('ACCOUNT_CHANNEL', {
          row: data,
          button: 'edit,save',
          edit: true,
        });
        this.$store.commit('PAYMENT_CHANNEL', {
          payWayId: data.payWayId,
          id: data.id
        });
      } else {
        this.$store.commit('ACCOUNT_CHANNEL', {
          row: {},
          button: 'edit,save',
          edit: false
        });
        this.$store.commit('PAYMENT_CHANNEL', {
          payWayId: null,
          id: null
        });
      }

      this.row = data;
      this.$eventBus.$emit('dialog-visible', {
        visible: true,
        dialogId
      });
    },

    applyDatePickerChange(datePicker) {
      this.searchForm.applyStartDate = datePicker ? datePicker[0] : '';
      this.searchForm.applyEndDate = datePicker ? datePicker[1] : '';
    },
    modifyDatePickerChange(datePicker) {
      this.searchForm.modifyStartDate = datePicker ? datePicker[0] : '';
      this.searchForm.modifyEndDate = datePicker ? datePicker[1] : '';
    }
  }
};
</script>
