<!--
 * @Author: 张淦
 * @Date: 2020-03-19 10:42:18
 * @LastEditors: 张淦
 * @Description: 医保后台-参保人管理页面
 * @FilePath: /gpay-ops-static/src/pages/insurance/insuranceCard.vue
 -->
<template>
  <div class="insurance-card">
    <el-form
      ref="insuranceCardForm"
      label-width="130px"
      :inline="true"
      :model="searchForm"
    >
      <el-form-item prop="miNo">
        <el-input v-model="searchForm.miNo" placeholder="医保编号" clearable />
      </el-form-item>
      <el-form-item prop="idNo">
        <el-input v-model="searchForm.idNo" placeholder="身份证号" clearable />
      </el-form-item>
      <el-form-item prop="name">
        <el-input v-model="searchForm.name" placeholder="用户姓名" clearable />
      </el-form-item>
      <el-form-item prop="status">
        <el-select
          v-model="searchForm.status"
          placeholder="状态"
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
      <el-form-item prop="regResType">
        <el-select
          v-model="searchForm.regResType"
          placeholder="参保类型"
          filterable
          clearable
        >
          <el-option
            v-for="hospital in medicalTypeList"
            :key="hospital.code"
            :label="hospital.value"
            :value="hospital.code"
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
        <v-form-reset :form-ref="$refs['insuranceCardForm']" />
      </el-form-item>
    </el-form>
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
import { mapGetters } from 'vuex';
import tableFormMixin from '@/mixins/tableFormMixin';
import prohibitMixin from '@/mixins/prohibitMixin';
import insuranceCenterDialog from './insuranceCenterDialog';
import { AVAILABLE_STATE, DICT_STATUS, DICT_STATUS_ARR } from '@/utils/constants';

export default {
  components: {
    'insurance-center-dialog': insuranceCenterDialog,
  },
  mixins: [tableFormMixin, prohibitMixin],
  data() {
    this.columns = this.getColumns();
    this.availableState = DICT_STATUS;
    this.queryUrl = '/mi/person/query.json';
    this.prohibitArr = [
      {
        url: '/mi/person/enable.json',
        message: '启用'
      },
      {
        url: '/mi/person/disable.json',
        message: '禁用'
      },
    ];
    this.pickerProps = {
      startPlaceholder: '更新开始时间',
      endPlaceholder: '更新结束时间',
      valueFormat: 'timestamp'
    };
    return {
      searchForm: { // 搜索form
        miNo: null,
        idNo: null,
        name: null,
        patientId: null,
        status: null,
        regResType: null,
        modifyBeginDate: null,
        modifyEndDate: null,
      },
    };
  },
  computed: {
    ...mapGetters({
      medicalTypeList: 'medicalTypeList',
    }),
    loading() {
      return this.$store.state.effectLoading[this.queryUrl];
    }
  },
  created() {
    this.$common.judgeState({
      medicalTypeList: 'getMedicalTypeList',
    });
  },
  methods: {
    getColumns() {
      const columns = [
        { prop: 'miNo', label: '医保编号'},
        { prop: 'miCenterName', label: '医保机构' },
        { prop: 'regResType',
          label: '参保类型',
          render: (h, value, row) => {
            let status = '无';
            this.medicalTypeList.forEach(element => {
              if (parseInt(element.code) === value) {
                status = element.value;
              }
            });
            return status;
          },
        },
        { prop: 'status',
          label: '状态',
          width: '100',
          render: (h, value, row) => {
            return (
              <span class="status-flex">
                <span class={DICT_STATUS_ARR[value].className}></span>
                <span>{DICT_STATUS_ARR[value].text}</span>
              </span>
            );
          },
        },
        { prop: 'name', label: '姓名' },
        { prop: 'mobile', label: '手机号' },
        { prop: 'idNo', label: '身份证' },
        { prop: 'gmtCreated',
          label: '绑卡时间',
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
          label: '操作',
          width: '100',
          render: (h, value, row) => {
            return (
              <el-button onClick={() => this.handleProhibit(row.id, value, '参保人')} type="text">{AVAILABLE_STATE[value]}</el-button>
            );
          }
        }
      ];
      return columns;
    },
    datePickerChange(datePicker) {
      this.$refs.insuranceCardForm.clearValidate();
      this.searchForm.modifyBeginDate = datePicker ? (new Date(datePicker[0])).getTime() : '';
      this.searchForm.modifyEndDate = datePicker ? (new Date(datePicker[1])).getTime() : '';
    },
  }
};
</script>
