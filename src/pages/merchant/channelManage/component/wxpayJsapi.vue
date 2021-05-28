<template>
  <el-form
    ref="searchForm"
    :model="searchForm"
    :rules="rules"
    label-width="110px"
  >
    <el-form-item style="text-align: right">
      <el-button @click="addstyle = true"> 添加公众号 </el-button>
    </el-form-item>

    <v-form-card
      v-for="(item, index) in configureList"
      :key="`item${index}`"
      title="JSAPI配置"
      button="edit"
      :index="index"
      @handleEdit="handleEdit"
      @handleSave="handleSave"
    >
      <el-form-item label="公众号名称：">
        {{ item.partnerId }}
      </el-form-item>
      <el-form-item label="API秘钥：">
        {{ item.privateKey }}
      </el-form-item>
      <el-form-item label="APPID：">
        {{ item.appId }}
      </el-form-item>
      <el-form-item label="APPsecret：">
        {{ item.publicKey }}
      </el-form-item>
      <el-form-item label="商户证书：">
        {{ item.accountCertification }}
      </el-form-item>
      <el-form-item label="授权url：">
        {{ item.authURL }}
      </el-form-item>
    </v-form-card>

    <v-form-card
      v-if="addstyle"
      title="JSAPI配置"
      :button="accountChannel.button"
    >
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
            <i class="el-icon-upload2">上传.p12文件</i>
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
    </v-form-card>
  </el-form>
</template>

<script>
import { mapGetters } from "vuex";
import { UPLOAD_URL } from "@/utils/constants";
import VFormCard from "@/components/form/v-form-card.vue";

export default {
  components: {
    VFormCard,
  },
  data() {
    return {
      addstyle: false, // 添加状态
      editAccount: false, // 编辑状态
      actionUrl: UPLOAD_URL,
      configList: [],
      searchForm: {
        id: "",
        productType: 3,
        partnerId: "",
        privateKey: "",
        appId: "",
        publicKey: "",
        accountCertification: "",
        authURL: "",
      },
      rules: {
        partnerId: [
          { required: true, message: "公众号名称不能为空", trigger: "change" },
        ],
        privateKey: [
          { required: true, message: "API秘钥不能为空", trigger: "change" },
        ],
        appId: [
          { required: true, message: "APPID不能为空", trigger: "change" },
        ],
        publicKey: [
          { required: true, message: "APPsecret不能为空", trigger: "change" },
        ],
        accountCertification: [
          { required: true, message: "必须上传商户证书", trigger: "change" },
        ],
        authURL: [
          {
            required: true,
            message: "授权url不能为空不能为空",
            trigger: "change",
          },
        ],
      },
    };
  },
  computed: {
    ...mapGetters({
      accountChannel: "accountChannel",
      configureList: "configureList",
      paymentChannel: "paymentChannel",
    }),
  },
  watch: {
    accountChannel: {
      handler(res) {
        this.editAccount = res.edit;
        if (res.row.payVOList) {
          const payVOList = [];
          res.row.payVOList.forEach((element) => {
            if (element.productType === 2) {
              payVOList.push(element);
            }
          });
          this.$store.commit("CONFIGURE_LIST", payVOList);
        }
      },
      immediate: true,
      deep: true,
    },
    paymentChannel: {
      handler(newVal) {
        this.searchForm.accountId = newVal.id;
      },
      immediate: true,
      deep: true,
    },
  },
  created() {},
  mounted() {},
  methods: {
    beforeAvatarUpload(file) {
      const isJPG = file.type === "application/x-pkcs12";

      if (!isJPG) {
        this.$message.error("上传头像图片只能是 p12 格式!");
      }
      return isJPG;
    },
    handleRemove(file, fileList) {
      this.searchForm.accountCertification = "";
    },
    uploadSuccess(res) {
      this.searchForm.accountCertification = res.data.url;
    },
    handleSave() {
      if (!this.editAccount) {
        const editStyle = [
          {
            url: "/account/creat-a.json",
            message: "新增配置成功！",
          },
          {
            url: "/account/modify-s.json",
            message: "修改配置成功！",
          },
        ];
        let n = 0;
        if (this.searchForm.id) {
          n = 1;
        }
        this.$refs.searchForm.validate((valid) => {
          if (valid) {
            this.$fetch(editStyle[n].url, {
              method: "post",
              data: { ...this.searchForm },
            })
              .then((res) => {
                if (res.code === 0) {
                  this.$message({
                    type: "success",
                    message: editStyle[n].message,
                  });
                  this.$store.commit("CONFIGURE_LIST", [
                    ...this.configureList,
                    { ...this.searchForm },
                  ]);
                  this.$refs.upload.clearFiles();
                  this.$refs.searchForm.resetFields();
                  this.addstyle = false;
                }
              })
              .catch(() => {});
          } else {
            this.$message({
              type: "error",
              message: "提交失败请检查!",
            });
            return false;
          }
        });
      }
    },
    handleEdit(data) {
      this.searchForm = { ...this.configureList[data] };
      this.configList = this.configureList.splice(data, 1);
      this.addstyle = true;
      this.editAccount = false;
    },
  },
};
</script>
