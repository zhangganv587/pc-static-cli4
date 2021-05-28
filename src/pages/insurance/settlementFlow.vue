<!--
 * @Author: 张淦
 * @Date: 2020-03-30 17:50:31
 * @LastEditors: zhanggan
 * @Description: 医保后台-结算流水
 * @FilePath: /gpay-ops-static/src/pages/insurance/settlementFlow.vue
 -->
<template>
  <div class="settlement-flow">
    <el-form
      ref="settlementFlowForm"
      label-width="130px"
      :inline="true"
      :model="searchForm"
    >
      <el-form-item prop="billNo">
        <el-input
          v-model="searchForm.billNo"
          placeholder="本地结算流水号"
          clearable
        />
      </el-form-item>
      <el-form-item prop="settleSerialNo">
        <el-input
          v-model="searchForm.settleSerialNo"
          placeholder="医保结算流水号"
          clearable
        />
      </el-form-item>
      <el-form-item prop="bizOrderNo">
        <el-input
          v-model="searchForm.bizOrderNo"
          placeholder="支付业务订单号"
          clearable
        />
      </el-form-item>
      <el-form-item prop="originBizOrderNo">
        <el-input
          v-model="searchForm.originBizOrderNo"
          placeholder="原始业务订单号"
          clearable
        />
      </el-form-item>
      <el-form-item prop="userName">
        <el-input
          v-model="searchForm.userName"
          placeholder="就诊人"
          clearable
        />
      </el-form-item>
      <el-form-item prop="rangeData">
        <we-date-picker
          v-model="rangeData"
          :picker-props="pickerProps"
          :max-range="31"
          @currentChange="datePickerChange"
        />
      </el-form-item>
      <el-form-item prop="sureStatus">
        <el-select
          v-model="searchForm.sureStatus"
          placeholder="结算状态"
          filterable
          clearable
        >
          <el-option
            v-for="(sure, index) in sureStatus"
            :key="index"
            :label="sure.value"
            :value="sure.code"
          />
        </el-select>
      </el-form-item>
      <el-form-item prop="hopsId">
        <el-select
          v-model="searchForm.hopsId"
          placeholder="医疗机构"
          filterable
          clearable
        >
          <el-option
            v-for="(hospital, index) in hospitalDetail"
            :key="index"
            :label="hospital.value"
            :value="hospital.desc"
          />
        </el-select>
      </el-form-item>
      <el-form-item prop="tradeType">
        <el-select
          v-model="searchForm.tradeType"
          placeholder="交易类型"
          filterable
          clearable
        >
          <el-option label="结算" value="1" />
          <el-option label="退款" value="-1" />
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
        <v-form-reset :form-ref="$refs['settlementFlowForm']" />
      </el-form-item>
    </el-form>
    <v-table
      v-loading="loading"
      :data="tableData"
      :columns="columns"
      :pagination="pagination"
      @currentChange="currentChange"
    />
    <settlement-flow-dialog :row-data="row" />
  </div>
</template>

<script type="text/jsx">
import tableFormMixin from '@/mixins/tableFormMixin';
import settlementFlowDialog from './settlementFlowDialog';
import { mapGetters } from 'vuex';

export default {
  components: {
    'settlement-flow-dialog': settlementFlowDialog,
  },
  mixins: [tableFormMixin],
  data() {
    this.columns = this.getColumns();
    this.queryUrl = '/mi/settle/query.json';
    this.pickerProps = {
      startPlaceholder: '医保结算开始时间',
      endPlaceholder: '医保结算结束时间',
    };
    return {
      searchForm: { // 搜索form
        billNo: null,
        settleSerialNo: null,
        bizOrderNo: null,
        modifyBeginDate: null,
        modifyEndDate: null,
        bizCycleNo: null,
        sureStatus: null,
        hopsId: null,
      },
      rangeData: [],
    };
  },
  computed: {
    ...mapGetters({
      hospitalDetail: 'hospitalDetail',
      sureStatus: 'sureStatus',
    }),
    loading() {
      return this.$store.state.effectLoading[this.queryUrl];
    }
  },
  created() {
    this.$common.judgeState({
      hospitalDetail: 'getHospitalDetail',
      sureStatus: 'getSureStatus',
    });
  },
  methods: {
    getColumns() {
      const columns = [
        { prop: 'billNo', label: '本地结算流水号'},
        { prop: 'settleSerialNo', label: '医保结算流水号' },
        { prop: 'originBizOrderNo', label: '原始业务订单号' },
        { prop: 'bizOrderNo', label: '支付业务订单号' },
        { prop: 'totalExpense',
          label: '医疗费用总额(元)',
          width: '100',
          render: (h, value, row) => {
            return <span class="tableRight">{this.$common.moneyFormat(value)}</span>;
          },
        },
        { prop: 'fundTotalExpense',
          label: '医保抵扣总额(元)',
          width: '100',
          render: (h, value, row) => {
            return <span class="tableRight">{this.$common.moneyFormat(value)}</span>;
          },
        },
        { prop: 'cashTotalExpense',
          label: '现金支付总额(元)',
          width: '100',
          render: (h, value, row) => {
            return <span class="tableRight">{this.$common.moneyFormat(value)}</span>;
          },
        },
        { prop: 'sureStatus',
          label: '结算状态',
          width: '100',
          render: (h, value, row) => {
            let status = '无';
            this.sureStatus.forEach(element => {
              if (parseInt(element.code) === value) {
                status = element.value;
              }
            });
            return status;
          },
        },
        { prop: 'tradeType',
          label: '交易类型',
          width: '100',
          render: (h, value, row) => {
            if (value === 1) {
              return '结算';
            } else if (value === -1) {
              return '退款';
            } else {
              return '';
            }
          },
        },
        { prop: 'settleDate',
          label: '医保结算时间',
          render: (h, value, row) => {
            if (row.tradeType === 1) {
              return this.$common.timeFormat(value, 'YYYY-MM-DD HH:mm:ss');
            } else {
              return '';
            }
          },
        },
        { prop: 'settleDate',
          label: '医保退款时间',
          render: (h, value, row) => {
            if (row.tradeType === -1) {
              return this.$common.timeFormat(value, 'YYYY-MM-DD HH:mm:ss');
            } else {
              return '';
            }
          },
        },
        { prop: 'userName', label: '就诊人' },
        { prop: 'hopsName', label: '医疗机构'},
        { prop: 'gmtCreated',
          label: '创建时间',
          render: (h, value, row) => {
            return this.$common.timeFormat(value, 'YYYY-MM-DD HH:mm:ss');
          },
        },
        { prop: 'status',
          label: '操作',
          width: '100',
          render: (h, value, row) => {
            return (
              <el-button onClick={() => this.handleInfo(row, 'settlementFlow')} type="text">结算详情</el-button>
            );
          }
        }
      ];
      return columns;
    },
    datePickerChange(datePicker) {
      this.$refs.settlementFlowForm.clearValidate();
      this.searchForm.modifyBeginDate = datePicker ? (new Date(datePicker[0])).getTime() : '';
      this.searchForm.modifyEndDate = datePicker ? (new Date(datePicker[1])).getTime() : '';
    },
  }
};
</script>
