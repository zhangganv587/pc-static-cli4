<template>
  <div class="health-account-user-manage">
    <el-form
      ref="healthAccountUserManage"
      label-width="130px"
      :inline="true"
      :model="searchForm"
    >
      <el-form-item prop="certNo">
        <el-input v-model="searchForm.certNo" placeholder="证件号" clearable />
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
        <v-form-reset :form-ref="$refs['healthAccountUserManage']" />
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
import confirmMixin from "@/mixins/confirmMixin";
import tableFormMixin from "@/mixins/tableFormMixin";
import prohibitMixin from "@/mixins/prohibitMixin";
import { HEALTH_ACCOUNT_STATUS, HEALTH_ACCOUNT_FlAG } from "@/utils/constants";

export default {
  name: "HealthAccountUserManage",
  mixins: [tableFormMixin, prohibitMixin, confirmMixin],
  data() {
    this.columns = this.getColumns();
    this.queryUrl = "/haccount/account/member/page";
    this.pickerProps = {
      startPlaceholder: "更新开始时间",
      endPlaceholder: "更新结束时间",
    };
    return {
      searchForm: {
        certNo: "",
      },
    };
  },
  methods: {
    datePickerChange(datePicker) {
      this.$refs.healthAccountUserManage.clearValidate();
      this.searchForm.createTimeStart = datePicker
        ? new Date(datePicker[0]).getTime()
        : "";
      this.searchForm.createTimeEnd = datePicker
        ? new Date(datePicker[1]).getTime()
        : "";
    },
    getColumns() {
      const columns = [
        { prop: "cusName", label: "姓名" },
        { prop: "regMobile", label: "手机号" },
        { prop: "certNo", label: "证件号" },
        { prop: "userVerifyNo", label: "内部用户号" },
        {
          prop: "realNameFlag",
          label: "用户状态",
          render: (h, value, row) => {
            return value ? HEALTH_ACCOUNT_FlAG[value] : null;
          },
        },
        { prop: "acctTypeText", label: "账户类型" },
        { prop: "id", label: "账户" },
        { prop: "custNo", label: "银行客户号" },
        {
          prop: "status",
          label: "账户状态",
          render: (h, value, row) => {
            return value ? HEALTH_ACCOUNT_STATUS[value].label : null;
          },
        },
        { prop: "merchantName", label: "商户名称" },
        { prop: "openAccountTime", label: "开户时间" },
        { prop: "lastModifiedTime", label: "更新时间" },
        {
          prop: "status",
          label: "操作",
          width: "100",
          render: (h, value, row) => {
            if (row.realNameFlag === 2) {
              return (
                <div>
                  <el-button
                    onClick={() =>
                      this.handleCommonConfirm(
                        row.accountMemberId,
                        "/haccount/account/member/untie",
                        "解绑"
                      )
                    }
                    type="text"
                  >
                    解绑
                  </el-button>
                </div>
              );
            }
          },
        },
      ];
      return columns;
    },
  },
};
</script>
