<!--
 * @Author: 张淦
 * @Date: 2020-04-29 15:52:25
 * @LastEditors: 张淦
 * @Description: 商户系统 - 渠道账号管理 - 支付宝收款账号管理 - 老版WAP秘钥弹框
 * @FilePath: /gpay-ops-static/src/pages/merchant/channelManage/component/aliWapDialog.vue
 -->
<template>
  <v-dialog
    title="老版WAP秘钥"
    dialog-id="aliWap"
    @dialog-open="handleOpenForm"
    @dialog-confirm="handleSubmitForm"
    @dialog-close="handleResetForm"
  >
    <el-form
      ref="dialogFormRef"
      label-width="120px"
      :model="formModel"
      :rules="rules"
    >
      <el-form-item label="PID：" prop="productId">
        <el-input
          v-model="formModel.productId"
          autocomplete="off"
          maxlength="25"
          placeholder="请输入PID"
          :disabled="isEditDisabled"
        />
      </el-form-item>
      <el-form-item label="开发者公钥：" prop="publicKey">
        <el-input
          v-model="formModel.publicKey"
          placeholder="请输入开发者公钥"
          clearable
          type="textarea"
          maxlength="2000"
          show-word-limit
          :disabled="isEditDisabled"
          :rows="3"
        />
      </el-form-item>
      <el-form-item label="开发者私钥：" prop="privateKey">
        <el-input
          v-model="formModel.privateKey"
          placeholder="请输入开发者私钥"
          clearable
          type="textarea"
          maxlength="2000"
          show-word-limit
          :disabled="isEditDisabled"
          :rows="3"
        />
      </el-form-item>
      <el-form-item label="支付宝公钥：" prop="aliPublicKey">
        <el-input
          v-model="formModel.aliPublicKey"
          placeholder="请输入支付宝公钥"
          clearable
          type="textarea"
          maxlength="2000"
          show-word-limit
          :disabled="isEditDisabled"
          :rows="3"
        />
      </el-form-item>
      <el-form-item label="MD5秘钥：" prop="key">
        <el-input
          v-model="formModel.key"
          maxlength="50"
          placeholder="请输入MD5秘钥"
          clearable
          :disabled="isEditDisabled"
        />
      </el-form-item>
    </el-form>
  </v-dialog>
</template>

<script>
import dialogFormMixin from "@/mixins/dialogFormMixin";

export default {
  mixins: [dialogFormMixin],
  data() {
    this.rules = {
      productId: [
        { required: true, message: "请输入PID", trigger: ["blur", "change"] },
      ],
      privateKey: [
        {
          required: true,
          message: "请输入开发者私钥",
          trigger: ["blur", "change"],
        },
      ],
      aliPublicKey: [
        {
          required: true,
          message: "请输入支付宝公钥",
          trigger: ["blur", "change"],
        },
      ],
      key: [
        {
          required: true,
          message: "请输入MD5密钥",
          trigger: ["blur", "change"],
        },
      ],
    };
    this.submitFormArr = [
      {
        url: "/pay/config/creat.json",
        message: "新增wap支付秘钥",
      },
      {
        url: "/pay/config/modify.json",
        message: "修改wap支付秘钥",
      },
    ];
    return {
      isEditDisabled: false,
      accountNo: null,
      formModel: {
        productId: null,
        publicKey: null,
        privateKey: null,
        aliPublicKey: null,
        key: null,
      },
    };
  },
  watch: {
    rowData(newVal) {
      if (newVal && typeof newVal === "object") {
        this.accountNo = newVal.accountNo;
        this.$store.commit("ACCOUNT_NO", newVal.accountNo);
      }

      this.$nextTick(() => {
        this.$refs.dialogFormRef.clearValidate();
      });
    },
  },
  methods: {
    handleOpenForm() {
      this.handleSearch(this.$store.state.accountNo);
    },
    handleSearch(accountNo) {
      this.$fetch("/pay/config/query.json", {
        method: "post",
        data: {
          payWayCode: "alipay",
          productType: 22,
          accountNo,
        },
      }).then((res) => {
        if (res.code === 0) {
          if (res.data.dataList && res.data.dataList.length) {
            this.formModel = res.data.dataList[0];
          }
        }
      });
    },
    handleSubmitForm(callback) {
      this.handleSubmit({
        fetchData: {
          ...this.formModel,
          payWayCode: "alipay",
          productType: 22,
          accountNo: this.accountNo,
        },
        callback,
      });
    },
  },
};
</script>
