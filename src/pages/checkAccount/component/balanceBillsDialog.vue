<!--
 * @Author: 张淦
 * @Date: 2020-06-09 15:00:01
 * @LastEditors: zhanggan
 * @Description: 对账管理 - 医保对账 - 查看弹框
 * @FilePath: /gpay-ops-static/src/pages/checkAccount/component/balanceBillsDialog.vue
-->
<template>
  <v-dialog title="查看" dialog-id="balanceBills" @dialog-close="handleClose">
    <div class="sheet">
      <el-row>
        <el-col :span="8">
          <div class="grid-content grid-header">微医平台</div>
        </el-col>
        <el-col :span="8">
          <div class="grid-content grid-header">对比字段</div>
        </el-col>
        <el-col :span="8">
          <div class="grid-content grid-header grid-right">医保渠道</div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <div class="grid-content">
            {{ rowData.patientName || " " }}
          </div>
        </el-col>
        <el-col :span="8">
          <div class="grid-content grid-header">就诊人姓名</div>
        </el-col>
        <el-col :span="8">
          <div class="grid-content grid-right">
            {{ rowData.patientName || " " }}
          </div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <div class="grid-content">
            {{ TRANSACTION_TYPE_LIST[rowData.transactionType] || " " }}
          </div>
        </el-col>
        <el-col :span="8">
          <div class="grid-content grid-header">交易类型</div>
        </el-col>
        <el-col :span="8">
          <div class="grid-content grid-right">
            {{ TRANSACTION_TYPE_LIST[rowData.transactionType] || " " }}
          </div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <div class="grid-content">
            {{
              this.$common.moneyFormat(
                rowData.cashExpense + rowData.fundExpense
              ) || " "
            }}
          </div>
        </el-col>
        <el-col :span="8">
          <div class="grid-content grid-header">总费用支出</div>
        </el-col>
        <el-col :span="8">
          <div class="grid-content grid-right">
            {{
              this.$common.moneyFormat(
                rowData.miCenterCashExpense + rowData.miCenterFundExpense
              ) || " "
            }}
          </div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <div class="grid-content">
            {{ this.$common.moneyFormat(rowData.cashExpense) || " " }}
          </div>
        </el-col>
        <el-col :span="8">
          <div class="grid-content grid-header">个人现金支付</div>
        </el-col>
        <el-col :span="8">
          <div class="grid-content grid-right">
            {{ this.$common.moneyFormat(rowData.miCenterCashExpense) || " " }}
          </div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <div class="grid-content grid-bottom">
            {{ this.$common.moneyFormat(rowData.fundExpense) || " " }}
          </div>
        </el-col>
        <el-col :span="8">
          <div class="grid-content grid-header grid-bottom">医保支出</div>
        </el-col>
        <el-col :span="8">
          <div class="grid-content grid-right grid-bottom">
            {{ this.$common.moneyFormat(rowData.miCenterFundExpense) || " " }}
          </div>
        </el-col>
      </el-row>
    </div>
    <el-form
      v-show="!isBlacne"
      ref="dialogFormRef"
      label-width="120px"
      :model="formModel"
    >
      <el-form-item prop="accountResult" label="对账结果：">
        <el-select
          v-model="accountResult"
          placeholder="对账结果"
          filterable
          clearable
          :disabled="accountResult === 0"
          @change="changeResult"
        >
          <el-option
            v-for="(value, key) in ACCOUNT_RESULT_STATUS"
            :key="key"
            :label="value"
            :value="key"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="说明：" prop="resultInstructions">
        <el-input
          v-model="formModel.resultInstructions"
          type="textarea"
          :rows="3"
        />
      </el-form-item>
    </el-form>
    <template slot="footer">
      <span class="dialog-footer">
        <el-button v-show="!isBlacne" type="primary" @click="handleConfirm"
          >保存</el-button
        >
        <el-button type="primary opcity" @click="handleClose">关闭</el-button>
      </span>
    </template>
  </v-dialog>
</template>

<script>
import {
  ACCOUNT_RESULT_STATUS,
  TRANSACTION_TYPE_LIST,
} from "@/utils/constants";

export default {
  props: {
    rowData: {
      type: Object,
      default() {
        return {};
      },
    },
  },
  data() {
    this.ACCOUNT_RESULT_STATUS = ACCOUNT_RESULT_STATUS;
    this.TRANSACTION_TYPE_LIST = TRANSACTION_TYPE_LIST;
    return {
      isBlacne: true, // 是否配平
      fileList: [],
      accountResult: null,
      cacheResult: [],
      formModel: {
        id: null,
        accountResult: null,
        resultInstructions: null,
      },
    };
  },
  watch: {
    rowData(newVal) {
      if (newVal && typeof newVal === "object") {
        this.formModel.id = newVal.id;
        this.cacheResult = newVal.accountResult;
        this.accountResult =
          newVal.accountResult === 0 ? newVal.accountResult + "" : "9";
        this.isBlacne = newVal.accountResult === 0;
        this.formModel.resultInstructions = newVal.resultInstructions;
      }
    },
  },
  methods: {
    changeResult(res) {
      // 选择对账结果
      if (res !== "9") {
        this.cacheResult = 0;
      }
    },
    handleConfirm() {
      this.$refs.dialogFormRef.validate((valid) => {
        if (!valid) {
          return;
        }
        this.formModel.accountResult = this.cacheResult;
        this.$fetch("/medicalAccount/update.json", {
          method: "post",
          data: {
            ...this.formModel,
            accountChannel: 6,
          },
        }).then((res) => {
          if (res.code === 0) {
            this.$emit("dialogClose");
            this.handleClose();
          }
        });
      });
    },
    handleClose() {
      this.$eventBus.$emit("dialog-visible", false);
    },
  },
};
</script>
<style lang="less" scoped>
.sheet {
  margin-bottom: 20px;
  .grid-content {
    min-height: 42px;
    padding: 8px 0;
    font-size: 14px;
    color: #34384b;
    text-align: center;
    border-top: 1px solid #d5d9e3;
    border-left: 1px solid #d5d9e3;
  }
  .grid-header {
    background-color: #edf1fc;
  }
  .grid-right {
    border-right: 1px solid #d5d9e3;
  }
  .grid-bottom {
    border-bottom: 1px solid #d5d9e3;
  }
}
</style>
