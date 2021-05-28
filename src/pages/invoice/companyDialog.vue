<!--
 * @Author: 张淦
 * @Date: 2020-03-16 11:22:55
 * @LastEditors: zhanggan
 * @Description: 收银台PC端  开票企业新增弹窗
 * @FilePath: /gpay-ops-static/src/pages/invoice/companyDialog.vue
 -->
<template>
  <v-dialog
    title="人员信息"
    dialog-id="invoiceCompany"
    :is-edit-disabled="isEditDisabled"
    :is-confirming="isConfirming"
    @dialog-confirm="handleSubmitForm"
    @dialog-close="handleResetForm"
    @dialog-editable="handleEditable"
  >
    <el-form
      ref="dialogFormRef"
      label-width="120px"
      :model="formModel"
      :rules="rules"
    >
      <el-form-item label="企业名称：" prop="enterpriseName">
        <el-input
          v-model="formModel.enterpriseName"
          autocomplete="off"
          placeholder="请输入企业名称"
          :disabled="isEditNone"
          maxlength="40"
        />
      </el-form-item>
      <el-form-item label="公司税号：" prop="enterpriseTaxCode">
        <el-input
          v-model="formModel.enterpriseTaxCode"
          autocomplete="off"
          placeholder="请输入公司税号"
          maxlength="40"
          :disabled="isEditNone"
        />
      </el-form-item>
      <el-form-item label="开户银行：" prop="bank">
        <el-input
          v-model="formModel.bank"
          autocomplete="off"
          placeholder="请输入开户银行"
          maxlength="40"
          :disabled="isEditDisabled"
        />
      </el-form-item>
      <el-form-item label="银行账号：" prop="saleAccount">
        <el-input
          v-model="formModel.saleAccount"
          autocomplete="off"
          placeholder="请输入银行账号"
          maxlength="30"
          :disabled="isEditDisabled"
        />
      </el-form-item>
      <el-form-item label="地址：" prop="saleAddress">
        <el-input
          v-model="formModel.saleAddress"
          autocomplete="off"
          placeholder="请输入地址"
          maxlength="50"
          :disabled="isEditDisabled"
        />
      </el-form-item>
      <el-form-item label="电话：" prop="salePhone">
        <el-input
          v-model="formModel.salePhone"
          autocomplete="off"
          placeholder="请输入电话"
          maxlength="20"
          :disabled="isEditDisabled"
        />
      </el-form-item>
      <el-form-item label="收款人：" prop="payee">
        <el-input
          v-model="formModel.payee"
          autocomplete="off"
          placeholder="请输入收款人"
          maxlength="15"
          :disabled="isEditDisabled"
        />
      </el-form-item>
      <el-form-item label="复核人：" prop="reviewer">
        <el-input
          v-model="formModel.reviewer"
          autocomplete="off"
          placeholder="请输入复核人"
          maxlength="15"
          :disabled="isEditDisabled"
        />
      </el-form-item>
      <el-form-item label="开票人：" prop="issuer">
        <el-input
          v-model="formModel.issuer"
          autocomplete="off"
          placeholder="请输入开票人"
          maxlength="15"
          :disabled="isEditDisabled"
        />
      </el-form-item>
      <el-form-item label="开票方式：" prop="enterpriseType">
        <el-radio-group v-model="formModel.enterpriseType">
          <el-radio
            v-for="(value, key) in enterpriseStatus"
            :key="key"
            :label="key"
            :disabled="isEditDisabled"
          >
            {{ value }}
          </el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="开票状态：" prop="status">
        <el-radio-group v-model="formModel.status">
          <el-radio
            v-for="(value, key) in availableState"
            :key="key"
            :label="key"
            :disabled="isEditDisabled"
          >
            {{ value }}
          </el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>
  </v-dialog>
</template>

<script>
import dialogFormMixin from "@/mixins/dialogFormMixin";
import { AVAILABLE_STATE, ENTERPRISE_STATUS } from "@/utils/constants.js";

export default {
  mixins: [dialogFormMixin],
  data() {
    this.availableState = AVAILABLE_STATE;
    this.enterpriseStatus = ENTERPRISE_STATUS;
    this.rules = {
      enterpriseName: [
        {
          required: true,
          message: "请输入企业名字",
          trigger: ["blur", "change"],
        },
      ],
      enterpriseTaxCode: [
        {
          required: true,
          message: "请输入公司税号",
          trigger: ["blur", "change"],
        },
      ],
      bank: [
        {
          required: true,
          message: "请输入开户银行",
          trigger: ["blur", "change"],
        },
      ],
      saleAccount: [
        {
          required: true,
          message: "请输入银行账号",
          trigger: ["blur", "change"],
        },
      ],
      saleAddress: [
        { required: true, message: "请输入地址", trigger: ["blur", "change"] },
      ],
      salePhone: [
        { required: true, message: "请输入电话", trigger: ["blur", "change"] },
      ],
      payee: [
        {
          required: true,
          message: "请输入收款人",
          trigger: ["blur", "change"],
        },
      ],
      reviewer: [
        {
          required: true,
          message: "请输入复核人",
          trigger: ["blur", "change"],
        },
      ],
      issuer: [
        {
          required: true,
          message: "请输入开票人",
          trigger: ["blur", "change"],
        },
      ],
      enterpriseType: [
        {
          required: true,
          message: "选择开票方式",
          trigger: ["blur", "change"],
        },
      ],
      status: [
        {
          required: true,
          message: "选择开票状态",
          trigger: ["blur", "change"],
        },
      ],
    };
    this.submitFormArr = [
      {
        url: "/enterprise/insert.json",
        message: "新增开票企业",
      },
      {
        url: "/enterprise/modify.json",
        message: "编辑开票企业",
      },
    ];
    // 用于重置表单数据
    this.cacheRow = null;
    return {
      isEditNone: false,
      isEditDisabled: false,
      formModel: {
        id: null,
        enterpriseName: null,
        enterpriseTaxCode: null,
        bank: null,
        saleAccount: null,
        saleAddress: null,
        salePhone: null,
        payee: null,
        reviewer: null,
        issuer: null,
        status: null,
        modifier: null,
        gmtModified: null,
        enterpriseType: null,
      },
    };
  },
  watch: {
    rowData(newVal) {
      if (newVal && typeof newVal === "object") {
        Object.keys(this.formModel).forEach((key) => {
          this.formModel[key] = newVal[key] || "";
          this.cacheRow[key] = newVal[key] || "";
        });
      }
      this.isEditNone = !!this.formModel.id;
      this.handleEditable(!!this.formModel.id);
      this.$nextTick(() => {
        this.$refs.dialogFormRef.clearValidate();
      });
    },
  },
  methods: {
    handleSubmitForm(callback) {
      this.handleSubmit({
        fetchData: {
          ...this.formModel,
        },
        callback,
      });
    },
  },
};
</script>
