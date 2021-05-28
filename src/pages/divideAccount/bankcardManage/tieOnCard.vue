<template>
  <v-dialog
    title="绑卡"
    dialog-id="tieOnCard"
    confirm-text="确定"
    :is-confirming="isConfirming"
    @dialog-confirm="handleSubmitForm"
    @dialog-close="handleResetForm"
  >
    <el-form ref="tieOnCardFormRef" label-width="120px" :model="tieOnCardForm">
      <el-form-item label="绑卡账户类型：" prop="cardAccntType">
        <el-radio-group v-model="tieOnCardForm.cardAccntType">
          <el-radio
            v-for="(value, key) in cardAccountType"
            :key="key"
            :label="key"
            :disabled="editStyle"
          >
            {{ value }}
          </el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item
        label="绑卡人姓名："
        prop="cardUserName"
        :rules="[
          { required: true, message: '请输入绑卡人姓名', trigger: 'blur' },
        ]"
      >
        <el-input
          v-model="tieOnCardForm.cardUserName"
          autocomplete="off"
          placeholder="请输入绑卡人姓名"
        />
      </el-form-item>
      <el-form-item
        label="手机号码："
        prop="mobileNo"
        :rules="[
          { required: true, message: '请输入手机号码', trigger: 'blur' },
          { pattern: mobileReg, message: '手机号格式不正确', trigger: 'blur' },
        ]"
      >
        <el-input
          v-model="tieOnCardForm.mobileNo"
          autocomplete="off"
          placeholder="请输入手机号码"
        />
      </el-form-item>
      <el-form-item
        label="证件号码："
        prop="certNo"
        :rules="[
          {
            required: tieOnCardForm.cardAccntType === '1',
            message: '请输入证件号码',
            trigger: 'blur',
          },
        ]"
      >
        <el-input
          v-model="tieOnCardForm.certNo"
          autocomplete="off"
          placeholder="请输入证件号码"
        />
      </el-form-item>
      <el-form-item
        label="银行卡类型："
        prop="cardType"
        :rules="[
          { required: true, message: '请选择银行卡类型', trigger: 'change' },
        ]"
      >
        <el-select
          v-model="tieOnCardForm.cardType"
          placeholder="请选择银行卡类型"
          clearable
        >
          <el-option
            v-for="(value, key) in bankCardType"
            :key="key"
            :label="value"
            :value="key"
          />
        </el-select>
      </el-form-item>
      <el-form-item
        label="银行卡名称："
        prop="bankNo"
        :rules="[
          { required: true, message: '请选择银行卡名称', trigger: 'blur' },
        ]"
      >
        <el-select
          v-model="tieOnCardForm.bankNo"
          placeholder="请选择银行卡名称"
          clearable
        >
          <el-option
            v-for="bank in bankList"
            :key="bank.id"
            :label="bank.bankName"
            :value="bank.bankCode"
          />
        </el-select>
      </el-form-item>
      <el-form-item
        label="银行卡号："
        prop="bankCardNo"
        :rules="[
          { required: true, message: '请选择银行卡号', trigger: 'blur' },
        ]"
      >
        <el-input
          v-model="tieOnCardForm.bankCardNo"
          autocomplete="off"
          placeholder="请输入银行卡号"
        />
      </el-form-item>
      <el-form-item label="开户行省/市：" prop="bankArea">
        <el-cascader
          v-model="tieOnCardForm.bankArea"
          :style="{ width: '100%' }"
          :options="city"
          :props="{ value: 'label' }"
        />
      </el-form-item>
      <el-form-item label="开户支行：" prop="bankBranchName">
        <el-input
          v-model="tieOnCardForm.bankBranchName"
          autocomplete="off"
          placeholder="请输入开户支行"
        />
      </el-form-item>
      <el-form-item label="联行号：" prop="correspondentNo">
        <el-input
          v-model="tieOnCardForm.correspondentNo"
          autocomplete="off"
          placeholder="请输入联行号"
        />
      </el-form-item>
    </el-form>
  </v-dialog>
