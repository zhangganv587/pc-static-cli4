<!--
 * @Author: 张淦
 * @Date: 2020-04-28 17:19:08
 * @LastEditors: zhanggan
 * @Description: 商户系统 - 渠道账号管理 - 微信收款账号管理 - 微信收款账号新增弹框
 * @FilePath: /gpay-ops-static/src/pages/merchant/channelManage/component/wechatAccountDialog.vue
 -->
<template>
  <v-dialog
    title="微信收款账号"
    dialog-id="wechatAccount"
    :is-edit-disabled="isEditDisabled"
    :is-confirming="isConfirming"
    @dialog-confirm="handleSubmitForm"
    @dialog-close="handleReset"
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
      <el-form-item label="API秘钥：" prop="apiKey">
        <el-input
          v-model="formModel.apiKey"
          placeholder="请输入API秘钥"
          clearable
          type="textarea"
          maxlength="50"
          show-word-limit
          :disabled="isEditDisabled"
          :rows="3"
        />
      </el-form-item>
      <el-form-item label="证书：" prop="certificate">
        <div v-show="isEditDisabled">
          {{ formModel.certificate }}
        </div>
        <div v-show="!isEditDisabled">
          <el-upload
            ref="upload"
            class="upload-demo"
            :action="actionUrl"
            with-credentials
            :limit="1"
            :file-list="fileList"
            :before-upload="beforeAvatarUpload"
            :on-success="uploadSuccess"
            :on-remove="handleRemove"
            :disabled="isEditDisabled"
          >
            <el-button size="small" type="primary">
              <i class="el-icon-upload2">上传.p12文件</i>
            </el-button>
          </el-upload>
        </div>
      </el-form-item>
    </el-form>
  </v-dialog>
</template>

<script>
import { mapGetters } from "vuex";
import { UPLOAD_URL, WX_PAY_WAY_CODE_ARR, MOBILE_REG } from "@/utils/constants";
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
      payWayCode: [
        {
          required: true,
          validator: codeValidator,
          message: "请选择需要开通的产品",
        },
      ],
      universal: [
        {
          required: true,
          message: "请选择是否通用",
          trigger: ["blur", "change"],
        },
      ],
      apiKey: [
        {
          required: true,
          message: "请输入API秘钥",
          trigger: ["blur", "change"],
        },
      ],
      certificate: [
        { required: true, message: "请上传证书", trigger: ["blur", "change"] },
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
      // h5
      {
        id: null,
        productType: 5,
        productName: "H5支付",
        isDeleted: 1,
      },
      // jsapi
      {
        id: null,
        productType: 2,
        productName: "JSAPI支付",
        isDeleted: 1,
      },
      // native
      {
        id: null,
        productType: 3,
        productName: "Native支付",
        isDeleted: 1,
      },
      // 小程序
      {
        id: null,
        productType: 6,
        productName: "小程序支付",
        isDeleted: 1,
      },
      // app
      {
        id: null,
        productType: 4,
        productName: "APP支付",
        isDeleted: 1,
      },
    ];
    this.payWayCodeArr = WX_PAY_WAY_CODE_ARR;
    return {
      isEditDisabled: true,
      actionUrl: UPLOAD_URL,
      checkList: [],
      fileList: [],
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
        apiKey: null,
        certificate: null,
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
          this.formModel[key] = newVal[key] || null;
          this.cacheRow[key] = newVal[key] || null;
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
    beforeAvatarUpload(file) {
      const isJPG = file.type === "application/x-pkcs12";
      const isLt5M = file.size / 1024 / 1024 < 5;

      if (!isJPG) {
        this.$message.error("上传证书只能是 p12 格式!");
      }
      if (!isLt5M) {
        this.$message.error("文件最大 5M!");
      }
      return isJPG && isLt5M;
    },
    handleRemove(file, fileList) {
      this.formModel.certificate = "";
    },
    uploadSuccess(res) {
      this.formModel.certificate = res.data.url;
      this.$refs.dialogFormRef.validateField("certificate");
    },
    inputBlur(e) {
      this.formModel.accountNo = this.$common.trim(e.target.value);
    },
    handleSubmitForm(callback) {
      console.log(this.list);
      this.handleSubmit({
        fetchData: {
          ...this.formModel,
          list: this.list,
          payWayCode: "wxpay",
          payWayName: "微信支付",
        },
        callback,
      });
    },
    handleReset(callback) {
      this.fileList = [];
      this.handleResetForm(callback);
    },
  },
};
</script>
