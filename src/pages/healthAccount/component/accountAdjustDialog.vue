<!--
 * @Author: zhanggan
 * @Date: 2020-11-20 16:05:33
 * @LastEditors: zhanggan
 * @Description: 健康账户管理 - 用户管理 - 用户账户管理 - 调账弹窗
 * @FilePath: /gpay-ops-static/src/pages/healthAccount/component/accountAdjustDialog.vue
-->
<template>
  <v-dialog
    title="银行调账"
    dialog-id="accountAdjustDialog"
    @dialog-close="handleResetForm"
    @dialog-open="getAdjustInfo"
  >
    <el-form
      ref="dialogFormRef"
      label-width="120px"
      :model="formModel"
      :rules="rules"
    >
      <el-form-item label="姓名：" prop="userName">
        {{ formModel.userName }}
      </el-form-item>
      <el-form-item label="账户类型：">
        {{ formModel.bankName }}
      </el-form-item>
      <el-form-item label="现金可用余额：" prop="accountBal">
        {{
          !!formModel.accountBal
            ? $common.moneyFormat(formModel.accountBal)
            : 0.0
        }}元
      </el-form-item>
      <el-form-item label="调账金额：" prop="chargingAmt">
        <el-input
          v-model="formModel.chargingAmt"
          autocomplete="off"
          placeholder="请输入调账金额（元）"
        />
      </el-form-item>
      <el-form-item label="公司对公账户：" required label-width="140">
        兴业银行 | 359590100100177275
      </el-form-item>
      <span style="color: #bbb; padding-left: 120px"
        >调账为将用户可用账户余额直接支付到公司对公账户</span
      >
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="handleApply('dialogFormRef')">
        提交
      </el-button>
    </div>
  </v-dialog>
</template>

<script>
import dialogFormMixin from "@/mixins/dialogFormMixin";
import { MONEY_REG } from "@/utils/constants";

export default {
  mixins: [dialogFormMixin],
  props: {
    row: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    var validatorChargingAmt = (rule, value, callback) => {
      const reg = MONEY_REG;
      const accountBal = +this.formModel.accountBal;
      if (value === "") {
        callback(new Error("请输入调账金额！"));
      } else if (+value * 100 > accountBal) {
        callback(new Error("调账金额不能大于可用金额!"));
      } else if (!!value && !reg.test(value)) {
        callback(new Error("调账金额最多输入小数后两位"));
      } else {
        callback();
      }
    };
    this.rules = {
      chargingAmt: [
        { required: true, trigger: "change", validator: validatorChargingAmt },
      ],
    };
    return {
      formModel: {
        bankName: null,
        accountBal: 0,
        chargingAmt: null,
      },
    };
  },
  methods: {
    getAdjustInfo() {
      this.$fetch("haccount/account/member/toapplycharging", {
        method: "post",
        data: {
          accountMemberId: this.row.accountMemberId,
        },
      })
        .then((res) => {
          if (res.code === 0) {
            this.formModel = res.data;
            this.formModel.userName = this.row.userName;
          }
        })
        .catch(() => {});
    },
    handleApply(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$fetch("/haccount/account/member/applycharging", {
            method: "post",
            data: {
              accountMemberId: this.row.accountMemberId,
              chargingAmt: this.formModel.chargingAmt * 100,
            },
          })
            .then((res) => {
              if (res.data) {
                this.$message.success("提交成功！");
                this.$eventBus.$emit("dialog-visible", false);
                this.handleResetForm();
              }
            })
            .catch(() => {});
        } else {
          this.$message({
            type: "error",
            message: "提交失败请检查!",
          });
          return false;
        }
      });
    },
  },
};
</script>
