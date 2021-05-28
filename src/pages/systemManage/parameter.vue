<template>
  <div class="parameter">
    <div class="serchBox">
      <el-form
        ref="parameterForm"
        label-width="92px"
        :inline="true"
        :model="searchForm"
      >
        <el-form-item prop="propertyKey">
          <el-input
            v-model="searchForm.propertyKey"
            placeholder="参数名称"
            clearable
          />
        </el-form-item>
        <el-form-item prop="propertyValue">
          <el-input
            v-model="searchForm.propertyValue"
            placeholder="参数键值"
            clearable
          />
        </el-form-item>
        <el-form-item prop="propertyState">
          <el-select
            v-model="searchForm.propertyState"
            placeholder="参数状态"
            filterable
            clearable
          >
            <el-option label="启用" value="1" />
            <el-option label="禁用" value="0" />
          </el-select>
        </el-form-item>
        <!-- <el-form-item
          prop="dictCode"
        >
          <el-select
            v-model="searchForm.dictCode"
            placeholder="参数类型"
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
        </el-form-item> -->
        <!-- <el-form-item
          prop="rangeData"
        >
          <we-date-picker
            v-model="rangeData"
            :default-range="0"
            :picker-props="pickerProps"
            @currentChange="applyDatePickerChange"
          />
        </el-form-item> -->
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
          <v-form-reset :form-ref="$refs['parameterForm']" />
        </el-form-item>
      </el-form>
    </div>
    <v-add-btn
      :refresh="true"
      refresh-url="/property/flushCache.json"
      @click="handleInfo({}, 'parameterInfo')"
    >
      新增参数
    </v-add-btn>
    <v-table
      v-loading="loading"
      :data="tableData"
      :columns="columns"
      :pagination="pagination"
      @currentChange="currentChange"
    />
    <parameter-info :row-data="row" />
  </div>
</template>

<script type="text/jsx">
import { mapGetters } from 'vuex';
import parameterInfo from './component/parameterInfo';
import tableFormMixin from '@/mixins/tableFormMixin';
import prohibitMixin from '@/mixins/prohibitMixin';
import { DICT_STATUS } from '@/utils/constants';

export default {
  components: {
    parameterInfo
  },
  mixins: [tableFormMixin, prohibitMixin],
  data() {
    this.columns = this.getColumns();
    this.queryUrl = '/property/query.json';
    this.prohibitArr = [
      {
        url: '/property/enable.json',
        message: '启用'
      },
      {
        url: '/property/disable.json',
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
        propertyValue: null, // 参数键值",
        propertyKey: null, // 参数类型code代码",
        propertyState: null, // 启用：1，禁用：0"
        // dictName: null,
        // startDate: null,
        // endDate: null
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
        // { prop: 'dictName', label: '参数类型' },
        { prop: 'propertyKey', label: '参数名称' },
        { prop: 'propertyValue', label: '参数键值' },
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
        { prop: 'propertyState',
          label: '状态',
          render: (h, value, row) => {
            return DICT_STATUS[value];
          }
        },
        { prop: 'propertyState',
          label: '操作',
          width: '100',
          fixed: 'right',
          render: (h, value, row) => {
            return (
              <div>
                <el-button onClick={() => this.handleProhibit(row.id, value, '参数')} type="text">{DICT_STATUS[1 - value]}</el-button>
                <el-button onClick={() => this.handleInfo(row, 'parameterInfo')} type="text">查看</el-button>
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
