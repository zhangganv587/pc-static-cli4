<!--
 * @Author: 张淦
 * @Date: 2020-04-29 13:55:54
 * @LastEditors: zhanggan
 * @Description: 商户系统 - 渠道账号管理 - 收款账号管理 - 微信产品管理
 * @FilePath: /gpay-ops-static/src/pages/merchant/channelManage/wechatProduct.vue
 -->
<template>
  <div class="wx-product">
    <el-form ref="form" label-width="130px" :inline="true" :model="searchForm">
      <el-form-item prop="productId">
        <el-input
          v-model="searchForm.productId"
          placeholder="APPID"
          clearable
        />
      </el-form-item>
      <el-form-item prop="name">
        <el-input v-model="searchForm.name" placeholder="名称" clearable />
      </el-form-item>
      <el-form-item prop="status">
        <el-select
          v-model="searchForm.status"
          placeholder="产品状态"
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
      <el-form-item prop="accountNo">
        <el-select
          v-model="searchForm.accountNo"
          placeholder="绑定收款账号"
          filterable
          clearable
        >
          <el-option
            v-for="(collection, key) in collectionAccountList"
            :key="`collection${key}`"
            :label="collection.accountNo"
            :value="collection.accountNo"
          />
        </el-select>
      </el-form-item>
      <el-form-item prop="productType">
        <el-select
          v-model="searchForm.productType"
          placeholder="产品类型"
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
    <v-add-btn @click="handleInfo({}, 'wechatProduct')">
      添加微信产品
    </v-add-btn>
    <v-table
      v-loading="loading"
      :data="tableData"
      :columns="columns"
      type="index"
      :pagination="pagination"
      @currentChange="currentChange"
    />
    <wechatProductDialog :row-data="row" />
  </div>
</template>

<script type="text/jsx">
import tableFormMixin from '@/mixins/tableFormMixin';
import prohibitMixin from '@/mixins/prohibitMixin';
import { AVAILABLE_STATE, DICT_STATUS, AVAILABLE_STATE_ARR, WX_PRODUCT_TYPE_ARR } from '@/utils/constants.js';
import wechatProductDialog from './component/wechatProductDialog';

export default {
  components: {
    wechatProductDialog,
  },
  mixins: [tableFormMixin, prohibitMixin],
  data() {
    this.columns = this.getColumns();
    this.queryUrl = '/pay/config/query.json';
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
        url: '/pay/config/disable.json',
        message: '禁用'
      },
      {
        url: '/pay/config/enable.json',
        message: '启用'
      },
    ];
    this.availableState = AVAILABLE_STATE;
    this.productTypeArr = WX_PRODUCT_TYPE_ARR;
    return {
      creatTime: null,
      modifyTime: null,
      collectionAccountList: [],
      // 搜索form
      searchForm: {
        payWayCode: 'wxpay',
        enterpriseName: null,
        enterpriseTaxCode: null,
        status: null,
        startDate: null,
        endDate: null,
        modifyStartDate: null,
        modifyEndDate: null,
      },
    };
  },
  mounted() {
    this.getCollectionAccountList();
  },
  methods: {
    // 获取收款账号
    getCollectionAccountList() {
      this.$fetch('/pay/account/accountList.json', {
        method: 'post',
        data: {
          payWayCode: 'wxpay',
        },
      }).then(res => {
        if (res.code === 0) {
          this.collectionAccountList = res.data;
        }
      }).catch(() => {});
    },
    getColumns() {
      const columns = [
        { prop: 'productId', label: 'APPID' },
        { prop: 'name', label: '名称' },
        { prop: 'productName', label: '产品类型'},
        { prop: 'accountNo', label: '绑定收款账号' },
        { prop: 'admin', label: '管理人' },
        { prop: 'phoneNo', label: '联系方式'},
        { prop: 'status',
          label: '产品状态',
          width: '100',
          render: (h, value, row) => {
            if (value !== null || value !== '') {
              return (<span class="status-flex">
                <span class={AVAILABLE_STATE_ARR[value].className}></span>
                <span>{AVAILABLE_STATE_ARR[value].text}</span>
              </span>);
            } else {
              return '';
            }
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
                <el-button onClick={() => this.handleSupplement(row.id, row, '微信产品')} type="text">{DICT_STATUS[value]}</el-button>
                <el-button onClick={() => this.handleInfo(row, 'wechatProduct')} type="text">详情</el-button>
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
              const supplementValue = `<div><div>注意，使用该微信产品的机构有：</div>${dataHtml}<div style='text-align:right'>确定要${this.prohibitArr[row.status].message}该${pageTitle}吗?</div></div>`;
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
