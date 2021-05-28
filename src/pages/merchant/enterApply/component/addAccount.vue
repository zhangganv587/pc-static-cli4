<template>
  <el-dialog
    title="支付账号"
    :close-on-click-modal="false"
    :visible.sync="addDialogVisible"
    :show-close="false"
  >
    <el-form ref="searchForm" :model="searchForm" :rules="rules">
      <el-form-item :label-width="formLabelWidth" prop="id">
        <el-select
          v-model="searchForm.id"
          placeholder="渠道"
          @change="selectChangeMerchant"
        >
          <el-option
            v-for="(channel, index) in merchantChannelList"
            :key="`channel${index}`"
            :label="channel.payWayName"
            :value="channel.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item :label-width="formLabelWidth" prop="accountNo">
        <el-select
          v-model="searchForm.accountNo"
          placeholder="支付账号"
          @change="selectChangeAccount"
        >
          <el-option key="99" value="99" />
          <el-option
            v-for="(item, index) in account"
            :key="`item${index}`"
            :label="item.paymentAccount"
            :value="item.accountNo"
          />
        </el-select>
        <p class="form-item-extra">
          请选择与业务签约公司一致的支付账号，如没有请选择无可用账号或与财务沟通分配合适账号
        </p>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="resetForm('searchForm')"> 取消 </el-button>
      <el-button type="primary" @click="submitForm('searchForm')">
        确定
      </el-button>
    </div>
  </el-dialog>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  props: {
    addDialogVisible: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      formLabelWidth: "120px",
      merchantChannel: {},
      paymentAccount: {},
      account: [],
      searchForm: {
        id: "",
        accountNo: "",
      },
      rules: {
        payWayId: [
          { required: true, message: "支付渠道不能为空", trigger: "change" },
        ],
        accountNo: [
          { required: true, message: "支付账号不能为空", trigger: "change" },
        ],
      },
    };
  },
  computed: {
    ...mapGetters({
      merchantChannelList: "merchantChannelList",
      paymentAccountList: "paymentAccountList",
    }),
  },
  methods: {
    selectChangeMerchant() {
      this.account = [];
      this.searchForm.accountNo = "";
      this.merchantChannelList.forEach((element) => {
        if (element.id === this.searchForm.id) {
          this.merchantChannel = { ...element };
        }
      });
      this.paymentAccountList.forEach((element) => {
        if (element.payWayCode === this.merchantChannel.payWayCode) {
          this.account.push(element);
        }
      });
    },
    selectChangeAccount() {
      this.paymentAccountList.forEach((element) => {
        if (element.accountNo === this.searchForm.accountNo) {
          this.paymentAccount = { ...element };
        }
      });
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const accountVOS = {
            paymentAccount:
              this.merchantChannel.payWayName +
              (this.searchForm.accountNo === "99"
                ? "(无可用账号)"
                : "(" + this.searchForm.accountNo + ")") +
              (this.searchForm.accountNo === "99"
                ? ""
                : "-" + this.paymentAccount.ownerCompany),
            accountId: this.paymentAccount.id,
            accountNo: this.searchForm.accountNo,
            payWayCode: this.merchantChannel.payWayCode,
            payWayId: this.merchantChannel.id,
          };
          this.$emit("addAccountVOS", accountVOS);
          this.resetForm("searchForm");
        } else {
          this.$message({
            type: "error",
            message: "提交失败请检查!",
          });
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$parent.closeDialog();
      this.$refs[formName].resetFields();
    },
  },
};
</script>
