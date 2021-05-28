<template>
  <el-dialog
    :close-on-click-modal="false"
    :visible.sync="wxDialogVisible"
    :show-close="false"
    @close="resetForm('addForm')"
  >
    <div slot="title">
      <span class="el-dialog__title">微信添加应用</span>
      <span class="sub-title">微信产品说明</span>
      <el-button type="text" @click="help()"> 帮助 >> </el-button>
    </div>
    <el-form
      ref="addForm"
      :model="addWXForm"
      :rules="rules"
      class="addWXForm"
      label-width="140px"
    >
      <el-form-item label="支付渠道："> 微信 </el-form-item>
      <el-form-item label="微信商户号：" prop="accountNo">
        <el-input
          v-model="addWXForm.accountNo"
          placeholder="请输入微信商户号"
          clearable
        />
      </el-form-item>
      <el-form-item label="微信产品：" prop="productType">
        <el-select
          v-model="addWXForm.productType"
          filterable
          placeholder="请选择微信产品"
        >
          <el-option
            v-for="company in wxList"
            :key="company.id"
            :label="company.productName"
            :value="company.productType"
          />
        </el-select>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="submitWXForm('addForm')">
        保 存
      </el-button>
      <el-button @click="resetForm('addForm')"> 取消 </el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  props: {
    wxDialogVisible: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      wxList: [],
      addWXForm: {
        payWayName: "微信",
        payWayId: 3,
        accountNo: "",
        productType: "",
        productName: "",
      },
      rules: {
        accountNo: [
          { required: true, message: "账号不能为空", trigger: "change" },
        ],
        productType: [
          {
            required: true,
            message: "请至少选择一个支付产品",
            trigger: "change",
          },
        ],
      },
    };
  },
  watch: {},
  created() {
    this.getProductList();
  },
  mounted() {},
  methods: {
    help() {
      window.location.href = "";
    },
    getProductList() {
      this.$fetch("/scene/query.json", {
        method: "post",
        data: { pageSize: 999 },
      })
        .then((res) => {
          if (res.data.dataList) {
            res.data.dataList.forEach((element) => {
              if (element.payWayId === 3) {
                this.wxList.push(element);
              }
            });
          }
        })
        .catch(() => {
          this.loading = false;
        });
    },
    submitWXForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.wxList.forEach((item) => {
            if (item.productType === this.addWXForm.productType) {
              this.addWXForm = {
                ...this.addWXForm,
                productName: item.productName,
              };
            }
          });
          this.$emit("addWeChatApplication", this.addWXForm);
          this.$parent.closeDialog();
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
      this.$parent.closeDialog();
      this.$refs[formName].resetFields();
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
