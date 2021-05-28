<!--
 * @Author: 张淦
 * @Date: 2020-04-29 15:49:34
 * @LastEditors: 张淦
 * @Description: 商户系统 - 渠道账号管理 - 支付宝收款账号管理 - 支付宝收款账号新增弹框
 * @FilePath: /gpay-ops-static/src/pages/merchant/channelManage/component/aliAccountDialog.vue
 -->
<template>
  <v-dialog
    title="支付宝收款账号"
    dialog-id="aliAccount"
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
      <el-form-item label="收款账号：" prop="accountNo">
        <el-input
          v-model="formModel.accountNo"
          autocomplete="off"
          maxlength="30"
          placeholder="请输入收款账号"
          :disabled="isEditDisabled"
          @blur="inputBlur"
        />
      </el-form-item>
      <el-form-item label="账号主体：" prop="companyCode">
        <el-select
          v-model="formModel.companyCode"
          filterable
          placeholder="请输入账号主体"
          :disabled="isEditDisabled"
          @change="handlerCompany"
        >
          <el-option
            v-for="(company, index) in merchantList"
            :key="`company${index}`"
            :label="company.dictText"
            :value="company.dictValue"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="开通产品：" prop="payWayCode">
        <el-checkbox-group
          v-model="checkList"
          :disabled="isEditDisabled"
          @change="handlerCheck"
        >
          <el-checkbox
            v-for="(code, index) in payWayCodeArr"
            :key="`code${index}`"
            :label="code.label"
            :value="code.value"
          />
        </el-checkbox-group>
      </el-form-item>
      <el-form-item label="是否通用：" prop="universal">
        <el-radio-group
          v-model="formModel.universal"
          :disabled="isEditDisabled"
        >
          <el-radio label="0"> 是 </el-radio>
          <el-radio label="1"> 否 </el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="管理人：" prop="admin">
        <el-input
          v-model="formModel.admin"
          maxlength="15"
          placeholder="请输入管理人"
          clearable
          :disabled="isEditDisabled"
        />
      </el-form-item>
      <el-form-item label="联系方式：" prop="phoneNo">
        <el-input
          v-model="formModel.phoneNo"
          placeholder="请输入联系方式"
          clearable
          maxlength="20"
          :disabled="isEditDisabled"
        />
      </el-form-item>
      <el-form-item label="绑定银行卡：" prop="bankCard">
        <el-input
          v-model="formModel.bankCard"
          placeholder="请输入绑定银行卡"
          clearable
          maxlength="25"
          :disabled="isEditDisabled"
        />
      </el-form-item>
      <el-form-item label="开户行：" prop="bank">
        <el-input
          v-model="formModel.bank"
          placeholder="请输入开户行"
          clearable
          maxlength="40"
          :disabled="isEditDisabled"
        />
      </el-form-item>
    </el-form>
  </v-dialog>
</template>

<script>
import { mapGetters } from "vuex";
import { ALI_PRODUCT_TYPE_ARR, MOBILE_REG } from "@/utils/constants";
import dialogFormMixin from "@/mixins/dialogFormMixin";

export default {
  mixins: [dialogFormMixin],
  data() {
    var codeValidator = (rule, value, callback) => {
      if (this.checkList.length > 0) {
        callback();
      } else {
        callback(new Error("请选择需要开通的产品"));
      }
    };
    this.rules = {
      accountNo: [
        {
          required: true,
          message: "请输入收款账号",
          trigger: ["blur", "change"],
        },
      ],
      companyCode: [
        {
          required: true,
          message: "请输入账号主体",
          trigger: ["blur", "change"],
        },
      ],
      payWayCode: [{ required: true, validator: codeValidator }],
      universal: [
        {
          required: true,
          message: "请选择是否通用",
          trigger: ["blur", "change"],
        },
      ],
      phoneNo: [
        {
          pattern: MOBILE_REG,
          message: "请输入正确的手机号",
          trigger: ["blur", "change"],
        },
      ],
    };
    this.submitFormArr = [
      {
        url: "/pay/account/creat.json",
        message: "新增",
      },
      {
        url: "/pay/account/modify.json",
        message: "编辑",
      },
    ];
    this.list = [
      // 手机网站
      {
        id: null,
        productType: 14,
        productName: "手机网站支付",
        isDeleted: 1,
      },
      // 电脑网站
      {
        id: null,
        accountNo: null,
        productType: 15,
        productName: "电脑网站支付",
        isDeleted: 1,
      },
      // APP
      {
        id: null,
        accountNo: null,
        productType: 13,
        productName: "APP支付",
        isDeleted: 1,
      },
      // 当面付
      {
        id: null,
        accountNo: null,
        productType: 11,
        productName: "当面付",
        isDeleted: 1,
      },
    ];
    this.payWayCodeArr = ALI_PRODUCT_TYPE_ARR;
    return {
      isEditDisabled: true,
      checkList: [],
      formModel: {
        id: null,
        accountNo: null,
        universal: null,
        companyCode: null,
        companyName: null,
        admin: null,
        phoneNo: null,
        bankCard: null,
        bank: null,
        list: null,
      },
    };
  },
  computed: {
    ...mapGetters({
      merchantList: "merchantList",
    }),
  },
  watch: {
    rowData(newVal) {
      this.checkList = [];
      if (newVal && typeof newVal === "object") {
        Object.keys(this.formModel).forEach((key) => {
          this.formModel[key] = newVal[key];
          this.cacheRow[key] = newVal[key];
        });
        this.formModel.universal = "1";
        if (newVal.id) {
          this.list = newVal.list;
          this.formModel.universal = newVal.universal;
        }
        if (newVal.list) {
          newVal.list.forEach((item) => {
            if (item.isDeleted === 0) {
              this.checkList.push(item.productName);
            }
          });
        }
      }
      this.handleEditable(!!this.formModel.id);

      this.$nextTick(() => {
        this.$refs.dialogFormRef.clearValidate();
      });
    },
  },
  methods: {
    handlerCompany(value) {
      this.merchantList.forEach((item) => {
        if (item.dictValue === value) {
          this.formModel.companyName = item.dictText;
        }
      });
    },
    handlerCheck(value) {
      this.list.forEach((item) => {
        const isTrue = value.some((element) => {
          return item.productName === element;
        });
        if (isTrue) {
          item.isDeleted = 0;
        } else {
          item.isDeleted = 1;
        }
      });
    },
    inputBlur(e) {
      this.formModel.accountNo = this.$common.trim(e.target.value);
    },
    handleSubmitForm(callback) {
      this.handleSubmit({
        fetchData: {
          ...this.formModel,
          list: this.list,
          payWayCode: "alipay",
        },
        callback,
      });
    },
  },
};
</script>
