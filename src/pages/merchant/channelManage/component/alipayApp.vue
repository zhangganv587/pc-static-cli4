<template>
  <el-form
    ref="searchForm"
    :model="searchForm"
    :rules="rules"
    label-width="110px"
  >
    <v-form-card
      title="APP支付配置"
      :button="accountChannel.button"
      @handleEdit="handleEdit"
      @handleSave="handleSave"
    >
      <el-form-item label="APPID：" prop="appId">
        <el-input
          v-model="searchForm.appId"
          placeholder="请输入APPID"
          clearable
          maxlength="50"
          :disabled="editAccount"
        />
      </el-form-item>
      <el-form-item label="AES秘钥：" prop="signKey">
        <el-input
          v-model="searchForm.signKey"
          placeholder="请输入AES秘钥"
          clearable
          maxlength="50"
          :disabled="editAccount"
        />
      </el-form-item>
      <el-form-item label="支付宝公钥：" prop="publicKey">
        <el-input
          v-model="searchForm.publicKey"
          placeholder="请输入支付宝公钥"
          clearable
          maxlength="50"
          :disabled="editAccount"
        />
      </el-form-item>
      <el-form-item label="应用私钥：" prop="privateKey">
        <el-input
          v-model="searchForm.privateKey"
          placeholder="请输入应用私钥"
          clearable
          maxlength="50"
          :disabled="editAccount"
        />
      </el-form-item>
    </v-form-card>
  </el-form>
</template>

<script>
import { mapGetters } from "vuex";
import VFormCard from "@/components/form/v-form-card.vue";

export default {
  components: {
    VFormCard,
  },
  data() {
    return {
      editAccount: false, // 编辑状态
      searchForm: {
        id: "",
        productType: 13,
        appId: "",
        signKey: "",
        publicKey: "",
        privateKey: "",
      },
      rules: {
        appId: [
          { required: true, message: "APPID不能为空", trigger: "change" },
        ],
        signKey: [
          { required: true, message: "AES秘钥不能为空", trigger: "change" },
        ],
        publicKey: [
          { required: true, message: "支付宝公钥不能为空", trigger: "change" },
        ],
        privateKey: [
          { required: true, message: "应用私钥不能为空", trigger: "change" },
        ],
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
      handler(res) {
        this.editAccount = res.edit;
        if (res.row.payVOList) {
          res.row.payVOList.forEach((element) => {
            if (element.productType === 13) {
              Object.keys(this.searchForm).forEach((key) => {
                this.searchForm[key] = element[key];
              });
            }
          });
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
                  this.editAccount = true;
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
    handleEdit() {
      this.editAccount = false;
    },
  },
};
</script>
