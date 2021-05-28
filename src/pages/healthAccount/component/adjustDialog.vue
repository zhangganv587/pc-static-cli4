<!--
 * @Author: zhanggan
 * @Date: 2020-11-20 16:05:33
 * @LastEditors: zhanggan
 * @Description: 健康账户管理 - 交易管理 - 调账管理 - 审批弹窗
 * @FilePath: /gpay-ops-static/src/pages/healthAccount/component/adjustDialog.vue
-->
<template>
  <v-dialog
    title="调账"
    dialog-id="adjustDialog"
    @dialog-close="handleClose"
    @dialog-open="getAdjustInfo"
  >
    <el-form ref="dialogFormRef" label-width="120px" :model="formModel">
      <el-form-item label="姓名：" prop="userName">
        {{ formModel.userName }}
      </el-form-item>
      <el-form-item label="银行卡号：" prop="bankNo">
        {{ formModel.bankNo }}
      </el-form-item>
      <el-form-item label="可用账户余额：" prop="accountBal">
        {{
          !!formModel.accountBal
            ? $common.moneyFormat(formModel.accountBal)
            : 0.0
        }}元
      </el-form-item>
      <el-form-item label="调账金额：" prop="chargeAmt" required>
        {{
          !!formModel.chargeAmt
            ? $common.moneyFormat(formModel.chargeAmt)
            : 0.0
        }}元
      </el-form-item>
      <el-form-item
        label="公司对公账户："
        prop="remark"
        required
        label-width="140"
      >
        兴业银行 | 359590100100177275<br />
        <span style="color: #bbb; padding-left: 120px"
          >调账为将用户可用账户余额直接支付到公司对公账户</span
        >
      </el-form-item>
      <el-form-item />
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button :disabled="formModel.status === 1" @click="handleApply('1')">
        驳回
      </el-button>
      <el-button
        :disabled="formModel.status === 1"
        type="primary"
        @click="handleApply('0')"
      >
        通过
      </el-button>
    </div>
  </v-dialog>
</template>

<script>
import dialogFormMixin from "@/mixins/dialogFormMixin";

export default {
  mixins: [dialogFormMixin],
  props: {
    row: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      formModel: {
        adjustName: null,
        bankNo: null,
        accountBal: null,
        chargeAmt: null,
        remark: null,
        status: 1,
      },
    };
  },
  methods: {
    getAdjustInfo(chargeId) {
      this.$fetch("haccount/account/charge/tocheckpage", {
        method: "post",
        data: {
          chargeId: this.row.chargeId,
        },
      })
        .then((res) => {
          if (res.code === 0 && res.data && +res.data.status === 0) {
            this.formModel = res.data;
            this.formModel.userName = this.row.userName;
          } else if (res.code === 0 && res.data && +res.data.status === 1) {
            this.formModel = res.data;
            this.formModel.userName = this.row.userName;
            this.$message.warning(res.data.msg);
          }
        })
        .catch(() => {});
    },
    handleApply(opt) {
      this.$fetch("/haccount/account/charge/accountopt", {
        method: "post",
        data: {
          chargeId: this.row.chargeId,
          opt,
        },
      })
        .then((res) => {
          // 0 成功，1 失败
          if (res.data && +res.data.status === 0) {
            const meaasge = ["通过", "驳回"];
            this.$message(`已${meaasge[opt]}！`);
            this.handleResetForm();
            this.$eventBus.$emit("dialog-visible", false);
          } else {
            this.$message.warning(res.data.msg);
          }
        })
        .catch(() => {});
    },
    handleClose() {
      this.$eventBus.$emit("dialog-visible", false);
      this.handleResetForm();
    },
  },
};
</script>
