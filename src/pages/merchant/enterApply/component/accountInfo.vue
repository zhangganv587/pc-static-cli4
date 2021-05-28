<template>
  <el-dialog :visible.sync="infoDialogVisible" @close="closeDialog">
    <div slot="title">
      <span class="el-dialog__title">账号信息</span>
      <span class="sub-title">填入参数说明</span>
      <el-button type="text" @click="help()"> 帮助 >> </el-button>
      <span class="tips">没有账号请联系业务对应财务BP进行申请</span>
    </div>
    <el-form
      ref="accountInfo"
      :model="searchForm"
      :rules="rules"
      class="searchForm"
      label-width="140px"
    >
      <el-form-item label=" ">
        <el-button @click="searchForm.editStyle = false"> 编辑 </el-button>
      </el-form-item>
      <el-form-item label="支付渠道：">
        {{ searchForm.payWayName ? searchForm.payWayName : "" }}
      </el-form-item>
      <el-form-item
        v-show="selectValue === 1"
        label="支付宝账号："
        prop="accountNo"
      >
        <el-input
          v-model="searchForm.accountNo"
          :disabled="searchForm.editStyle"
          placeholder="请输入支付宝账号"
          clearable
        />
      </el-form-item>
      <el-form-item
        v-show="selectValue === 2"
        label="健康账户商户号："
        prop="accountNo"
      >
        <el-input
          v-model="searchForm.accountNo"
          :disabled="searchForm.editStyle"
          placeholder="请输入健康账户商户号"
          clearable
        />
      </el-form-item>
      <el-form-item
        v-show="selectValue === 3"
        label="微信商户号："
        prop="accountNo"
      >
        <el-input
          v-model="searchForm.accountNo"
          :disabled="searchForm.editStyle"
          placeholder="请输入微信商户号"
          clearable
        />
      </el-form-item>
      <el-form-item
        v-show="selectValue != 1 && selectValue != 2 && selectValue != 3"
        label="支付账号："
        prop="accountNo"
      >
        <el-input
          v-model="searchForm.accountNo"
          :disabled="searchForm.editStyle"
          placeholder="请输入支付账号"
          clearable
        />
      </el-form-item>
      <el-form-item label="账户所属公司：" prop="ownerCompany">
        <el-select
          v-model="searchForm.ownerCompany"
          :disabled="searchForm.editStyle"
          filterable
          placeholder="请选择账户所属公司"
        >
          <el-option
            v-for="(company, index) in companyList"
            :key="`company${index}`"
            :label="company.name"
            :value="company.name"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="新建账号业务：">
        {{ searchForm.businessCode ? searchForm.businessCode : "" }}
      </el-form-item>
      <el-form-item label="绑定银行卡开户行：" prop="bankBranch">
        <el-input
          v-model="searchForm.bankBranch"
          :disabled="searchForm.editStyle"
          placeholder="请输入银行名称"
          clearable
        />
      </el-form-item>
      <el-form-item label="银行卡号后四位：" prop="bankCardAcno">
        <el-input
          v-model="searchForm.bankCardAcno"
          :disabled="searchForm.editStyle"
          placeholder="请输入银行卡号后四位"
          clearable
        />
      </el-form-item>
      <el-form-item label="账号管理员：" prop="accountAdminName">
        <el-input
          v-model="searchForm.accountAdminName"
          :disabled="searchForm.editStyle"
          placeholder="请输入管理员名称"
          clearable
        />
      </el-form-item>
      <el-form-item label="管理员联系方式：" prop="accountAdminMail">
        <el-input
          v-model="searchForm.accountAdminMail"
          :disabled="searchForm.editStyle"
          placeholder="请输入管理员邮箱"
          clearable
        />
      </el-form-item>
      <el-form-item label="备注：" prop="memo">
        <el-input
          v-model="searchForm.memo"
          :disabled="searchForm.editStyle"
          placeholder="备注"
          clearable
        />
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="submitForm('accountInfo')">
        保 存
      </el-button>
      <el-button @click="closeDialog"> 取消 </el-button>
    </div>
  </el-dialog>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  props: {
    accountDetails: {
      type: Object,
      default: () => {},
    },
    infoDialogVisible: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      searchForm: {
        id: "",
        editStyle: false,
        payWayId: null,
        accountNo: "",
        ownerCompany: "",
        businessCode: "",
        bankBranch: "",
        bankCardAcno: "",
        accountAdminName: "",
        accountAdminMail: "",
        memo: "",
      },
      rules: {
        accountNo: [
          { required: true, message: "账号不能为空", trigger: "change" },
        ],
        ownerCompany: [
          {
            required: true,
            message: "请至少选择一个账号所属公司",
            trigger: "change",
          },
        ],
        accountAdminName: [
          { required: true, message: "账号管理员不能为空", trigger: "change" },
        ],
        accountAdminMail: [
          {
            required: true,
            message: "管理员联系方式不能为空",
            trigger: "change",
          },
        ],
      },
      // 支付配置需求
      selectValue: 1,
    };
  },
  computed: {
    ...mapGetters({
      businessAdministration: "businessAdministration",
      merchantChannelList: "merchantChannelList",
      companyList: "companyList",
    }),
  },
  watch: {
    accountDetails: {
      handler(newValue) {
        this.searchForm = newValue;
        this.selectValue = newValue.payWayId;
        this.searchForm.accountNo =
          newValue.accountNo !== "99" ? newValue.accountNo : "";
      },
    },
  },
  methods: {
    selectChange(val) {
      this.selectValue = val;
    },
    help() {
      window.location.href = "";
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$emit("addNewAccount", this.searchForm);
          this.closeDialog();
        } else {
          this.$message({
            type: "error",
            message: "提交失败请检查!",
          });
          return false;
        }
      });
    },
    closeDialog() {
      this.$parent.closeDialog();
      this.$refs["accountInfo"].resetFields();
      this.$nextTick(() => {
        this.$refs["accountInfo"].clearValidate();
      });
    },
  },
};
</script>
<style scoped>
.sub-title {
  font-size: 12px;
  color: #a9b5ca;
}
.tips {
  float: right;
  color: #f35e5e;
}
</style>
