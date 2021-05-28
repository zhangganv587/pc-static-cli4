<!--
 * @Author: 张淦
 * @Date: 2020-03-18 10:34:43
 * @LastEditors: zhanggan
 * @Description: 医保后台-医保中心管理
 * @FilePath: /gpay-ops-static/src/pages/insurance/insuranceCenter.vue
 -->
<template>
  <div class="insurance-center">
    <el-form
      ref="insuranceCenterForm"
      label-width="130px"
      :inline="true"
      :model="searchForm"
    >
      <el-form-item prop="miCenterName">
        <el-input
          v-model="searchForm.miCenterName"
          placeholder="医保中心名称"
          clearable
        />
      </el-form-item>
      <el-form-item prop="miCenterNo">
        <el-input
          v-model="searchForm.miCenterNo"
          placeholder="医保中心编号"
          clearable
        />
      </el-form-item>
      <el-form-item prop="status">
        <el-select
          v-model="searchForm.status"
          placeholder="医保机构状态"
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
      <el-form-item prop="createTime">
        <we-date-picker
          v-model="searchForm.createTime"
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
        <v-form-reset :form-ref="$refs['insuranceCenterForm']" />
      </el-form-item>
    </el-form>
    <v-add-btn @click="handleInfo({}, 'insuranceCenter')">
      添加医保中心
    </v-add-btn>
    <v-table
      v-loading="loading"
      :data="tableData"
      :columns="columns"
      :pagination="pagination"
      @currentChange="currentChange"
    />
    <insurance-center-dialog :row-data="row" />
  </div>
</template>

<script type="text/jsx">
import tableFormMixin from '@/mixins/tableFormMixin';
import prohibitMixin from '@/mixins/prohibitMixin';
import insuranceCenterDialog from './insuranceCenterDialog';
import { AVAILABLE_STATE, DICT_STATUS, AVAILABLE_STATE_ARR } from '@/utils/constants';

export default {
  components: {
    'insurance-center-dialog': insuranceCenterDialog,
  },
  mixins: [tableFormMixin, prohibitMixin],
  data() {
    this.columns = this.getColumns();
    this.availableState = AVAILABLE_STATE;
    this.queryUrl = '/mi/center/query.json';
    this.prohibitArr = [
      {
        url: '/mi/center/disable.json',
        message: '禁用'
      },
      {
        url: '/mi/center/enable.json',
        message: '启用'
      },
    ];
    this.pickerProps = {
      startPlaceholder: '更新开始时间',
      endPlaceholder: '更新结束时间',
    };
    return {
      searchForm: { // 搜索formv
        miCenterName: '',
        miCenterNo: '',
        status: '',
      },
    };
  },
  computed: {
    loading() {
      return this.$store.state.effectLoading[this.queryUrl];
    }
  },
  methods: {
    getColumns() {
      const columns = [
        { prop: 'miCenterName', label: '医保中心'},
        { prop: 'miCenterNo', label: '医保中心编号' },
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
                <el-button onClick={() => this.handleProhibit(row.id, value, '医保中心')} type="text">{DICT_STATUS[value]}</el-button>
                <el-button onClick={() => this.handleInfo(row, 'insuranceCenter')} type="text">修改</el-button>
              </div>
            );
          }
        }
      ];
      return columns;
    },
    datePickerChange(datePicker) {
      this.$refs.insuranceCenterForm.clearValidate();
      this.searchForm.modifyBeginDate = datePicker ? (new Date(datePicker[0])).getTime() : '';
      this.searchForm.modifyEndDate = datePicker ? (new Date(datePicker[1])).getTime() : '';
    },
  }
};
</script>
