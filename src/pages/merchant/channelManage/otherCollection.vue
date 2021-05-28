<!--
 * @Author: 张淦
 * @Date: 2020-04-28 14:39:15
 * @LastEditors: zhanggan
 * @Description: 商户系统 - 渠道账号管理 - 收款账号管理 - 其他收款账号管理
 * @FilePath: /gpay-ops-static/src/pages/merchant/channelManage/otherCollection.vue
 -->
<template>
  <div class="wx-collection">
    <el-form ref="form" label-width="130px" :inline="true" :model="searchForm">
      <el-form-item prop="accountNo">
        <el-input
          v-model="searchForm.accountNo"
          placeholder="收款账号"
          clearable
        />
      </el-form-item>
      <el-form-item prop="status">
        <el-select
          v-model="searchForm.status"
          placeholder="账号状态"
          filterable
          clearable
        >
          <el-option
            v-for="(value, key) in availableState"
            :key="key"
            :label="value"
            :value="key"
          />
        </el-select>
      </el-form-item>
      <el-form-item prop="companyCode">
        <el-select
          v-model="searchForm.companyCode"
          placeholder="账号主体"
          filterable
          clearable
        >
          <el-option
            v-for="(company, index) in merchantList"
            :key="`company${index}`"
            :label="company.dictText"
            :value="company.dictValue"
          />
        </el-select>
      </el-form-item>
      <el-form-item prop="productType">
        <el-select
          v-model="searchForm.productType"
          placeholder="开通产品"
          filterable
          clearable
        >
          <el-option
            v-for="(product, index) in productTypeArr"
            :key="`product${index}`"
            :label="product.label"
            :value="product.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item prop="creatTime">
        <we-date-picker
          v-model="creatTime"
          :picker-props="creatPickerData"
          :default-range="0"
          :max-range="31"
          @currentChange="creatDatePickerChange"
        />
      </el-form-item>
      <el-form-item prop="modifyTime">
        <we-date-picker
          v-model="modifyTime"
          :picker-props="modifyPickerData"
          :default-range="0"
          :max-range="31"
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
        <v-form-reset :form-ref="$refs['form']" />
      </el-form-item>
    </el-form>
    <v-add-btn @click="handleInfo({}, 'otherAccount')">
      添加其他收款账号
    </v-add-btn>
    <v-table
      v-loading="loading"
      :data="tableData"
      type="index"
      :columns="columns"
      :pagination="pagination"
      @currentChange="currentChange"
    />
    <otherAccountDialog :row-data="row" />
  </div>
</template>

<script type="text/jsx">
import { mapGetters } from 'vuex';
import tableFormMixin from '@/mixins/tableFormMixin';
import prohibitMixin from '@/mixins/prohibitMixin';
import { AVAILABLE_STATE, DICT_STATUS, AVAILABLE_STATE_ARR, OTHER_PRODUCT_TYPE_ARR } from '@/utils/constants.js';
import otherAccountDialog from './component/otherAccountDialog';

export default {
  components: {
    otherAccountDialog,
  },
  mixins: [tableFormMixin, prohibitMixin],
  data() {
    this.columns = this.getColumns();
    this.queryUrl = '/pay/other/query.json';
    this.creatPickerData = {
      startPlaceholder: '添加开始时间',
      endPlaceholder: '添加结束时间',
    };
    this.modifyPickerData = {
      startPlaceholder: '更新开始时间',
      endPlaceholder: '更新结束时间',
    };
    this.prohibitArr = [
      {
        url: '/pay/account/disable.json',
        message: '禁用'
      },
      {
        url: '/pay/account/enable.json',
        message: '启用'
      },
    ];
    this.availableState = AVAILABLE_STATE;
    this.productTypeArr = OTHER_PRODUCT_TYPE_ARR;
    return {
      creatTime: null,
      modifyTime: null,
      // 搜索form
      searchForm: {
        accountNo: null,
        status: null,
        companyCode: null,
        productType: null,
        createTimeStart: null,
        createTimeEnd: null,
        payTimeStart: null,
        payTimeEnd: null,
      },
    };
  },
  computed: {
    ...mapGetters({
      merchantList: 'merchantList',
    }),
  },
  mounted() {
    this.$common.judgeState({
      merchantList: 'getMerchantList',
    });
  },
  methods: {
    getColumns() {
      const columns = [
        { prop: 'payWayName', label: '支付渠道' },
        { prop: 'accountNo', label: '收款账号' },
        { prop: 'companyName', label: '账号主体' },
        { prop: 'list',
          label: '开通产品',
          render: (h, value, row) => {
            const productList = [];
            if (Array.isArray(row.list)) {
              row.list.forEach(element => {
                if (element.isDeleted === 0) {
                  productList.push(element.productName);
                }
              });
              return productList.toString();
            } else {
              return productList;
            }
          }
        },
        { prop: 'admin', label: '管理人'},
        { prop: 'phoneNo', label: '联系方式' },
        { prop: 'bankCard', label: '绑定银行卡'},
        { prop: 'bank', label: '开户行'},
        { prop: 'status',
          label: '状态',
          width: '100',
          render: (h, value, row) => {
            return (<span class="status-flex">
              <span class={AVAILABLE_STATE_ARR[value].className}></span>
              <span>{AVAILABLE_STATE_ARR[value].text}</span>
            </span>);
          }
        },
        { prop: 'createDate',
          label: '添加时间',
          render: (h, value, row) => {
            return this.$common.timeFormat(value, 'YYYY-MM-DD HH:mm:ss');
          }
        },
        { prop: 'modifyDate',
          label: '更新时间',
          render: (h, value, row) => {
            return this.$common.timeFormat(value, 'YYYY-MM-DD HH:mm:ss');
          }
        },
        { prop: 'status',
          label: '操作',
          width: '100',
          render: (h, value, row) => {
            return (
              <div>
                <el-button onClick={() => this.handleSupplement(row.id, row, '收款账号')} type="text">{DICT_STATUS[value]}</el-button>
                <el-button onClick={() => this.handleInfo(row, 'otherAccount')} type="text">详情</el-button>
              </div>
            );
          }
        },
      ];
      return columns;
    },
    handleSupplement(id, row, pageTitle) {
      if (row.status === 1) {
        this.handleProhibit(id, row.status, pageTitle);
      } else {
        this.$fetch('/pay/payment/institution.json', {
          method: 'post',
          data: {
            accountNo: row.accountNo,
          }
        }).then(res => {
          if (res.code === 0) {
            let dataHtml = '';
            if (Array.isArray(res.data) && res.data.length) {
              res.data.forEach(item => {
                dataHtml += `<div style='text-indent:2em;'>${item.institutionName}</div>`;
              });
              const supplementValue = `<div><div>注意，使用该收款账号的机构有：</div>${dataHtml}<div style='text-align:right'>确定要${this.prohibitArr[row.status].message}该${pageTitle}吗?</div></div>`;
              this.handleProhibit(id, row.status, pageTitle, supplementValue);
            } else {
              this.handleProhibit(id, row.status, pageTitle);
            }
          }
        });
      }
    },
    creatDatePickerChange(datePicker) {
      this.$refs.form.clearValidate();
      this.searchForm.startDate = datePicker ? datePicker[0] : '';
      this.searchForm.endDate = datePicker ? datePicker[1] : '';
    },
    modifyDatePickerChange(datePicker) {
      this.$refs.form.clearValidate();
      this.searchForm.modifyStartDate = datePicker ? datePicker[0] : '';
      this.searchForm.modifyEndDate = datePicker ? datePicker[1] : '';
    },
  }
};
</script>
