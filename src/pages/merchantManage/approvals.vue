<template>
  <div class="finance-summary">
    <el-form ref="form" label-width="90px" :inline="true" :model="searchForm">
      <el-form-item label="流程编号：" prop="applyNo">
        <el-input
          v-model="searchForm.applyNo"
          placeholder="请输入流程编号"
          clearable
        />
      </el-form-item>
      <el-form-item label="审批人：" prop="auditOperator">
        <el-input
          v-model="searchForm.auditOperator"
          placeholder="请输入审批人"
          clearable
        />
      </el-form-item>
      <el-form-item label="审批状态：" prop="auditStatus">
        <el-select
          v-model="searchForm.auditStatus"
          placeholder="请选择审批状态"
        >
          <el-option label="审核通过" value="0" />
          <el-option label="待审核" value="1" />
          <el-option label="审核驳回" value="2" />
        </el-select>
      </el-form-item>
      <el-form-item label="申请人：" prop="applyOperator">
        <el-input
          v-model="searchForm.applyOperator"
          placeholder="请输入申请人"
          clearable
        />
      </el-form-item>
      <el-form-item label="业务编号：" prop="businessCode">
        <el-input
          v-model="searchForm.businessCode"
          placeholder="请输入业务编号"
          clearable
        />
      </el-form-item>
      <el-form-item label="申请时间：" prop="applyDate">
        <we-date-picker
          v-model="searchForm.applyDate"
          @currentChange="applyDatePickerChange"
        />
      </el-form-item>
      <!-- <el-form-item
        label="审批时间："
        prop="approvalDate"
      >
        <we-date-picker
          v-model="searchForm.approvalDate"
          @currentChange="approvalDatePickerChange"
        />
      </el-form-item> -->
      <el-form-item label="审批类型：" prop="phase">
        <el-select v-model="searchForm.phase" placeholder="请选择审批类型">
          <el-option label="商户、业务信息" value="1" />
          <el-option label="支付信息" value="2" />
        </el-select>
      </el-form-item>
      <el-form-item label="商户号：" prop="merchantNo">
        <el-input
          v-model="searchForm.merchantNo"
          placeholder="请输入商户号"
          clearable
        />
      </el-form-item>
      <el-form-item label=" ">
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
import { mapActions, mapGetters } from 'vuex';
import { APPROVAL_STATUS } from '@/utils/constants';
import tableFormMixin from '@/mixins/tableFormMixin';

export default {
  mixins: [tableFormMixin],
  data() {
    this.columns = this.getColumns();
    this.queryUrl = '/review/query.json';
    return {
      searchForm: { // 搜索form
        applyNo: '',
        businessCode: '',
        auditOperator: '',
        applyOperator: '',
        auditStatus: '',
        applyDate: [],
        startDate: '',
        endDate: '',
        // approvalDate: [],
        // applyStartDate: '',
        // applyEndDate: '',
        merchantNo: '',
        phase: '',
      },
    };
  },
  computed: {
    ...mapGetters({
      channelList: 'channelList'
    }),
  },
  created() {
    this.getChannelList();
  },
  methods: {
    ...mapActions({
      getChannelList: 'getChannelList'
    }),

    getColumns() {
      return [
        { prop: 'applyNo', label: '流程编号', width: '150' },
        { prop: 'merchantNo', label: '商户号', width: '150' },
        { prop: 'merchantName', label: '商户名称', width: '180'},
        { prop: 'businessCode', label: '业务编号', width: '200' },
        { prop: 'businessName', label: '业务名称', width: '150' },
        { prop: 'phase', label: '审批类型', width: '160' },
        { prop: 'auditStatus',
          label: '审批状态',
          width: '100',
          render: (h, value, row) => {
            return <span class={APPROVAL_STATUS[value].className}>{APPROVAL_STATUS[value].text}</span>;
          }
        },
        { prop: 'applyOperator', label: '申请人', width: '150' },
        { prop: 'auditOperator', label: '审批人', width: '150' },
        { prop: 'gmtCreated',
          label: '申请时间',
          width: '120',
          render: (h, value, row) => {
            return this.$common.timeFormat(value, 'YYYY-MM-DD HH:mm:ss');
          }
        },
        { prop: 'auditDate',
          label: '审批时间',
          width: '100',
          render: (h, value, row) => {
            return this.$common.timeFormat(value, 'YYYY-MM-DD HH:mm:ss');
          }
        },
        { prop: 'setting',
          label: '操作',
          width: '100',
          fixed: 'right',
          render: (h, value, row) => {
            return (
              <el-button onClick={() => this.handleClickCheck(row)} type="text">
                查看
              </el-button>
            );
          }
        }
      ];
    },

    applyDatePickerChange(datePicker) {
      this.searchForm.applyStartDate = datePicker ? datePicker[0] : '';
      this.searchForm.applyEndDate = datePicker ? datePicker[1] : '';
    },
    handleClickCheck(row) {
      let step = null;
      if (row.phase === '商户、业务信息申请') {
        step = 1;
      } else if (row.phase === '支付信息申请') {
        step = 2;
      } else {
        step = 0;
      }
      this.$store.commit('GET_ADUIT_STATUS', {
        step,
        status: row.auditStatus,
        style: 1,
        from: 1,
      });
      this.$router.push({ path: `/merchant/enterApply/info/${row.id}`});
    }
  }
};
</script>
