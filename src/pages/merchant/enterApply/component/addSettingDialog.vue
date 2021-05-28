<template>
  <el-dialog
    :close-on-click-modal="false"
    :visible.sync="settingDialogVisible"
    :show-close="false"
  >
    <div slot="title">
      <span class="el-dialog__title">账号支付信息</span>
      <span class="sub-title">填入参数说明</span>
      <el-button type="text" @click="help()"> 帮助 >> </el-button>
    </div>
    <el-form
      ref="settingForm"
      :model="settingForm"
      :rules="rules"
      label-width="140px"
    >
      <el-form-item label="支付渠道：">
        {{ settingForm.payWayName ? settingForm.payWayName : "" }}
      </el-form-item>
      <el-form-item v-show="selectValue === 1" label="支付宝账号：">
        {{ settingForm.accountNo ? settingForm.accountNo : "" }}
      </el-form-item>
      <el-form-item v-show="selectValue === 2" label="健康账户商户号：">
        {{ settingForm.accountNo ? settingForm.accountNo : "" }}
      </el-form-item>
      <el-form-item
        v-show="selectValue === 3"
        label="微信商户号："
        prop="accountNo"
      >
        {{ settingForm.accountNo ? settingForm.accountNo : "" }}
      </el-form-item>
      <el-form-item
        v-show="selectValue != 1 && selectValue != 2 && selectValue != 3"
        label="支付账号："
      >
        {{ settingForm.accountNo ? settingForm.accountNo : "" }}
      </el-form-item>
      <el-form-item v-show="selectValue === 1" label="支付宝产品：">
        {{ settingForm.productName ? settingForm.productName : "" }}
      </el-form-item>
      <el-form-item v-show="selectValue === 2" label="健康账户产品：">
        {{ settingForm.productName ? settingForm.productName : "" }}
      </el-form-item>
      <el-form-item
        v-show="selectValue === 3"
        :disabled="true"
        label="微信产品："
      >
        {{ settingForm.productName ? settingForm.productName : "" }}
      </el-form-item>
      <el-form-item
        v-show="selectValue != 1 && selectValue != 2 && selectValue != 3"
        :disabled="true"
        label="支付产品："
        prop="productType"
      >
        {{ settingForm.productName ? settingForm.productName : "" }}
      </el-form-item>
      <template v-if="productType === 13">
        <el-form-item label="APPID：" prop="appId">
          <el-input
            v-model="settingForm.appId"
            placeholder="请输入APPID"
            clearable
            :disabled="editStyle"
          />
        </el-form-item>
        <el-form-item label="AES秘钥：" prop="signKey">
          <el-input
            v-model="settingForm.signKey"
            placeholder="请输入AES秘钥"
            clearable
            :disabled="editStyle"
          />
        </el-form-item>
        <el-form-item label="支付宝公钥：" prop="publicKey">
          <el-input
            v-model="settingForm.publicKey"
            placeholder="请输入支付宝公钥"
            clearable
            :disabled="editStyle"
          />
        </el-form-item>
        <el-form-item label="应用私钥：" prop="privateKey">
          <el-input
            v-model="settingForm.privateKey"
            placeholder="请输入应用私钥"
            clearable
            :disabled="editStyle"
          />
        </el-form-item>
      </template>
      <template v-if="productType === 11">
        <el-form-item label="PID：" prop="partnerId">
          <el-input
            v-model="settingForm.partnerId"
            placeholder="请输入合作伙伴(PID)"
            clearable
            :disabled="editStyle"
          />
        </el-form-item>
        <el-form-item label="APPID：" prop="appId">
          <el-input
            v-model="settingForm.appId"
            placeholder="请输入APPID"
            clearable
            :disabled="editStyle"
          />
        </el-form-item>
        <el-form-item label="MD5秘钥：" prop="signKey">
          <el-input
            v-model="settingForm.signKey"
            placeholder="请输入MD5秘钥"
            clearable
            :disabled="editStyle"
          />
        </el-form-item>
        <el-form-item label="支付宝公钥：" prop="publicKey">
          <el-input
            v-model="settingForm.publicKey"
            placeholder="请输入支付宝公钥"
            clearable
            :disabled="editStyle"
          />
        </el-form-item>
        <el-form-item label="应用私钥：" prop="privateKey">
          <el-input
            v-model="settingForm.privateKey"
            placeholder="请输入应用私钥"
            clearable
            :disabled="editStyle"
          />
        </el-form-item>
      </template>
      <template v-if="productType === 14">
        <el-form-item label="PID：" prop="partnerId">
          <el-input
            v-model="settingForm.partnerId"
            placeholder="请输入合作伙伴(PID)"
            clearable
            :disabled="editStyle"
          />
        </el-form-item>
        <el-form-item label="APPID：" prop="appId">
          <el-input
            v-model="settingForm.appId"
            placeholder="请输入APPID"
            clearable
            :disabled="editStyle"
          />
        </el-form-item>
        <el-form-item label="MD5秘钥：" prop="signKey">
          <el-input
            v-model="settingForm.signKey"
            placeholder="请输入AES秘钥"
            clearable
            :disabled="editStyle"
          />
        </el-form-item>
        <el-form-item label="支付宝公钥：" prop="publicKey">
          <el-input
            v-model="settingForm.publicKey"
            placeholder="请输入支付宝公钥"
            clearable
            :disabled="editStyle"
          />
        </el-form-item>
        <el-form-item label="应用私钥：" prop="privateKey">
          <el-input
            v-model="settingForm.privateKey"
            placeholder="请输入应用私钥"
            clearable
            :disabled="editStyle"
          />
        </el-form-item>
      </template>
      <template v-if="productType === 15">
        <el-form-item label="PID：" prop="partnerId">
          <el-input
            v-model="settingForm.partnerId"
            placeholder="请输入合作伙伴(PID)"
            clearable
            :disabled="editStyle"
          />
        </el-form-item>
        <el-form-item label="APPID：" prop="appId">
          <el-input
            v-model="settingForm.appId"
            placeholder="请输入APPID"
            clearable
            :disabled="editStyle"
          />
        </el-form-item>
        <el-form-item label="MD5秘钥：" prop="signKey">
          <el-input
            v-model="settingForm.signKey"
            placeholder="请输入MD5秘钥"
            clearable
            :disabled="editStyle"
          />
        </el-form-item>
        <el-form-item label="支付宝公钥：" prop="publicKey">
          <el-input
            v-model="settingForm.publicKey"
            placeholder="请输入支付宝公钥"
            clearable
            :disabled="editStyle"
          />
        </el-form-item>
        <el-form-item label="应用私钥：" prop="privateKey">
          <el-input
            v-model="settingForm.privateKey"
            placeholder="请输入应用私钥"
            clearable
            :disabled="editStyle"
          />
        </el-form-item>
      </template>
      <template v-if="productType === 16">
        <el-form-item label="API秘钥：" prop="signKey">
          <el-input
            v-model="settingForm.signKey"
            placeholder="请输入API秘钥"
            clearable
            :disabled="editStyle"
          />
        </el-form-item>
        <el-form-item label="公钥：" prop="publicKey">
          <el-input
            v-model="settingForm.publicKey"
            placeholder="请输入公钥"
            clearable
            :disabled="editStyle"
          />
        </el-form-item>
        <el-form-item label="私钥：" prop="privateKey">
          <el-input
            v-model="settingForm.privateKey"
            placeholder="请输入私钥"
            clearable
            :disabled="editStyle"
          />
        </el-form-item>
        <el-form-item label="证书：" prop="accountCertification">
          <el-upload
            ref="upload"
            class="upload-demo"
            :action="actionUrl"
            with-credentials
            :limit="1"
            :before-upload="beforeAvatarUpload"
            :on-success="uploadSuccess"
            :on-remove="handleRemove"
          >
            <el-button type="primary">
              <i class="vit-icon vit-icon-upload vit-icon-small"
                >上传.p12文件</i
              >
            </el-button>
          </el-upload>
        </el-form-item>
      </template>
      <template v-if="productType === 17">
        <el-form-item label="API秘钥：" prop="signKey">
          <el-input
            v-model="settingForm.signKey"
            placeholder="请输入API秘钥"
            clearable
            :disabled="editStyle"
          />
        </el-form-item>
        <el-form-item label="公钥：" prop="publicKey">
          <el-input
            v-model="settingForm.publicKey"
            placeholder="请输入公钥"
            clearable
            :disabled="editStyle"
          />
        </el-form-item>
        <el-form-item label="私钥：" prop="privateKey">
          <el-input
            v-model="settingForm.privateKey"
            placeholder="请输入私钥"
            clearable
            :disabled="editStyle"
          />
        </el-form-item>
        <el-form-item label="证书：" prop="accountCertification">
          <el-upload
            ref="upload"
            class="upload-demo"
            :action="actionUrl"
            with-credentials
            :limit="1"
            :before-upload="beforeAvatarUpload"
            :on-success="uploadSuccess"
            :on-remove="handleRemove"
          >
            <el-button type="primary">
              <i class="vit-icon vit-icon-upload vit-icon-small"
                >上传.p12文件</i
              >
            </el-button>
          </el-upload>
        </el-form-item>
      </template>
      <template v-if="productType === 4">
        <el-form-item label="API秘钥：" prop="privateKey">
          <el-input
            v-model="settingForm.privateKey"
            placeholder="请输入API秘钥"
            clearable
            :disabled="editStyle"
          />
        </el-form-item>
        <el-form-item label="APPID：" prop="appId">
          <el-input
            v-model="settingForm.appId"
            placeholder="请输入APPID"
            clearable
            :disabled="editStyle"
          />
        </el-form-item>
        <el-form-item label="商户证书：" prop="accountCertification">
          <el-upload
            ref="upload"
            class="upload-demo"
            :action="actionUrl"
            with-credentials
            :limit="1"
            :before-upload="beforeAvatarUpload"
            :on-success="uploadSuccess"
            :on-remove="handleRemove"
          >
            <el-button type="primary">
              <i class="vit-icon vit-icon-upload vit-icon-small"
                >上传.p12文件</i
              >
            </el-button>
          </el-upload>
        </el-form-item>
        <el-form-item label="授权url：" prop="authURL">
          <el-input
            v-model="settingForm.authURL"
            placeholder="请输入授权url"
            clearable
            :disabled="editStyle"
          />
        </el-form-item>
      </template>
      <template v-if="productType === 5">
        <el-form-item label="API秘钥：" prop="privateKey">
          <el-input
            v-model="settingForm.privateKey"
            placeholder="请输入API秘钥"
            clearable
            :disabled="editStyle"
          />
        </el-form-item>
        <el-form-item label="APPID：" prop="appId">
          <el-input
            v-model="settingForm.appId"
            placeholder="请输入APPID"
            clearable
            :disabled="editStyle"
          />
        </el-form-item>
        <el-form-item label="商户证书：" prop="accountCertification">
          <el-upload
            ref="upload"
            class="upload-demo"
            :action="actionUrl"
            with-credentials
            :limit="1"
            :before-upload="beforeAvatarUpload"
            :on-success="uploadSuccess"
            :on-remove="handleRemove"
          >
            <el-button type="primary">
              <i class="vit-icon vit-icon-upload vit-icon-small"
                >上传.p12文件</i
              >
            </el-button>
          </el-upload>
        </el-form-item>
        <el-form-item label="授权url：" prop="authURL">
          <el-input
            v-model="settingForm.authURL"
            placeholder="请输入授权url"
            clearable
            :disabled="editStyle"
          />
        </el-form-item>
      </template>
      <template v-if="productType === 2">
        <el-form-item label="公众号名称：" prop="partnerId">
          <el-input
            v-model="searchForm.partnerId"
            placeholder="请输入公众号名称"
            clearable
            maxlength="50"
          />
        </el-form-item>
        <el-form-item label="API秘钥：" prop="privateKey">
          <el-input
            v-model="searchForm.privateKey"
            placeholder="请输入API秘钥"
            clearable
            maxlength="50"
          />
        </el-form-item>
        <el-form-item label="APPID：" prop="appId">
          <el-input
            v-model="searchForm.appId"
            placeholder="请输入APPID"
            clearable
            maxlength="50"
          />
        </el-form-item>
        <el-form-item label="APPsecret：" prop="publicKey">
          <el-input
            v-model="searchForm.publicKey"
            placeholder="请输入APPsecret"
            clearable
            maxlength="50"
          />
        </el-form-item>
        <el-form-item label="商户证书：" prop="accountCertification">
          <el-upload
            ref="upload"
            class="upload-demo"
            :action="actionUrl"
            with-credentials
            :limit="1"
            :disabled="editAccount"
            :before-upload="beforeAvatarUpload"
            :on-success="uploadSuccess"
            :on-remove="handleRemove"
          >
            <el-button type="primary">
              <i class="vit-icon vit-icon-upload vit-icon-small"
                >上传.p12文件</i
              >
            </el-button>
          </el-upload>
        </el-form-item>
        <el-form-item label="授权url：" prop="authURL">
          <el-input
            v-model="searchForm.authURL"
            placeholder="请输入授权url"
            clearable
            maxlength="50"
          />
        </el-form-item>
      </template>
      <template v-if="productType === 6">
        <el-form-item label="API秘钥：" prop="privateKey">
          <el-input
            v-model="settingForm.privateKey"
            placeholder="请输入API秘钥"
            clearable
            :disabled="editStyle"
          />
        </el-form-item>
        <el-form-item label="APPID：" prop="appId">
          <el-input
            v-model="settingForm.appId"
            placeholder="请输入APPID"
            clearable
            :disabled="editStyle"
          />
        </el-form-item>
        <el-form-item label="小程序名称：" prop="partnerId">
          <el-input
            v-model="settingForm.partnerId"
            placeholder="请输入小程序名称"
            clearable
            :disabled="editStyle"
          />
        </el-form-item>
        <el-form-item label="APPSecrect：" prop="publicKey">
          <el-input
            v-model="settingForm.publicKey"
            placeholder="请输入APPSecrect"
            clearable
            :disabled="editStyle"
          />
        </el-form-item>
        <el-form-item label="商户证书：" prop="accountCertification">
          <el-upload
            ref="upload"
            class="upload-demo"
            :action="actionUrl"
            with-credentials
            :limit="1"
            :before-upload="beforeAvatarUpload"
            :on-success="uploadSuccess"
            :on-remove="handleRemove"
          >
            <el-button type="primary">
              <i class="vit-icon vit-icon-upload vit-icon-small"
                >上传.p12文件</i
              >
            </el-button>
          </el-upload>
        </el-form-item>
        <el-form-item label="授权url：" prop="authURL">
          <el-input
            v-model="settingForm.authURL"
            placeholder="请输入授权url"
            clearable
            :disabled="editStyle"
          />
        </el-form-item>
      </template>
      <template v-if="productType === 3">
        <el-form-item label="API秘钥：" prop="privateKey">
          <el-input
            v-model="settingForm.privateKey"
            placeholder="请输入API秘钥"
            clearable
            :disabled="editStyle"
            maxlength="50"
          />
        </el-form-item>
        <el-form-item label="APPID：" prop="appId">
          <el-input
            v-model="settingForm.appId"
            placeholder="请输入APPID"
            clearable
            :disabled="editStyle"
            maxlength="50"
          />
        </el-form-item>
        <el-form-item label="商户证书：" prop="accountCertification">
          <el-upload
            ref="upload"
            class="upload-demo"
            :action="actionUrl"
            with-credentials
            :limit="1"
            :before-upload="beforeAvatarUpload"
            :on-success="uploadSuccess"
            :on-remove="handleRemove"
          >
            <el-button type="primary">
              <i class="vit-icon vit-icon-upload vit-icon-small"
                >上传.p12文件</i
              >
            </el-button>
          </el-upload>
        </el-form-item>
        <el-form-item label="授权url：" prop="authURL">
          <el-input
            v-model="settingForm.authURL"
            placeholder="请输入授权url"
            clearable
            :disabled="editStyle"
            maxlength="50"
          />
        </el-form-item>
      </template>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="submitForm('settingForm')">
        保 存
      </el-button>
      <el-button @click="resetForm('settingForm')"> 取消 </el-button>
    </div>
  </el-dialog>
