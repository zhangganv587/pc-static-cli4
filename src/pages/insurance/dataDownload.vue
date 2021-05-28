<!--
 * @Author: zhanggan
 * @Date: 2020-07-13 15:49:10
 * @LastEditors: zhanggan
 * @FilePath: /gpay-ops-static/src/pages/insurance/dataDownload.vue
-->
<template>
  <div class="data-download-list">
    <el-form
      ref="dataListForm"
      label-width="130px"
      :inline="true"
      :model="searchForm"
      :rules="rules"
    >
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
      <el-form-item prop="categoryType">
        <el-select
          v-model="searchForm.categoryType"
          placeholder="目录类型"
          filterable
          clearable
        >
          <el-option
            v-for="(disease, index) in CATEGORY_TYPE_ARR"
            :key="index"
            :label="disease.label"
            :value="disease.value"
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
        <el-button type="primary opcity" size="small" @click="handleUpdate">
          同步
        </el-button>
        <el-button
          type="primary opcity"
          size="small"
          @click="handleSearch({ pageIndex: 1, pageSize: 10 })"
        >
          查询
        </el-button>
        <v-form-reset :form-ref="$refs['dataListForm']" />
      </el-form-item>
    </el-form>
    <v-table
      v-loading="loading"
      :data="tableData"
      :columns="columns"
      :pagination="pagination"
      @currentChange="currentChange"
    />
  </div>
</template>

<script type="text/jsx">
import tableFormMixin from '@/mixins/tableFormMixin';
import { mapGetters } from 'vuex';
import { CATEGORY_TYPE_ARR } from '@/utils/constants';

export default {
  mixins: [tableFormMixin],
  data() {
    this.CATEGORY_TYPE_ARR = CATEGORY_TYPE_ARR;
    this.columns = this.getColumns();
    this.queryUrl = '/mi/catalogue/pageList.json';
    this.pickerProps = {
      startPlaceholder: '开始时间',
      endPlaceholder: '结束时间',
    };
    this.rules = {
      miCenterNo: [
        { required: true, message: '请选择医保中心', trigger: ['blur', 'change'] },
      ],
      categoryType: [
        { required: true, message: '请选择目录类型', trigger: ['blur', 'change'] },
      ],
    };
    return {
      searchForm: { // 搜索form
        miCenterNo: null,
        categoryType: null,
        startCreateTime: null,
        endCreateTime: null,
      },
      rangeData: [],

      // 分页
      pagination: {
        pageSize: 10,
        pageIndex: 1,
        totalNum: 0,
      },

      // table
      tableData: [],

      // dialog
      row: {},
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
        { prop: 'categoryName', label: '目录名称'},
        { prop: 'categoryId', label: '目录代码' },
        { prop: 'categoryType',
          label: '目录类型',
          render: (h, value, row) => {
            return CATEGORY_TYPE_ARR[value - 1].label;
          },
        },
        { prop: 'miCenterName', label: '参保机构'},
        { prop: 'categoryExt', label: '扩展' },
        { prop: 'gmtCreated',
          label: '创建时间',
          render: (h, value, row) => {
            return this.$common.timeFormat(value, 'YYYY-MM-DD HH:mm:ss');
          },
        },
      ];
      return columns;
    },
    datePickerChange(datePicker) {
      this.$refs.dataListForm.clearValidate();
      this.searchForm.startCreateTime = datePicker ? (new Date(datePicker[0])).getTime() : '';
      this.searchForm.endCreateTime = datePicker ? (new Date(datePicker[1])).getTime() : '';
    },
    handleSearch(data) {
      this.$refs.dataListForm.validate((valid) => {
        if (valid) {
          this.$fetch(this.queryUrl, {
            data: {
              ...this.searchForm,
              ...this.pagination,
              ...data,
            },
            method: 'post',
          }).then(res => {
            if (res.code === 0 && res.data) {
              this.tableData = res.data.dataList;
              this.pagination.pageIndex = res.data.pageNum;
              this.pagination.pageSize = res.data.pageSize;
              this.pagination.totalNum = res.data.totalNum;
            } else {
              this.tableData = [];
              this.pagination.totalNum = 0;
            }
          });
        }
      });
    },
    handleUpdate() {
      this.$refs.dataListForm.validate((valid) => {
        if (valid) {
          this.$fetch('/mi/catalogue/sync.json', {
            data: {
              miCenterNo: this.searchForm.miCenterNo,
              categoryType: this.searchForm.categoryType
            },
            method: 'post',
          }).then(res => {
            if (res.code === 0) {
              this.$message({
                type: 'success',
                message: '更新成功！'
              });
            }
          });
        }
      });
    },
    currentChange(val) {
      this.pagination = {...this.pagination, ...val};
      this.handleSearch(this.pagination);
    },
    handleInfo(row, dialogId) {
      this.row = row;
      this.$eventBus.$emit('dialog-visible', {
        visible: true,
        dialogId
      });
    },
  }
};
</script>
