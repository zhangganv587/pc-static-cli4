<template>
  <v-dialog
    title="更新退款"
    dialog-id="refundRecordUpdate"
    class="dialogFormUpdate"
    @dialog-open="handleDialogOpen"
  >
    <el-form label-width="135px" :model="updateFormModel">
      <el-form-item label="批次号：">
        <el-input
          v-model="updateFormModel.batchNo"
          placeholder="请输入批次号"
          maxlength="100"
          :disabled="true"
        />
      </el-form-item>
      <el-form-item label="新批次号：">
        <el-input
          v-model="updateFormModel.newBatchNo"
          placeholder="请输入新批次号"
          maxlength="100"
          clearable
        />
        <p class="tip">
          目前只有支付宝退费异常重复退费需要修改新批次号，
          将退费批次号日期修改为当天20180209***， 其他不需要修改
        </p>
      </el-form-item>
      <el-form-item label="收款账号：">
        <el-input
          v-model="updateFormModel.accountNo"
          placeholder="请输入收款账号"
          maxlength="100"
          clearable
        />
      </el-form-item>
      <el-form-item label="支付方式：">
        <el-select
          v-model="updateFormModel.payWays"
          clearable
          placeholder="请选择支付方式"
        >
          <el-option
            v-for="item in payConfigList.payWay"
            :key="item.code"
            :label="item.memo"
            :value="item.code"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="支付机构流水号：">
        <el-input
          v-model="updateFormModel.paidNo"
          placeholder="请输入支付机构流水号"
          :disabled="true"
        />
      </el-form-item>
      <el-form-item label="支付流水号：">
        <el-input
          v-model="updateFormModel.payLogNo"
          placeholder="请输入支付流水号"
          :disabled="true"
        />
      </el-form-item>
      <el-form-item label="退费流水号：">
        <el-input
          v-model="updateFormModel.refundNo"
          placeholder="请输入退费流水号"
          :disabled="true"
        />
      </el-form-item>
      <el-form-item label="退费原因：">
        <el-input
          v-model="updateFormModel.reason"
          placeholder="请输入退费原因"
          clearable
        />
      </el-form-item>
      <el-form-item label="平台id：">
        <el-input
          v-model="updateFormModel.platId"
          placeholder="请输入平台id"
          :disabled="true"
        />
      </el-form-item>
      <el-form-item label="通知地址：">
        <el-input
          v-model="updateFormModel.notifyUrl"
          placeholder="请输入通知地址"
          clearable
        />
      </el-form-item>
      <el-form-item label="金额：">
        <el-input
          v-model="updateFormModel.amount"
          placeholder="请输入金额"
          :disabled="true"
        />
      </el-form-item>
      <el-form-item label="用户账号：">
        <el-input
          v-model="updateFormModel.recvUserId"
          placeholder="请输入用户账号"
          clearable
        />
      </el-form-item>
      <el-form-item label="支付机构退款id：">
        <el-input
          v-model="updateFormModel.refundId"
          placeholder="请输入支付机构退款id"
          clearable
        />
      </el-form-item>
      <el-form-item label="通知状态：">
        <el-select
          v-model="updateFormModel.callbackStatus"
          clearable
          placeholder="请输入通知状态"
        >
          <el-option
            v-for="item in payConfigList.callbackStatus"
            :key="item.code"
            :label="item.memo"
            :value="item.code"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="退费状态：">
        <el-select
          v-model="updateFormModel.status"
          clearable
          placeholder="请输入退费状态"
        >
          <el-option
            v-for="item in payConfigList.refundStatus"
            :key="item.code"
            :label="item.memo"
            :value="item.code"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="退款方式：">
        <el-select
          v-model="updateFormModel.submitType"
          clearable
          placeholder="请输入退款方式"
        >
          <el-option
            v-for="item in payConfigList.compensateWay"
            :key="item.code"
            :label="item.memo"
            :value="item.code"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="退费时间：">
        <el-date-picker
          v-model="updateFormModel.refundDate"
          type="datetime"
          placeholder="选择退费时间"
        />
      </el-form-item>
      <el-form-item label="OA申请ID：">
        <el-input
          v-model="updateFormModel.applyId"
          placeholder="请输入OA申请ID"
          clearable
        />
      </el-form-item>
      <el-form-item label="清算日期：">
        <el-date-picker
          v-model="updateFormModel.settleDate"
          placeholder="请选择清算日期"
          type="date"
        />
      </el-form-item>
      <el-form-item label="转账流水号：">
        <el-input
          v-model="updateFormModel.transferNo"
          placeholder="请输入转账流水号"
          clearable
        />
      </el-form-item>
      <el-form-item label="备注：">
        <el-input
          v-model="updateFormModel.memo"
          placeholder="请输入备注"
          clearable
        />
      </el-form-item>
    </el-form>
    <el-button
      slot="footer"
      type="primary"
      :loading="isConfirming"
      @click="handleUpdate"
    >
      提交
    </el-button>
  </v-dialog>
</template>

<script>
import { mapGetters } from "vuex";
import dialogFormMixin from "@/mixins/dialogFormMixin";

export default {
  mixins: [dialogFormMixin],
  props: {
    rowData: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    this.updateUrl = "/refund/update.json";

    return {
      isEditDisabled: true,
      updateFormModel: {
        batchNo: "",
        newBatchNo: "",
        accountNo: "",
        payWays: "",
        paidNo: "",
        payLogNo: "",
        refundNo: "",
        reason: "",
        platId: "",
        notifyUrl: "",
        amount: "",
        recvUserId: "",
        refundId: "",
        callbackStatus: "",
        status: "",
        submitType: "",
        refundDate: "",
        applyId: "",
        settleDate: "",
        transferNo: "",
        memo: "",
      },
    };
  },
  computed: {
    ...mapGetters({
      payConfigList: "payConfigList",
    }),
    isConfirming() {
      return this.$store.state.effectLoading[this.updateUrl];
    },
  },

  methods: {
    handleDialogOpen() {
      this.$fetch("/refund/details.json", {
        method: "post",
        data: {
          id: this.rowData.id,
          bizOrderNo: this.rowData.bizOrderNo,
        },
      }).then((res) => {
        if (res.code === 0) {
          this.updateFormModel = {
            ...res.data,
            amount: this.$common.moneyFormat(res.data.amount),
          };
        }
      });
    },

    handleUpdate() {
      this.$fetch(this.updateUrl, {
        method: "post",
        data: { ...this.updateFormModel },
      }).then((res) => {
        if (res.code === 0) {
          this.$message({
            type: "success",
            message: "更新成功",
          });

          this.$parent.$refs.formSubmit.handleSearch();
          this.$eventBus.$emit("dialog-visible", false);
        }
      });
    },
  },
};
</script>
<style scoped lang="less">
.dialogFormUpdate {
  .tip {
    margin-top: 6px;
    font-size: 12px;
    line-height: 1.5;
    color: #a9b5ca;
  }
}
</style>