</template>

<script>
import { mapGetters } from "vuex";
import { UPLOAD_URL } from "@/utils/constants";

export default {
  props: {
    settingDialogVisible: {
      type: Boolean,
      default: false,
    },
    row: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    const validatorPartnerId = (rule, value, callback) => {
      if (
        !value &&
        (this.productType === 11 ||
          this.productType === 14 ||
          this.productType === 15 ||
          this.productType === 2 ||
          this.productType === 6)
      ) {
        return callback(new Error("该项为必填项！"));
      } else {
        callback();
      }
    };
    const validatorAppId = (rule, value, callback) => {
      if (
        !value &&
        (this.productType === 11 ||
          this.productType === 14 ||
          this.productType === 15 ||
          this.productType === 2 ||
          this.productType === 13 ||
          this.productType === 6 ||
          this.productType === 4 ||
          this.productType === 5 ||
          this.productType === 3)
      ) {
        return callback(new Error("该项为必填项！"));
      } else {
        callback();
      }
    };
    const validatorSignKey = (rule, value, callback) => {
      if (
        !value &&
        (this.productType === 11 ||
          this.productType === 14 ||
          this.productType === 15 ||
          this.productType === 16 ||
          this.productType === 17 ||
          this.productType === 13)
      ) {
        return callback(new Error("该项为必填项！"));
      } else {
        callback();
      }
    };
    const validatorPublicKey = (rule, value, callback) => {
      if (
        !value &&
        (this.productType === 11 ||
          this.productType === 14 ||
          this.productType === 15 ||
          this.productType === 2 ||
          this.productType === 16 ||
          this.productType === 17 ||
          this.productType === 13 ||
          this.productType === 6)
      ) {
        return callback(new Error("该项为必填项！"));
      } else {
        callback();
      }
    };
    const validatorPrivateKey = (rule, value, callback) => {
      if (
        !value &&
        (this.productType === 11 ||
          this.productType === 14 ||
          this.productType === 15 ||
          this.productType === 2 ||
          this.productType === 6 ||
          this.productType === 16 ||
          this.productType === 13 ||
          this.productType === 14 ||
          this.productType === 4 ||
          this.productType === 5 ||
          this.productType === 3)
      ) {
        return callback(new Error("该项为必填项！"));
      } else {
        callback();
      }
    };
    const validatorAccountCertification = (rule, value, callback) => {
      if (
        !value &&
        (this.productType === 16 ||
          this.productType === 17 ||
          this.productType === 5 ||
          this.productType === 2 ||
          this.productType === 6 ||
          this.productType === 4 ||
          this.productType === 3)
      ) {
        return callback(new Error("必须上传证书"));
      } else {
        callback();
      }
    };
    const validatorAuthURL = (rule, value, callback) => {
      if (
        !value &&
        (this.productType === 4 ||
          this.productType === 5 ||
          this.productType === 6 ||
          this.productType === 2 ||
          this.productType === 3)
      ) {
        return callback(new Error("授权url不能为空"));
      } else {
        callback();
      }
    };
    return {
      actionUrl: UPLOAD_URL,
      editStyle: false,
      productType: null,
      settingForm: {
        accountNo: "",
        appId: "", // 13,11,14,15,4,5,6,
        signKey: "", // 13,11,14,15,16,17,3,
        publicKey: "", // 13,11,14,15,16,17,3,6,
        privateKey: "", // 13,11,14,15,16,17,4,5,3,6,
        partnerId: "", // 11,14,15,3,6,
        accountCertification: "", // 16,17,4,5,3,6,2,3
        authURL: "", // 4,5,6,2,3
      },
      rules: {
        partnerId: [
          { required: true, trigger: "change", validator: validatorPartnerId },
        ],
        appId: [
          { required: true, trigger: "change", validator: validatorAppId },
        ],
        signKey: [
          { required: true, trigger: "change", validator: validatorSignKey },
        ],
        publicKey: [
          { required: true, trigger: "change", validator: validatorPublicKey },
        ],
        privateKey: [
          { required: true, trigger: "change", validator: validatorPrivateKey },
        ],
        accountCertification: [
          {
            required: true,
            trigger: "change",
            validator: validatorAccountCertification,
          },
        ],
        authURL: [
          { required: true, trigger: "change", validator: validatorAuthURL },
        ],
      },
      // 支付配置需求
      selectValue: 1,
    };
  },
  computed: {
    ...mapGetters({
      businessAdministration: "businessAdministration",
      merchantChannelList: "merchantChannelList",
      companyList: "companyList",
    }),
  },
  watch: {
    row: {
      handler(newValue) {
        this.productType = newValue.productType;
        this.selectValue = newValue.payWayId;
        this.editStyle = newValue.editStyle;
        this.settingForm = { ...newValue.accountPayInfoVO, ...newValue };
      },
    },
  },
  created() {},
  methods: {
    beforeAvatarUpload(file) {
      const isJPG = file.type === "application/x-pkcs12";

      if (!isJPG) {
        this.$message.error("上传证书只能是 p12 格式!");
      }
      return isJPG;
    },
    handleRemove(file, fileList) {
      this.settingForm.accountCertification = "";
    },
    uploadSuccess(res) {
      this.settingForm.accountCertification = res.data.url;
    },
    selectChange(val) {
      this.selectValue = val;
    },
    help() {
      window.location.href = "";
    },
    submitForm(formName) {
      const value = { ...this.settingForm };
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$emit("handleSettingAdd", value);
          this.resetForm(formName);
        } else {
          this.$message({
            type: "error",
            message: "提交失败请检查!",
          });
          return false;
        }
      });
    },
    resetForm(formName) {
      this.handleRemove();
      this.$refs[formName].resetFields();
      this.$parent.closeDialog();
    },
  },
};
</script>
<style scoped>
.sub-title {
  font-size: 12px;
  color: #a9b5ca;
}
.tips {
  float: right;
  color: #f35e5e;
}
</style>
