<template>
  <el-form
    ref="searchForm"
    :model="searchForm"
    :rules="rules"
    class="searchForm"
    label-width="140px"
  >
    <v-form-card
      title="账号信息"
      :button="accountChannel.button"
      @handleEdit="handleEdit"
      @handleSave="handleSave"
    >
      <el-row :gutter="20">
        <el-form-item prop="payWayId">
          <el-select
            v-model="searchForm.payWayId"
            filterable
            placeholder="支付渠道"
            :disabled="isEditDisabled"
            @change="selectChange"
          >
            <el-option
              v-for="channel in merchantChannelList"
              :key="channel.id"
              :label="channel.payWayName"
              :value="channel.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item prop="accountNo">
          <el-input
            v-model="searchForm.accountNo"
            clearable
            maxlength="50"
            :placeholder="accountNoDes[selectedChannelId].placeholder"
            :disabled="isEditDisabled"
          />
        </el-form-item>
        <el-form-item prop="ownerCompany">
          <!-- <el-col :span="14"> -->
          <el-select
            v-model="searchForm.ownerCompany"
            filterable
            placeholder="账户所属公司"
            :disabled="isEditDisabled"
          >
            <el-option
              v-for="company in companyList"
              :key="company.id"
              :label="company.name"
              :value="company.name"
            />
          </el-select>
          <!-- </el-col>
          <el-col :span="6">
            <el-button
              type="primary"
              @click="newlyDialogVisible=true"
            >
              新建账号所属公司
            </el-button>
          </el-col> -->
        </el-form-item>
        <el-form-item prop="businessCode">
          <el-select
            v-model="searchForm.businessCode"
            filterable
            placeholder="业务"
            :disabled="isEditDisabled"
          >
            <el-option
              v-for="business in businessAdministration"
              :key="business.id"
              :label="business.business"
              :value="business.businessCode"
            />
          </el-select>
        </el-form-item>
        <el-form-item prop="bankBranch">
          <el-input
            v-model="searchForm.bankBranch"
            placeholder="请输入银行名称"
            clearable
            :disabled="isEditDisabled"
          />
        </el-form-item>
        <el-form-item prop="bankCardAcno">
          <el-input
            v-model="searchForm.bankCardAcno"
            placeholder="请输入银行卡号后四位"
            clearable
            :disabled="isEditDisabled"
          />
        </el-form-item>
        <el-form-item prop="accountAdminName">
          <el-input
            v-model="searchForm.accountAdminName"
            placeholder="请输入管理员名称"
            clearable
            maxlength="10"
            :disabled="isEditDisabled"
          />
        </el-form-item>
        <el-form-item prop="accountAdminMail">
          <el-input
            v-model="searchForm.accountAdminMail"
            placeholder="请输入管理员邮箱"
            clearable
            maxlength="30"
            :disabled="isEditDisabled"
          />
        </el-form-item>
      </el-row>
    </v-form-card>
    <newly-build-busine
      :newly-dialog-visible="newlyDialogVisible"
      @sendMessage="getMessage"
    />
  </el-form>
</template>

<script>
import { mapGetters } from "vuex";
import VFormCard from "@/components/form/v-form-card.vue";
import newlyBuildBusine from "../../enterApply/component/newlyBuildBusine";

export default {
  components: {
    VFormCard,
    "newly-build-busine": newlyBuildBusine,
  },
  data() {
    this.rules = {
      payWayId: [
        { required: true, message: "请选择支付渠道", trigger: "change" },
      ],
      accountNo: [{ required: true, message: "请输入账号", trigger: "blur" }],
      ownerCompany: [
        { required: true, message: "请选择账号所属公司", trigger: "change" },
      ],
      businessCode: [
        { required: true, message: "请选择账号业务", trigger: "change" },
      ],
      accountAdminName: [
        { required: true, message: "请输入账号管理员", trigger: "blur" },
      ],
      accountAdminMail: [
        { required: true, message: "请输入管理员联系方式", trigger: "blur" },
        {
          type: "email",
          message: "请输入正确格式的管理员邮箱",
          trigger: "blur",
        },
      ],
    };

    this.submitFormArr = [
      {
        url: "/account/creat-s.json",
        message: "新增账号",
      },
      {
        url: "/account/modify-a.json",
        message: "修改信息",
      },
    ];

    this.accountNoDes = {
      1: {
        label: "支付宝账号：",
        placeholder: "支付宝账号",
      },
      2: {
        label: "健康账户商户号：",
        placeholder: "健康账户商户号",
      },
      3: {
        label: "微信商户号：",
        placeholder: "微信商户号",
      },
      other: {
        label: "支付账号：",
        placeholder: "支付账号",
      },
    };

    return {
      isEditDisabled: false, // 编辑状态
      searchForm: {
        id: "",
        payWayId: 1,
        accountNo: "",
        ownerCompany: "",
        businessCode: null,
        bankBranch: "",
        bankCardAcno: "",
        accountAdminName: "",
        accountAdminMail: "",
      },

      // 支付配置需求
      selectedChannelId: 1,

      // dialog
      newlyDialogVisible: false,
    };
  },
  computed: {
    ...mapGetters({
      businessAdministration: "businessAdministration",
      merchantChannelList: "merchantChannelList",
      companyList: "companyList",
      accountChannel: "accountChannel",
    }),
  },
  watch: {
    accountChannel: {
      immediate: true,
      handler(res) {
        this.isEditDisabled = res.edit;
        if (res.row) {
          Object.keys(this.searchForm).forEach((key) => {
            this.searchForm[key] = res.row[key];
          });
        }
      },
    },
  },
  methods: {
    selectChange(val) {
      this.selectedChannelId = [1, 2, 3].includes(val) ? val : "other";
    },
    getMessage(res) {
      this.searchForm.ownerCompany = res.merchantName;
      this.searchForm.merchantNo = res.merchantNo;
      this.companyList.push({ name: res.merchantName });
    },
    handleSave() {
      if (!this.isEditDisabled) {
        const currentData = this.searchForm.id
          ? this.submitFormArr[1]
          : this.submitFormArr[0];

        this.$refs.searchForm.validate((valid) => {
          if (valid) {
            this.$fetch(currentData.url, {
              method: "post",
              data: { ...this.searchForm },
            })
              .then((res) => {
                if (res.code === 0) {
                  this.isEditDisabled = true;
                  this.$store.commit("PAYMENT_CHANNEL", {
                    payWayId: this.selectedChannelId,
                    id: res.data.id,
                  });
                  this.$eventBus.$emit("handleSearch");
                  this.$message({
                    type: "success",
                    message: `${currentData.message}成功！`,
                  });
                }
              })
              .catch(() => {});
          }
        });
      }
    },
    handleEdit() {
      this.isEditDisabled = false;
    },
    resetForm() {
      this.$refs["searchForm"].resetFields();
      this.$nextTick(() => {
        this.$refs["searchForm"].clearValidate();
      });
    },
    closeDialog() {
      this.newlyDialogVisible = false;
    },
  },
};
</script>
