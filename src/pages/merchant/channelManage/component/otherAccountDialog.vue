<!--
 * @Author: 张淦
 * @Date: 2020-04-28 17:19:08
 * @LastEditors: 张淦
 * @Description: 商户系统 - 渠道账号管理 - 微信收款账号管理 - 微信收款账号新增弹框
 * @FilePath: /gpay-ops-static/src/pages/merchant/channelManage/component/otherAccountDialog.vue
 -->
<template>
  <v-dialog
    title="其他收款账号"
    dialog-id="otherAccount"
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
      <el-form-item label="支付渠道：" prop="payWayCode">
        <el-select
          v-model="formModel.payWayCode"
          clearable
          placeholder="支付渠道"
          :disabled="isEditDisabled"
        >
          <el-option
            v-for="channel in otherChannelList"
            :key="channel.id"
            :label="channel.payWayName"
            :value="channel.payWayCode"
          />
        </el-select>
      </el-form-item>
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
      <el-form-item label="开通产品：" prop="productType">
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
      <el-form-item label="APPID：" prop="productId">
        <el-input
          v-model="formModel.productId"
          placeholder="请输入APPID"
          clearable
          type="textarea"
          maxlength="30"
          show-word-limit
          :disabled="isEditDisabled"
          :rows="3"
          @blur="inputBlur"
        />
      </el-form-item>
      <el-form-item label="应用公钥：" prop="publicKey">
        <el-input
          v-model="formModel.publicKey"
          placeholder="请输入应用公钥"
          clearable
          type="textarea"
          maxlength="2000"
          show-word-limit
          :disabled="isEditDisabled"
          :rows="3"
        />
      </el-form-item>
      <el-form-item label="应用私钥：" prop="privateKey">
        <el-input
          v-model="formModel.privateKey"
          placeholder="请输入应用私钥"
          clearable
          type="textarea"
          maxlength="2000"
          show-word-limit
          :disabled="isEditDisabled"
          :rows="3"
        />
      </el-form-item>
      <el-form-item label="三方公钥：" prop="key">
        <el-input
          v-model="formModel.key"
          placeholder="请输入三方公钥"
          clearable
          type="textarea"
          maxlength="400"
          show-word-limit
          :disabled="isEditDisabled"
          :rows="3"
        />
      </el-form-item>
    </el-form>
  </v-dialog>
</template>

<script>
import { mapGetters } from "vuex";
import {
  ACCOUNT_CHANNEL_LIST,
  OTHER_PRODUCT_TYPE_ARR,
  MOBILE_REG,
} from "@/utils/constants";
import dialogFormMixin from "@/mixins/dialogFormMixin";

export default {
  mixins: [dialogFormMixin],
  data() {
    var typeValidator = (rule, value, callback) => {
      if (this.checkList.length > 0) {
        callback();
      } else {
        callback(new Error("请选择需要开通的产品"));
      }
    };
    this.rules = {
      payWayCode: [
        {
          required: true,
          message: "请输入收款账号",
          trigger: ["blur", "change"],
        },
      ],
      accountNo: [
        {
          required: true,
          message: "请输入收款账号",
          trigger: ["blur", "change"],
        },
      ],
      productType: [{ required: true, validator: typeValidator }],
      companyCode: [
        {
          required: true,
          message: "请输入账号主体",
          trigger: ["blur", "change"],
        },
      ],
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
        url: "/pay/other/creat.json",
        message: "新增",
      },
      {
        url: "/pay/other/modify.json",
        message: "编辑",
      },
    ];
    this.list = [
      // h5
      {
        id: null,
        productType: 16,
        productName: "手机网站支付",
        isDeleted: 1,
      },
      // jsapi
      {
        id: null,
        productType: 17,
        productName: "电脑网站支付",
        isDeleted: 1,
      },
    ];
    this.accountChannelList = ACCOUNT_CHANNEL_LIST;
    this.payWayCodeArr = OTHER_PRODUCT_TYPE_ARR;
    return {
      isEditDisabled: true,
      checkList: [],
      formModel: {
        id: null,
        accountNo: null,
        payWayCode: null,
        payWayName: null,
        companyCode: null,
        companyName: null,
        admin: null,
        phoneNo: null,
        bankCard: null,
        bank: null,
        productId: null,
        publicKey: null,
        privateKey: null,
        key: null,
        universal: null,
        merchantConfigVO: {
          id: null,
          productId: null,
          publicKey: null,
          privateKey: null,
          key: null,
        },
      },
    };
  },
  computed: {
    ...mapGetters({
      merchantList: "merchantList",
      otherChannelList: "otherChannelList",
    }),
  },
  watch: {
    rowData(newVal) {
      this.checkList = [];
      if (newVal && typeof newVal === "object") {
        Object.keys(this.formModel).forEach((key) => {
          this.formModel[key] = newVal[key] || null;
          this.cacheRow[key] = newVal[key] || null;
        });
        this.formModel.universal = "1";
        if (newVal.id) {
          this.formModel.universal = newVal.universal;
          this.formModel.merchantId = newVal.merchantConfigVO.id;
          this.formModel.productId = newVal.merchantConfigVO.productId;
          this.formModel.publicKey = newVal.merchantConfigVO.publicKey;
          this.formModel.privateKey = newVal.merchantConfigVO.privateKey;
          this.formModel.key = newVal.merchantConfigVO.key;
          this.list = newVal.list;
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
  mounted() {
    this.$common.judgeState({
      otherChannelList: "getOtherChannelList",
    });
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
    inputBlur() {
      this.formModel.accountNo = this.$common.trim(this.formModel.accountNo);
      this.formModel.productId = this.$common.trim(this.formModel.productId);
    },
    handleSubmitForm(callback) {
      let merchantConfig = null;
      if (
        this.formModel.merchantId ||
        this.formModel.productId ||
        this.formModel.publicKey ||
        this.formModel.privateKey ||
        this.formModel.key
      ) {
        merchantConfig = {
          id: this.formModel.merchantId,
          productId: this.formModel.productId,
          publicKey: this.formModel.publicKey,
          privateKey: this.formModel.privateKey,
          key: this.formModel.key,
        };
      }
      this.handleSubmit({
        fetchData: {
          ...this.formModel,
          list: this.list,
          merchantConfigVO: merchantConfig,
          creator: "zhanggan",
        },
        callback,
      });
    },
  },
};
</script>
