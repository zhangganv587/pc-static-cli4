<!--
 * @Author: 张淦
 * @Date: 2020-04-28 18:29:46
 * @LastEditors: zhanggan
 * @Description: 渠道管理 - 收款账号管理 - 微信产品管理 - 微信产品弹框
 * @FilePath: /gpay-ops-static/src/pages/merchant/channelManage/component/wechatProductDialog.vue
 -->
<template>
  <v-dialog
    title="微信产品"
    dialog-id="wechatProduct"
    :is-edit-disabled="isEditDisabled"
    :is-confirming="isConfirming"
    @dialog-confirm="handleSubmitForm"
    @dialog-close="handleResetForm"
    @dialog-editable="handleEditable"
  >
    <el-form
      ref="dialogFormRef"
      label-width="140px"
      :model="formModel"
      :rules="rules"
    >
      <el-form-item label="APPID：" prop="productId">
        <el-input
          v-model="formModel.productId"
          autocomplete="off"
          maxlength="30"
          placeholder="请输入APPID"
          :disabled="isEditDisabled"
          @blur="inputBlur"
        />
      </el-form-item>
      <el-form-item label="名称：" prop="name">
        <el-input
          v-model="formModel.name"
          placeholder="请输入名称"
          clearable
          maxlength="20"
          :disabled="isEditDisabled"
        />
      </el-form-item>
      <el-form-item label="产品类型：" prop="productType">
        <el-select
          v-model="formModel.productType"
          filterable
          placeholder="请输入产品类型"
          :disabled="isEditDisabled"
        >
          <el-option
            v-for="(product, index) in productTypeArr"
            :key="`product${index}`"
            :label="product.label"
            :value="product.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item prop="accountNo" label="绑定收款账号：">
        <el-select
          v-model="formModel.accountNo"
          placeholder="绑定收款账号"
          :disabled="isEditDisabled"
          filterable
          clearable
        >
          <el-option
            v-for="(collection, key) in collectionAccountList"
            :key="`collection${key}`"
            :label="collection.accountNo"
            :value="collection.accountNo"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="管理人：" prop="admin">
        <el-input
          v-model="formModel.admin"
          placeholder="请输入管理人"
          clearable
          maxlength="15"
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
      <el-form-item label="授权URL：" prop="url">
        <el-input
          v-model="formModel.url"
          placeholder="请输入授权URL"
          clearable
          maxlength="40"
          :disabled="isEditDisabled"
        />
      </el-form-item>
      <el-form-item label="appSecret：" prop="appSecret">
        <el-input
          v-model="formModel.appSecret"
          placeholder="请输入appSecret"
          clearable
          type="textarea"
          maxlength="50"
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
import { WX_PRODUCT_TYPE_ARR, MOBILE_REG } from "@/utils/constants";
import dialogFormMixin from "@/mixins/dialogFormMixin";

export default {
  mixins: [dialogFormMixin],
  data() {
    this.rules = {
      productId: [
        { required: true, message: "请输入APPID", trigger: ["blur", "change"] },
      ],
      name: [
        { required: true, message: "请输入名称", trigger: ["blur", "change"] },
      ],
      productType: [
        {
          required: true,
          message: "请输入产品类型",
          trigger: ["blur", "change"],
        },
      ],
      accountNo: [
        {
          required: true,
          message: "请输入绑定收款账号",
          trigger: ["blur", "change"],
        },
      ],
      url: [
        {
          required: true,
          message: "请输入授权URL",
          trigger: ["blur", "change"],
        },
      ],
      appSecret: [
        {
          required: true,
          message: "请输入appSecret",
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
        url: "/pay/config/creat.json",
        message: "新增",
      },
      {
        url: "/pay/config/modify.json",
        message: "编辑",
      },
    ];
    this.productTypeArr = WX_PRODUCT_TYPE_ARR;
    return {
      isEditDisabled: true,
      collectionAccountList: [],
      formModel: {
        id: null,
        productId: null,
        name: null,
        productType: null,
        accountNo: null,
        admin: null,
        phoneNo: null,
        url: null,
        appSecret: null,
      },
    };
  },
  computed: {
    ...mapGetters({
      companyList: "companyList",
    }),
  },
  watch: {
    rowData(newVal) {
      if (newVal && typeof newVal === "object") {
        Object.keys(this.formModel).forEach((key) => {
          this.formModel[key] = newVal[key] || null;
          this.cacheRow[key] = newVal[key] || null;
        });
      }

      this.handleEditable(!!this.formModel.id);

      this.$nextTick(() => {
        this.$refs.dialogFormRef.clearValidate();
      });
    },
  },
  mounted() {
    this.getCollectionAccountList();
  },
  methods: {
    // 获取收款账号
    getCollectionAccountList() {
      this.$fetch("/pay/account/accountList.json", {
        method: "post",
        data: {
          payWayCode: "wxpay",
        },
      })
        .then((res) => {
          if (res.code === 0) {
            this.collectionAccountList = res.data;
          }
        })
        .catch(() => {});
    },
    inputBlur(e) {
      this.formModel.productId = this.$common.trim(e.target.value);
    },
    handleSubmitForm(callback) {
      this.handleSubmit({
        fetchData: {
          ...this.formModel,
          payWayCode: "wxpay",
          payWayName: "微信支付",
        },
        callback,
      });
    },
  },
};
</script>
