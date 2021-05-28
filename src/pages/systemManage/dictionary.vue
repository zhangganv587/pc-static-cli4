<template>
  <div class="dictionary">
    <div class="serchBox">
      <el-form
        ref="dictionaryForm"
        label-width="92px"
        :inline="true"
        :model="searchForm"
      >
        <el-form-item prop="dictText">
          <el-input
            v-model="searchForm.dictText"
            placeholder="字典名称"
            clearable
          />
        </el-form-item>
        <el-form-item prop="dictValue">
          <el-input
            v-model="searchForm.dictValue"
            placeholder="字典编号"
            clearable
          />
        </el-form-item>
        <el-form-item prop="enabled">
          <el-select
            v-model="searchForm.enabled"
            placeholder="字典状态"
            filterable
            clearable
          >
            <el-option label="启用" value="1" />
            <el-option label="禁用" value="0" />
          </el-select>
        </el-form-item>
        <el-form-item prop="dictCode">
          <el-select
            v-model="searchForm.dictCode"
            placeholder="字典类型"
            filterable
            clearable
          >
            <el-option
              v-for="item in dictionaryList"
              :key="item.dictCode"
              :label="item.dictName"
              :value="item.dictCode"
            />
          </el-select>
        </el-form-item>
        <el-form-item prop="rangeData">
          <we-date-picker
            v-model="rangeData"
            :default-range="0"
            :picker-props="pickerProps"
            @currentChange="applyDatePickerChange"
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
          <v-form-reset :form-ref="$refs['dictionaryForm']" />
        </el-form-item>
      </el-form>
    </div>
    <v-add-btn
      :refresh="true"
      refresh-url="/dict/flushCache.json"
      @click="handleInfo({}, 'dictionaryInfo')"
    >
      新增字典
    </v-add-btn>
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
import { AVAILABLE_STATE, DICT_STATUS_ARR } from '@/utils/constants';

export default {
  components: {
    dictionaryInfo
  },
  mixins: [tableFormMixin, prohibitMixin],
  data() {
    this.columns = this.getColumns();
    this.queryUrl = '/dict/query.json';
    this.prohibitArr = [
      {
        url: '/dict/enable.json',
        message: '启用'
      },
      {
        url: '/dict/disable.json',
        message: '禁用'
      },
    ];
    this.pickerProps = {
      startPlaceholder: '更新开始时间',
      endPlaceholder: '更新结束时间',
    };
    return {
      rangeData: [],
      // 搜索form
      searchForm: {
        dictValue: null, // 字典编码",
        dictCode: null, // 字典类型code代码",
        enabled: null, // 启用：1，禁用：0"
        dictName: null,
        startDate: null,
        endDate: null
      },
    };
  },
  computed: {
    ...mapGetters({
      dictionaryList: 'dictionaryList',
    })},
  created() {
    this.$common.judgeState({
      dictionaryList: 'getDictionaryList',
    });
  },
  mounted() {
    // this.handleSearch();
  },
  methods: {
    getColumns() {
      return [
        { prop: 'dictName', label: '字典类型' },
        { prop: 'dictText', label: '字典名称' },
        { prop: 'dictValue', label: '字典编号' },
        { prop: 'remark', label: '说明' },
        { prop: 'gmtCreated',
          label: '添加时间',
          render: (h, value, row) => {
            return this.$common.timeFormat(value, 'YYYY-MM-DD HH:mm:ss');
          }
        },
        { prop: 'gmtModified',
          label: '更新时间',
          render: (h, value, row) => {
            return this.$common.timeFormat(value, 'YYYY-MM-DD HH:mm:ss');
          }
        },
        { prop: 'enabled',
          label: '状态',
          render: (h, value, row) => {
            return (
              <span class="status-flex">
                <span class={DICT_STATUS_ARR[value].className}></span>
                <span>{DICT_STATUS_ARR[value].text}</span>
              </span>
            );
          }
        },
        { prop: 'enabled',
          label: '操作',
          width: '100',
          fixed: 'right',
          render: (h, value, row) => {
            return (
              <div>
                <el-button onClick={() => this.handleProhibit(row.id, value, '字典')} type="text">{AVAILABLE_STATE[value]}</el-button>
                <el-button onClick={() => this.handleInfo(row, 'dictionaryInfo')} type="text">查看</el-button>
              </div>
            );
          }
        }
      ];
    },
    applyDatePickerChange(datePicker) {
      this.searchForm.startDate = datePicker ? datePicker[0] : '';
      this.searchForm.endDate = datePicker ? datePicker[1] : '';
    },
  }
};
</script>
