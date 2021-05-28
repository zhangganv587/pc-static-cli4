<template>
  <div class="insurance-bindcard">
    <el-form
      ref="insuranceCardForm"
      label-width="130px"
      :inline="true"
      :model="searchForm"
    >
      <el-form-item prop="miNo">
        <el-input v-model="searchForm.miNo" placeholder="医保卡号" clearable />
      </el-form-item>
      <el-form-item prop="idNo">
        <el-input v-model="searchForm.idNo" placeholder="身份证号" clearable />
      </el-form-item>
      <el-form-item prop="userName">
        <el-input
          v-model="searchForm.userName"
          placeholder="用户姓名"
          clearable
        />
      </el-form-item>
      <el-form-item prop="mobile">
        <el-input v-model="searchForm.mobile" placeholder="手机号	" clearable />
      </el-form-item>
      <el-form-item prop="miCenterNo">
        <el-input
          v-model="searchForm.miCenterNo"
          placeholder="医保局编号"
          clearable
        />
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

export default {
  components: {
    'insurance-center-dialog': insuranceCenterDialog,
  },
  mixins: [tableFormMixin, prohibitMixin],
  data() {
    this.columns = this.getColumns();
    this.queryUrl = '/mi/person/query_white_list.json';
    this.pickerProps = {
      startPlaceholder: '更新开始时间',
      endPlaceholder: '更新结束时间',
      valueFormat: 'timestamp'
    };
    return {
      searchForm: { // 搜索form
        miNo: null,
        idNo: null,
        userName: null,
        mobile: null,
        miCenterNo: null
      },
    };
  },
  computed: {
    ...mapGetters({
      bindCardWhiteList: 'bindCardWhiteList',
    }),
    loading() {
      return this.$store.state.effectLoading[this.queryUrl];
    }
  },
  created() {
    // this.$common.judgeState({
    //   bindCardWhiteList: 'getBindCardWhiteList',
    // });
  },
  methods: {
    getColumns() {
      const columns = [
        { prop: 'userId', label: '用户ID'},
        { prop: 'userName', label: '用户姓名' },
        { prop: 'mobile', label: '手机号' },
        { prop: 'idNo', label: '证件号' },
        { prop: 'idType',
          label: '证件类型',
          render: (h, value, row) => {
            return +value === 1 ? '身份证' : '';
          }
        },
        { prop: 'miCenterNo', label: '医保局编号' },
        { prop: 'miNo', label: '医保卡号' },
        { prop: 'gmtCreated',
          label: '绑卡时间',
          width: 200,
          render: (h, value, row) => {
            return this.$common.timeFormat(value, 'YYYY-MM-DD HH:mm:ss');
          },
        },
        { prop: 'gmtModified',
          label: '更新时间',
          width: 200,
          render: (h, value, row) => {
            return this.$common.timeFormat(value, 'YYYY-MM-DD HH:mm:ss');
          },
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