</template>

<script>
import { mapGetters } from "vuex";
import DICT from "@/assets/lib/city";
import {
  CARD_ACCOUNT_TYPE,
  BANK_CARD_TYPE,
  MOBILE_REG,
} from "@/utils/constants";

export default {
  props: {
    dialogInfo: {
      type: Object,
      default: () => ({
        merchantNo: "",
        settlementChannel: "",
      }),
    },
    row: {
      type: Object,
      default: () => ({
        cardAccntType: "1",
        bankBranchName: "",
        bankCardNo: "",
        bankArea: [],
        bankCity: "",
        bankProvince: "",
        cardType: "0",
        cardUserName: "",
        certNo: "",
        correspondentNo: "",
        merchantId: "",
        merchantNo: "",
        mobileNo: "",
        bankNo: "",
        bankName: "",
        settlementChannel: "",
      }),
    },
  },
  data() {
    this.cardAccountType = CARD_ACCOUNT_TYPE;
    this.bankCardType = BANK_CARD_TYPE;
    this.mobileReg = MOBILE_REG;
    this.city = DICT;
    this.queryUrl = "/subAccount/card.json";

    return {
      editStyle: false,
      tieOnCardForm: {
        cardAccntType: "1",
        bankBranchName: "",
        bankCardNo: "",
        bankArea: [],
        bankCity: "",
        bankProvince: "",
        cardType: "0",
        cardUserName: "",
        certNo: "",
        correspondentNo: "",
        merchantId: "",
        merchantNo: "",
        mobileNo: "",
        bankNo: "",
        bankName: "",
        settlementChannel: "",
      },
    };
  },
  computed: {
    ...mapGetters({
      bankList: "bankList",
    }),
    isConfirming() {
      return this.$store.state.effectLoading[this.queryUrl];
    },
  },
  watch: {
    dialogInfo(newVal) {
      this.tieOnCardForm = {
        ...this.tieOnCardForm,
        ...newVal,
      };
    },
    row(newVal) {
      if (newVal) {
        this.tieOnCardForm = {
          ...this.tieOnCardForm,
          ...newVal,
          cardAccntType: "0",
          cardType: newVal.cardType + "",
          bankArea: [newVal.bankProvince, newVal.bankCity],
        };
        this.editStyle = true;
      }
    },
  },
  methods: {
    handleSubmitForm(callback) {
      this.$refs.tieOnCardFormRef.validate((valid) => {
        if (valid) {
          const { bankArea, cardAccntType } = this.tieOnCardForm;

          if (Array.isArray(bankArea) && bankArea.length >= 2) {
            this.tieOnCardForm.bankProvince = bankArea[0];
            this.tieOnCardForm.bankCity = bankArea[1];
          }

          if (Array.isArray(this.bankList)) {
            this.bankList.some((item) => {
              if (this.tieOnCardForm.bankNo === item.bankCode) {
                this.tieOnCardForm.bankName = item.bankName;
                return true;
              }
              return false;
            });
          }

          this.$fetch(this.queryUrl, {
            method: "post",
            data: { ...this.tieOnCardForm },
          }).then((res) => {
            if (res.code === 0) {
              if (cardAccntType === "1") {
                this.$message({
                  type: "success",
                  message: "个人绑卡成功!",
                });

                this.$parent.$refs.formSubmit.handleSearch();
                this.handleResetForm(callback);
              } else {
                // 企业绑卡验证金额
                this.handleVerifyAmount(callback);
              }
            }
          });
        }
      });
    },

    handleResetForm(callback) {
      this.$refs.tieOnCardFormRef.resetFields();
      typeof callback === "function" && callback();
    },

    // 企业绑卡验证金额
    handleVerifyAmount(callback) {
      this.$message({
        type: "success",
        message: "申请成功!请等待验证金额到款!",
      });

      this.$parent.$refs.formSubmit.handleSearch();
      this.handleResetForm(callback);
    },
  },
};
</script>
