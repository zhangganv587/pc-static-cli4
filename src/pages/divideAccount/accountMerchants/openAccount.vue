<template>
  <v-dialog
    title="开户"
    dialog-id="openAccount"
    confirm-text="确定"
    :is-confirming="isConfirming"
    @dialog-confirm="handleSubmitForm"
    @dialog-close="handleResetForm"
  >
    <el-form
      ref="dialogFormRef"
      label-width="120px"
      :model="formModel"
      :rules="rules"
    >
      <el-form-item prop="merchantNo">
        <el-input
          v-model="formModel.merchantNo"
          autocomplete="off"
          width="100"
          placeholder="平台商户号"
        />
      </el-form-item>
      <el-form-item prop="merchantName">
        <el-input
          v-model="formModel.merchantName"
          autocomplete="off"
          placeholder="商户名称"
        />
      </el-form-item>
      <el-form-item prop="contactsName">
        <el-input
          v-model="formModel.contactsName"
          autocomplete="off"
          placeholder="联系人姓名"
        />
      </el-form-item>
      <el-form-item prop="mobileNo">
        <el-input
          v-model="formModel.mobileNo"
          autocomplete="off"
          placeholder="手机号"
        />
      </el-form-item>
      <el-form-item prop="settlementChannel">
        <el-select
          v-model="formModel.settlementChannel"
          placeholder="开户渠道"
          clearable
        >
          <el-option
            v-for="channel in channelList"
            :key="channel.id"
            :label="channel.name"
            :value="channel.bankCode"
          />
        </el-select>
      </el-form-item>
      <el-form-item prop="parentMerchantNo">
        <el-select
          v-model="formModel.parentMerchantNo"
          placeholder="主账户"
          clearable
        >
          <el-option
            v-for="account in accountList"
            :key="account.id"
            :label="account.merchantName"
            :value="account.merchantNo"
          />
        </el-select>
      </el-form-item>
    </el-form>
  </v-dialog>
</template>

<script>
import dialogFormMixin from "@/mixins/dialogFormMixin";
import { MOBILE_REG } from "@/utils/constants";

export default {
  mixins: [dialogFormMixin],
  props: {
    accountList: {
      type: Array,
      default: () => [],
    },
    channelList: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    this.queryUrl = "/settlement/open.json";
    this.rules = {
      merchantNo: [
        { required: true, message: "平台账号不能为空", trigger: "blur" },
      ],
      merchantName: [
        { required: true, message: "商户名称不能为空", trigger: "blur" },
      ],
      contactsName: [
        { required: true, message: "联系人不能为空", trigger: "blur" },
      ],
      mobileNo: [
        { required: true, message: "手机号不能为空", trigger: "blur" },
        { pattern: MOBILE_REG, message: "手机号格式不正确", trigger: "blur" },
      ],
      settlementChannel: [
        { required: true, message: "请选择开户渠道", trigger: "change" },
      ],
      parentMerchantNo: [
        { required: true, message: "请选择主账户", trigger: "change" },
      ],
    };

    return {
      formModel: {
        merchantNo: "",
        merchantName: "",
        contactsName: "",
        mobileNo: "",
        parentMerchantNo: "",
        settlementChannel: "",
      },
    };
  },
  computed: {
    isConfirming() {
      return this.$store.state.effectLoading[this.queryUrl];
    },
  },
  methods: {
    handleSubmitForm(callback) {
      this.$refs.dialogFormRef.validate((valid) => {
        if (!valid) {
          return;
        }
        this.$fetch(this.queryUrl, {
          method: "post",
          data: { ...this.formModel },
        }).then((res) => {
          if (res.code === 0) {
            this.$message({
              type: "success",
              message: "开户成功!",
            });
            this.$parent.$refs.formSubmit.handleSearch();
            this.handleResetForm(callback);
          }
        });
      });
    },
  },
};
</script>
