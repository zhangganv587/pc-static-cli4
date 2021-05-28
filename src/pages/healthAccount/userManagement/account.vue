<!--
 * @Author: zhanggan
 * @Date: 2020-10-21 16:22:50
 * @LastEditors: zhanggan
 * @Description: 健康账户管理 - 用户管理 - 用户账户管理
 * @FilePath: /gpay-ops-static/src/pages/healthAccount/userManagement/account.vue
-->
<template>
  <div class="health-account-user-manage">
    <el-form
      ref="healthAccountUserManage"
      label-width="130px"
      :inline="true"
      :model="searchForm"
    >
      <el-form-item prop="cusName">
        <el-input v-model="searchForm.cusName" placeholder="姓名" clearable />
      </el-form-item>
      <el-form-item prop="regMobile">
        <el-input
          v-model="searchForm.regMobile"
          placeholder="手机号"
          clearable
        />
      </el-form-item>
      <el-form-item prop="certNo">
        <el-input v-model="searchForm.certNo" placeholder="证件号" clearable />
      </el-form-item>
      <el-form-item prop="userId">
        <el-input v-model="searchForm.userId" placeholder="用户号" clearable />
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
      <!-- <el-form-item
        prop="merchantName"
      >
        <el-input
          v-model="searchForm.merchantName"
          placeholder="商户名称"
          clearable
        />
      </el-form-item> -->
      <el-form-item prop="realNameFlag">
        <el-select
          v-model="searchForm.realNameFlag"
          placeholder="用户状态"
          filterable
          clearable
        >
          <el-option
            v-for="(flag, key) in HEALTH_ACCOUNT_FlAG_ARR"
            :key="key"
            :label="flag.label"
            :value="flag.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item prop="status">
        <el-select
          v-model="searchForm.status"
          placeholder="账户状态"
          filterable
          clearable
        >
          <el-option
            v-for="(status, key) in HEALTH_ACCOUNT_STATUS"
            :key="key"
            :label="status.label"
            :value="status.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item prop="acctType">
        <el-select
          v-model="searchForm.acctType"
          placeholder="账户类型"
          filterable
        >
          <el-option
            v-for="(biz, key) in HACodeList"
            :key="key"
            :label="biz.bizName"
            :value="biz.bizCode"
          />
        </el-select>
      </el-form-item>
      <el-form-item prop="bankNo">
        <el-input
          v-model="searchForm.bankNo"
          placeholder="绑定外部账号"
          clearable
        />
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
    <accountDetialDialog :row="row" />
    <accountAdjustDialog :row="row" />
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import confirmMixin from "@/mixins/confirmMixin";
import tableFormMixin from "@/mixins/tableFormMixin";
import prohibitMixin from "@/mixins/prohibitMixin";
import {
  HEALTH_ACCOUNT_STATUS,
  HEALTH_ACCOUNT_FlAG,
  HEALTH_ACCOUNT_FlAG_ARR,
} from "@/utils/constants";
import accountDetialDialog from "../component/accountDetialDialog";
import accountAdjustDialog from "../component/accountAdjustDialog";

export default {
  name: "HealthAccountUserManage",
  components: {
    accountDetialDialog,
    accountAdjustDialog,
  },
  mixins: [tableFormMixin, prohibitMixin, confirmMixin],
  data() {
    this.HEALTH_ACCOUNT_FlAG_ARR = HEALTH_ACCOUNT_FlAG_ARR;
    this.HEALTH_ACCOUNT_STATUS = HEALTH_ACCOUNT_STATUS;
    this.columns = this.getColumns();
    this.queryUrl = "/haccount/account/member/page";
    this.pickerProps = {
      startPlaceholder: "绑定开始时间",
      endPlaceholder: "绑定结束时间",
    };
    return {
      createTime: [],
      searchForm: {
        cusName: null,
        regMobile: null,
        certNo: null,
        userId: null,
        channelNo: null,
        merchantName: null,
        realNameFlag: null,
        status: null,
        bankNo: null,
        acctType: "healthaccount",
      },
      dataList: {},
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
        { prop: "cusName", label: "姓名" },
        { prop: "regMobile", label: "手机号" },
        { prop: "certNo", label: "证件号" },
        { prop: "userId", label: "用户号" },
        {
          prop: "realNameFlag",
          label: "用户状态",
          render: (h, value, row) => {
            if (row.acctType !== "healthaccount") {
              return "";
            } else {
              return value !== "" ? HEALTH_ACCOUNT_FlAG[value] : null;
            }
          },
        },
        { prop: "acctTypeText", label: "账户类型" },
        { prop: "channelNoName", label: "开户路由" },
        { prop: "accountMemberId", label: "内部账号" },
        { prop: "custNo", label: "银行客户号" },
        {
          prop: "status",
          label: "账户状态",
          render: (h, value, row) => {
            return value ? HEALTH_ACCOUNT_STATUS[value].label : null;
          },
        },
        { prop: "bankNo", label: "绑定外部账号" },
        { prop: "openAccountTime", label: "开户时间", width: 190 },
        {
          prop: "status",
          label: "操作",
          width: "100",
          render: (h, value, row) => {
            const isUser = this.$route.path === "/healthaccount/useraccount";
            return (
              <div>
                {row.realNameFlag === 2 || row.acctType !== "healthaccount" ? (
                  <el-button
                    onClick={() => this.handleInfo(row, "accountDetialDialog")}
                    type="text"
                  >
                    详情
                  </el-button>
                ) : null}
                {(row.realNameFlag === 2 && row.acctType !== "redaccount") ||
                (row.acctType !== "redaccount" &&
                  row.acctType !== "healthaccount") ? (
                  <el-button
                    onClick={() =>
                      this.handleCommonConfirm(
                        row.accountMemberId,
                        "/haccount/account/member/untie",
                        "解绑",
                        { acctType: row.acctType }
                      )
                    }
                    type="text"
                  >
                    解绑
                  </el-button>
                ) : null}
                {(row.realNameFlag === 2 || row.acctType !== "healthaccount") &&
                +value === 0 &&
                !isUser ? (
                  <el-button
                    onClick={() =>
                      this.handleCommonConfirm(
                        row.accountMemberId,
                        "/haccount/account/member/freezeacct",
                        "冻结"
                      )
                    }
                    type="text"
                  >
                    冻结
                  </el-button>
                ) : null}
                {(row.realNameFlag === 2 || row.acctType !== "healthaccount") &&
                +value === 2 &&
                !isUser ? (
                  <el-button
                    onClick={() =>
                      this.handleCommonConfirm(
                        row.accountMemberId,
                        "/haccount/account/member/unfreezeacct",
                        "解冻"
                      )
                    }
                    type="text"
                  >
                    解冻
                  </el-button>
                ) : null}
                {row.realNameFlag === 2 &&
                row.acctType === "healthaccount" &&
                !isUser ? (
                  <el-button
                    onClick={() => this.handleInfo(row, "accountAdjustDialog")}
                    type="text"
                  >
                    调账
                  </el-button>
                ) : null}
              </div>
            );
          },
        },
      ];
      return columns;
    },
    handleSearchForm(data) {
      if (
        !(this.searchForm.regMobile || this.searchForm.certNo) &&
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
