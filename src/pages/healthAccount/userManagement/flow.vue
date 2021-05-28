<!--
 * @Author: zhanggan
 * @Date: 2020-10-23 17:00:10
 * @LastEditors: zhanggan
 * @Description: 健康账户管理 - 用户管理 - 用户流水管理
 * @FilePath: /gpay-ops-static/src/pages/healthAccount/userManagement/flow.vue
-->
<template>
  <div class="health-account-user-manage">
    <el-form
      ref="healthAccountFlowManage"
      label-width="130px"
      :inline="true"
      :model="searchForm"
    >
      <el-form-item prop="id">
        <el-input v-model="searchForm.id" placeholder="开户流水号" clearable />
      </el-form-item>
      <el-form-item prop="userName">
        <el-input v-model="searchForm.userName" placeholder="姓名" clearable />
      </el-form-item>
      <el-form-item prop="mobile">
        <el-input v-model="searchForm.mobile" placeholder="手机号" clearable />
      </el-form-item>
      <el-form-item prop="bankNo">
        <el-input
          v-model="searchForm.bankNo"
          placeholder="银行卡号"
          clearable
        />
      </el-form-item>
      <!-- <el-form-item
        prop="merchantName"
      >
        <el-input
          v-model="searchForm.merchantName"
          placeholder="商户名称"
          clearable
        />
      </el-form-item> -->
      <el-form-item prop="openState">
        <el-select
          v-model="searchForm.openState"
          placeholder="开户结果"
          filterable
          clearable
        >
          <el-option
            v-for="(value, key) in RECODE_STATUS"
            :key="key"
            :label="value"
            :value="key"
          />
        </el-select>
      </el-form-item>
      <el-form-item prop="channelNo">
        <el-select
          v-model="searchForm.channelNo"
          placeholder="开户路由"
          filterable
          clearable
        >
          <el-option
            v-for="(channel, key) in HAChannel"
            :key="key"
            :label="channel.channelName"
            :value="channel.channelCode"
          />
        </el-select>
      </el-form-item>
      <el-form-item prop="createTime">
        <we-date-picker
          v-model="createTime"
          :picker-props="pickerProps"
          :default-range="7"
          :max-range="93"
          @currentChange="datePickerChange"
        />
      </el-form-item>
      <el-form-item>
        <v-form-submit
          ref="formSubmit"
          :action="queryUrl"
          :immediate="true"
          :pagination="pagination"
          @click:search="handleSearchForm"
        >
          查询
        </v-form-submit>
        <v-form-reset :form-ref="$refs['healthAccountFlowManage']" />
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
<script>
import { mapGetters } from "vuex";
import confirmMixin from "@/mixins/confirmMixin";
import tableFormMixin from "@/mixins/tableFormMixin";
import prohibitMixin from "@/mixins/prohibitMixin";
// import { RECODE_STATUS, HEALTH_ACCOUNT_FlAG } from '@/utils/constants';
import { RECODE_STATUS } from "@/utils/constants";

export default {
  name: "HealthAccountFlowManage",
  mixins: [tableFormMixin, prohibitMixin, confirmMixin],
  data() {
    this.RECODE_STATUS = RECODE_STATUS;
    this.columns = this.getColumns();
    this.queryUrl = "/haccount/account/user/queryopenuser.json";
    this.pickerProps = {
      startPlaceholder: "开户开始时间",
      endPlaceholder: "开户结束时间",
    };
    return {
      createTime: [],
      searchForm: {
        id: null,
        userName: null,
        mobile: null,
        bankNo: null,
        merchantName: null,
        openState: null,
        channelNo: null,
        openDateTime: null,
      },
    };
  },
  computed: {
    ...mapGetters({
      HAChannel: "HAChannel",
      HACodeList: "HACodeList",
    }),
  },
  created() {
    this.$common.judgeState({
      HAChannel: "getHAChannel",
      HACodeList: "getHACodeList",
    });
  },
  methods: {
    datePickerChange(datePicker) {
      this.searchForm.createTimeStart = datePicker.length
        ? this.dayjs(datePicker[0]).format("YYYY-MM-DD HH:mm:ss")
        : null;
      this.searchForm.createTimeEnd = datePicker.length
        ? this.dayjs(datePicker[1]).format("YYYY-MM-DD HH:mm:ss")
        : null;
    },
    getColumns() {
      const columns = [
        { prop: "recordId", label: "开户流水号" },
        { prop: "userName", label: "姓名" },
        { prop: "mobile", label: "手机号" },
        { prop: "bankNo", label: "银行卡号" },
        // { prop: 'bankName', label: '开卡行' },
        { prop: "channelNoName", label: "开户路由" },
        // { prop: 'merchantName', label: '商户名称' },
        {
          prop: "openState",
          label: "开户结果",
          render: (h, value, row) => {
            // return value ? HEALTH_ACCOUNT_FlAG[value] : null;
            return +value === 1 ? "失败" : "成功";
          },
        },
        {
          prop: "gmt_create",
          label: "开户时间",
          width: 190,
          render: (h, value, row) => {
            return this.$common.timeFormat(value, "YYYY-MM-DD HH:mm:ss");
          },
        },
        {
          prop: "responseMsg",
          label: "银行返回",
          render: (h, value, row) => {
            return value && row.responseCode
              ? row.responseCode + "|" + value
              : null;
          },
        },
      ];
      return columns;
    },
    handleSearchForm(data) {
      if (
        !(this.searchForm.mobile || this.searchForm.bankNo) &&
        !this.searchForm.createTimeStart
      ) {
        this.$message.warning("请选择时间");
      } else {
        this.handleSearch(data);
      }
    },
  },
};
</script>
