<!--
 * @Author: 张淦
 * @Date: 2020-03-18 10:34:43
 * @LastEditors: 张淦
 * @Description: 医保后台-医疗机构管理
 * @FilePath: /gpay-ops-static/src/pages/insurance/medicalInstitution.vue
 -->
<template>
  <div class="medical-institution">
    <el-form ref="form" label-width="130px" :inline="true" :model="searchForm">
      <el-form-item prop="hospitalName">
        <el-input
          v-model="searchForm.hospitalName"
          placeholder="医疗机构名称"
          clearable
        />
      </el-form-item>
      <el-form-item prop="hospitalNum">
        <el-input
          v-model="searchForm.hospitalNum"
          placeholder="医疗机构机构号"
          clearable
        />
      </el-form-item>
      <el-form-item prop="status">
        <el-select
          v-model="searchForm.status"
          placeholder="医疗机构状态"
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
      <el-form-item prop="miCenterNo">
        <el-select
          v-model="searchForm.miCenterNo"
          placeholder="医保中心"
          filterable
          clearable
        >
          <el-option
            v-for="(center, index) in medicalCenterList"
            :key="index"
            :label="center.value"
            :value="center.code"
          />
        </el-select>
      </el-form-item>
      <el-form-item prop="hospitalType">
        <el-select
          v-model="searchForm.hospitalType"
          placeholder="医疗机构类型"
          filterable
          clearable
        >
          <el-option
            v-for="(list, index) in hospitalList"
            :key="index"
            :label="list"
            :value="index"
          />
        </el-select>
      </el-form-item>
      <el-form-item prop="hospitalNo">
        <el-input
          v-model="searchForm.hospitalNo"
          placeholder="两定单位编号"
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
    <v-add-btn @click="handleInfo({}, 'medicalInstitution')">
      添加医疗机构
    </v-add-btn>
    <v-table
      v-loading="loading"
      :data="tableData"
      :columns="columns"
      :pagination="pagination"
      @currentChange="currentChange"
    />
    <medical-institution-dialog :row-data="row" />
  </div>
</template>

<script type="text/jsx">
import { mapGetters } from 'vuex';
import tableFormMixin from '@/mixins/tableFormMixin';
import prohibitMixin from '@/mixins/prohibitMixin';
import medicalInstitutionDialog from './medicalInstitutionDialog';
import { AVAILABLE_STATE, DICT_STATUS, HOSPITAL_TYPE, AVAILABLE_STATE_ARR } from '@/utils/constants';

export default {
  components: {
    'medical-institution-dialog': medicalInstitutionDialog,
  },
  mixins: [tableFormMixin, prohibitMixin],
  data() {
    this.columns = this.getColumns();
    this.availableState = AVAILABLE_STATE;
    this.hospitalList = HOSPITAL_TYPE;
    this.queryUrl = '/mi/hospital/query.json';
    this.prohibitArr = [
      {
        url: '/mi/hospital/disable.json',
        message: '禁用'
      },
      {
        url: '/mi/hospital/enable.json',
        message: '启用'
      },
    ];
    this.pickerProps = {
      startPlaceholder: '更新开始时间',
      endPlaceholder: '更新结束时间',
    };
    return {
      searchForm: { // 搜索form
        miCenterNo: '',
        hospitalName: '',
        hospitalNum: '',
        hospitalType: '',
        hospitalNo: '',
      },
      rangeData: [],
    };
  },
  computed: {
    ...mapGetters({
      medicalCenterList: 'medicalCenterList'
    }),
    loading() {
      return this.$store.state.effectLoading[this.queryUrl];
    }
  },
  created() {
    this.$common.judgeState({
      medicalCenterList: 'getMedicalCenterList',
    });
  },
  methods: {
    getColumns() {
      const columns = [
        { prop: 'hospitalName', label: '医疗机构'},
        { prop: 'hospitalNum', label: '医疗机构机构号' },
        { prop: 'hospitalType',
          label: '医疗机构机类型',
          render: (h, value, row) => {
            return this.hospitalList[value];
          },
        },
        { prop: 'hospitalNo', label: '两定单位编号' },
        { prop: 'miCenterName', label: '医保中心' },
        { prop: 'contact', label: '联系人' },
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
                <el-button onClick={() => this.handleProhibit(row.id, value, '医疗机构')} type="text">{DICT_STATUS[value]}</el-button>
                <el-button onClick={() => this.handleInfo(row, 'medicalInstitution')} type="text">查看</el-button>
              </div>
            );
          }
        }
      ];
      return columns;
    },
    datePickerChange(datePicker) {
      this.$refs.form.clearValidate();
      this.searchForm.modifyBeginDate = datePicker ? (new Date(datePicker[0])).getTime() : '';
      this.searchForm.modifyEndDate = datePicker ? (new Date(datePicker[1])).getTime() : '';
    },
  }
};
</script>
