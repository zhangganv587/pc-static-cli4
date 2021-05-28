<template>
  <el-form :model="searchForm" label-width="110px">
    <v-form-card
      title="WEB支付"
      :button="accountChannel.button"
      @handleEdit="handleEdit"
      @handleSave="handleSave"
    >
      <el-form-item label="API秘钥：" prop="signKey">
        <el-input
          v-model="searchForm.signKey"
          placeholder="请输入API秘钥"
          clearable
          maxlength="50"
          :disabled="editAccount"
        />
      </el-form-item>
      <el-form-item label="公钥：" prop="publicKey">
        <el-input
          v-model="searchForm.publicKey"
          placeholder="请输入公钥"
          clearable
          maxlength="50"
          :disabled="editAccount"
        />
      </el-form-item>
      <el-form-item label="私钥：" prop="privateKey">
        <el-input
          v-model="searchForm.privateKey"
          placeholder="请输入私钥"
          clearable
          maxlength="50"
          :disabled="editAccount"
        />
      </el-form-item>
      <el-form-item label="证书：" prop="accountCertification">
        <el-upload
          ref="upload"
          class="upload-demo"
          :action="actionUrl"
          :disabled="editAccount"
          with-credentials
          :limit="1"
          :before-upload="beforeAvatarUpload"
          :on-success="uploadSuccess"
          :on-remove="handleRemove"
        >
          <el-button type="primary">
            <vit-icon type="upload" size="small" class="el-icon-upload2">
              上传.p12文件
            </vit-icon>
          </el-button>
        </el-upload>
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
      editAccount: false, // 编辑状态
      actionUrl: UPLOAD_URL,
      searchForm: {
        id: "",
        productType: 17,
        signKey: "",
        publicKey: "",
        privateKey: "",
        accountCertification: "",
      },
    };
  },
  computed: {
    ...mapGetters({
      accountChannel: "accountChannel",
      paymentChannel: "paymentChannel",
    }),
  },
  watch: {
    accountChannel: {
      hander(res) {
        this.editAccount = res.edit;
        if (res.row.payVOList) {
          res.row.payVOList.forEach((element) => {
            if (element.productType === 17) {
              Object.keys(this.searchForm).forEach((key) => {
                this.searchForm[key] = element[key];
              });
            }
          });
        }
      },
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
              this.editAccount = true;
            }
          })
          .catch(() => {});
      }
    },
    handleEdit() {
      this.editAccount = false;
    },
  },
};
</script>
