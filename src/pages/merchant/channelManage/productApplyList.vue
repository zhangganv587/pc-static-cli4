<template>
  <div class="productApply">
    <div class="serchBox">
      <el-form
        ref="productApplyForm"
        label-width="92px"
        :inline="true"
        :model="searchForm"
      >
        <el-row>
          <el-form-item prop="accountNo">
            <el-input
              v-model="searchForm.accountNo"
              placeholder="收款账号"
              clearable
              maxlength="20"
            />
          </el-form-item>
          <el-form-item prop="creatorName">
            <el-input
              v-model="searchForm.creatorName"
              placeholder="申请人姓名"
              clearable
              maxlength="20"
            />
          </el-form-item>
          <el-form-item prop="creator">
            <el-input
              v-model="searchForm.creator"
              placeholder="申请人OA"
              clearable
              maxlength="20"
            />
          </el-form-item>
          <el-form-item prop="payWayCode">
            <el-select
              v-model="searchForm.payWayCode"
              placeholder="支付渠道"
              filterable
              clearable
            >
              <el-option
                v-for="(channel, index) in merchantChannelList"
                :key="`channel${index}`"
                :label="channel.payWayName"
                :value="channel.payWayCode"
              />
            </el-select>
          </el-form-item>
          <el-form-item prop="status">
            <el-select
              v-model="searchForm.status"
              placeholder="处理状态"
              filterable
              clearable
            >
              <el-option
                v-for="(value, key) in PRODUCT_APPLY_STATUS_ARR"
                :key="key"
                :label="value"
                :value="key"
              />
            </el-select>
          </el-form-item>
          <el-form-item prop="rangeData">
            <we-date-picker
              v-model="searchForm.rangeDataCreate"
              :picker-props="pickerProps1"
              :default-range="0"
              @currentChange="applyDatePickerChange1"
            />
          </el-form-item>
          <el-form-item prop="rangeData">
            <we-date-picker
              v-model="searchForm.rangeDataModify"
              :picker-props="pickerProps2"
              :default-range="0"
              @currentChange="applyDatePickerChange2"
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
            <v-form-reset :form-ref="$refs['productApplyForm']" />
          </el-form-item>
        </el-row>
      </el-form>
    </div>
    <v-table
      v-loading="loading"
      :data="tableData"
      :columns="columns"
      :pagination="pagination"
      @currentChange="currentChange"
    />
    <dictionary-info :row-data="row" />
  </div>
</template>

<script type="text/jsx">
import { mapGetters } from 'vuex';
import dictionaryInfo from './component/dictinfo';
import tableFormMixin from '@/mixins/tableFormMixin';
import prohibitMixin from '@/mixins/prohibitMixin';
import { PRODUCT_APPLY_STATUS, PRODUCT_APPLY_STATUS_ARR } from '@/utils/constants';

export default {
  components: {
    dictionaryInfo
  },
  mixins: [tableFormMixin, prohibitMixin],
  data() {
    this.columns = this.getColumns();
    this.queryUrl = '/pay/product/query.json';
    this.prohibitArr = [
      {
        url: '/pay/product/dealWith.json',
        message: '处理'
      },
      {
        url: '/pay/product/invalid.json',
        message: '作废'
      },
    ];
    this.pickerProps1 = {
      startPlaceholder: '申请开始时间',
      endPlaceholder: '申请结束时间',
    };
    this.pickerProps2 = {
      startPlaceholder: '更新开始时间',
      endPlaceholder: '更新结束时间',
    };
    this.PRODUCT_APPLY_STATUS = PRODUCT_APPLY_STATUS;
    this.PRODUCT_APPLY_STATUS_ARR = PRODUCT_APPLY_STATUS_ARR;
    return {

      // 搜索form
      searchForm: {
        accountNo: null,
        creator: null,
        creatorName: null,
        payWayCode: null,
        status: null,
        createStartDate: null,
        createEndDate: null,
        modifyStartDate: null,
        modifyEndDate: null,
        rangeDataModify: null,
        rangeDataCreate: null
      },
    };
  },
  computed: {
    ...mapGetters({
      dictionaryList: 'dictionaryList',
      merchantChannelList: 'merchantChannelList'
    })},
  created() {
    this.$common.judgeState({
      dictionaryList: 'getDictionaryList',
      merchantChannelList: 'getMerchantChannelList',
    });
  },
  mounted() {
    // this.handleSearch();
  },
  methods: {
    getColumns() {
      return [
        { prop: 'payWayName', label: '支付渠道' },
        { prop: 'accountNo', label: '收款账号' },
        { prop: 'productName', label: '申请类型'},
        { prop: 'remark', label: '申请人' },
        { prop: 'status',
          label: '处理状态',
          render: (h, value, row) => {
            return (
              <span class="status-flex">
                <span class={PRODUCT_APPLY_STATUS[value].className}></span>
                <span>{PRODUCT_APPLY_STATUS[value].text}</span>
              </span>
            );
          }
        },
        { prop: 'createDate',
          label: '申请时间',
          render: (h, value, row) => {
            return this.$common.timeFormat(value);
          }
        }, { prop: 'modifyDate',
             label: '更新时间',
             render: (h, value, row) => {
               return this.$common.timeFormat(value);
             }
        },

        { prop: 'status',
          label: '操作',
          width: '100',
          fixed: 'right',
          render: (h, value, row) => {
            if (+value === 0) {
              return (
              <div>
                <el-button onClick={() => this.handleProhibit(row.id, 0, '产品开通申请')} type="text">处理</el-button>
                 <el-button onClick={() => this.handleProhibit(row.id, 1, '产品开通申请')} type="text">作废</el-button>
              </div>
              );
            }
          }
        }
      ];
    },

    applyDatePickerChange1(datePicker) {
      this.searchForm.modifyStartDate = datePicker ? datePicker[0] : '';
      this.searchForm.modifyEndDate = datePicker ? datePicker[1] : '';
    },
    applyDatePickerChange2(datePicker) {
      this.searchForm.createStartDate = datePicker ? datePicker[0] : '';
      this.searchForm.createEndDate = datePicker ? datePicker[1] : '';
    },
  }
};
</script>
