<!--
 * @Author: 张淦
 * @Date: 2020-03-31 14:56:14
 * @LastEditors: 张淦
 * @Description: 医保后台-操作人管理
 * @FilePath: /gpay-ops-static/src/pages/insurance/operator.vue
 -->
<template>
  <div class="operator-manage">
    <el-form
      ref="operatorManageForm"
      label-width="130px"
      :inline="true"
      :model="searchForm"
    >
      <el-form-item prop="operator">
        <el-input
          v-model="searchForm.operator"
          placeholder="操作人名称"
          clearable
        />
      </el-form-item>
      <el-form-item prop="accountNum">
        <el-input
          v-model="searchForm.accountNum"
          placeholder="账号"
          clearable
        />
      </el-form-item>
      <el-form-item prop="hospitalNo">
        <el-input
          v-model="searchForm.hospitalNo"
          placeholder="两定单位编号"
          clearable
        />
      </el-form-item>
      <el-form-item prop="status">
        <el-select
          v-model="searchForm.status"
          placeholder="操作人状态"
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
      <el-form-item prop="hospitalNum">
        <el-select
          v-model="searchForm.hospitalNum"
          placeholder="医疗机构"
          filterable
          clearable
        >
          <el-option
            v-for="(hospital, index) in hospitalDetail"
            :key="index"
            :label="hospital.value"
            :value="hospital.code"
          />
        </el-select>
      </el-form-item>
      <el-form-item prop="rangeData">
        <we-date-picker
          v-model="rangeData"
          :picker-props="pickerProps"
          :max-range="31"
          @currentChange="datePickerChange"
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
        <v-form-reset :form-ref="$refs['operatorManageForm']" />
      </el-form-item>
    </el-form>
    <v-add-btn @click="handleInfo({}, 'operatorManage')">
      添加操作人
    </v-add-btn>
    <v-table
      v-loading="loading"
      :data="tableData"
      :columns="columns"
      :pagination="pagination"
      @currentChange="currentChange"
    />
    <operator-dialog :row-data="row" />
  </div>
</template>

<script type="text/jsx">
import { mapGetters } from 'vuex';
import tableFormMixin from '@/mixins/tableFormMixin';
import prohibitMixin from '@/mixins/prohibitMixin';
import operatorDialog from './operatorDialog';
import { AVAILABLE_STATE, DICT_STATUS, AVAILABLE_STATE_ARR } from '@/utils/constants';

export default {
  components: {
    'operator-dialog': operatorDialog,
  },
  mixins: [tableFormMixin, prohibitMixin],
  data() {
    this.columns = this.getColumns();
    this.availableState = AVAILABLE_STATE;
    this.queryUrl = '/mi/operator/query.json';
    this.prohibitArr = [
      {
        url: '/mi/operator/disable.json',
        message: '禁用'
      },
      {
        url: '/mi/operator/enable.json',
        message: '启用'
      },
    ];
    this.pickerProps = {
      startPlaceholder: '更新开始时间',
      endPlaceholder: '更新结束时间',
    };
    return {
      searchForm: { // 搜索form
        operator: '',
        accountNum: '',
        hospitalNo: '',
        status: '',
        hospitalNum: '',
        modifyBeginDate: '',
        modifyEndDate: '',
      },
      rangeData: [],
    };
  },
  computed: {
    ...mapGetters({
      hospitalDetail: 'hospitalDetail',
    }),
    loading() {
      return this.$store.state.effectLoading[this.queryUrl];
    }
  },
  created() {
    this.$common.judgeState({
      hospitalDetail: 'getHospitalDetail',
    });
  },
  methods: {
    getColumns() {
      const columns = [
        { prop: 'operator', label: '操作人'},
        { prop: 'accountNum', label: '账号' },
        { prop: 'hospitalName', label: '医疗机构' },
        { prop: 'miCenterName', label: '医保中心' },
        { prop: 'hospitalNo', label: '两定单位编号' },
        { prop: 'gmtCreated',
          label: '添加时间',
          render: (h, value, row) => {
            return this.$common.timeFormat(value, 'YYYY-MM-DD HH:mm:ss');
          },
        },
        { prop: 'gmtModified',
          label: '更新时间',
          render: (h, value, row) => {
            return this.$common.timeFormat(value, 'YYYY-MM-DD HH:mm:ss');
          },
        },
        { prop: 'status',
          label: '状态',
          width: '100',
          render: (h, value, row) => {
            return (
              <span class="status-flex">
                <span class={AVAILABLE_STATE_ARR[value].className}></span>
                <span>{AVAILABLE_STATE_ARR[value].text}</span>
              </span>
            );
          },
        },
        { prop: 'status',
          label: '操作',
          width: '100',
          render: (h, value, row) => {
            return (
              <div>
                <el-button onClick={() => this.handleProhibit(row.id, value, '操作人')} type="text">{DICT_STATUS[value]}</el-button>
                <el-button onClick={() => this.handleInfo(row, 'operatorManage')} type="text">查看</el-button>
              </div>
            );
          }
        }
      ];
      return columns;
    },
    datePickerChange(datePicker) {
      this.$refs.operatorManageForm.clearValidate();
      this.searchForm.modifyBeginDate = datePicker ? (new Date(datePicker[0])).getTime() : '';
      this.searchForm.modifyEndDate = datePicker ? (new Date(datePicker[1])).getTime() : '';
    },
  }
};
</script>
