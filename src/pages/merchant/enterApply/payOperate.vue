<!--
 * @Author: 张淦
 * @Date: 2019-11-28 11:12:48
 * @LastEditors: zhanggan
 * @Description: 商户2.0作废
 * @FilePath: /gpay-ops-static/src/pages/merchant/enterApply/payOperate.vue
 -->
<template>
  <div>
    <el-form
      ref="searchForm"
      :model="searchForm"
      label-width="178px"
      :rules="rules"
    >
      <el-form-item label="申请人：">
        {{ searchForm.creator ? searchForm.creator : "" }}
      </el-form-item>
      <v-form-card title="支付运营信息" sub-title="(无运营要求可不进行配置)">
        <el-form-item label="支付页面文案：" prop="copyWriting">
          <el-input
            v-model="searchForm.copyWriting"
            :disabled="editStyle"
            placeholder="请输入支付页面文案"
            type="textarea"
            :rows="3"
          />
          <p class="form-item-extra">支付页面运营文案</p>
        </el-form-item>
        <el-form-item label="支付完成页面跳转链接：" prop="paySuccessUrl">
          <el-input
            v-model="searchForm.paySuccessUrl"
            placeholder="https://www.guahao.com"
            :disabled="editStyle"
          />
          <p class="form-item-extra">支付成功页链接</p>
        </el-form-item>
        <el-form-item label="支付失败页面跳转链接：" prop="payFailUrl">
          <el-input
            v-model="searchForm.payFailUrl"
            placeholder="https://www.guahao.com"
            :disabled="editStyle"
          />
          <p class="form-item-extra">支付失败页链接</p>
        </el-form-item>
        <el-form-item label="支付取消跳转链接：" prop="payCancelUrl">
          <el-input
            v-model="searchForm.payCancelUrl"
            placeholder="https://www.guahao.com"
            :disabled="editStyle"
          />
          <p class="form-item-extra">支付取消跳转链接</p>
        </el-form-item>
        <el-form-item>
          <el-button @click="editStyle = false"> 编辑 </el-button>
          <el-button type="primary" @click="submitForm('searchForm')">
            保存
          </el-button>
        </el-form-item>
      </v-form-card>
    </el-form>
  </div>
</template>
<script>
import VFormCard from "@/components/form/v-form-card.vue";

export default {
  name: "PayOperate",
  components: {
    "v-form-card": VFormCard,
  },
  props: {
    details: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      editStyle: false,
      searchForm: {
        businessCode: "",
        copyWriting: "",
        paySuccessUrl: "",
        payFailUrl: "",
        payCancelUrl: "",
      },
      rules: {
        copyWriting: [
          { required: true, message: "支付页面文案不能为空", trigger: "blur" },
        ],
        paySuccessUrl: [
          {
            required: true,
            message: "支付成功跳转链接不能为空",
            trigger: "blur",
          },
        ],
        payFailUrl: [
          {
            required: true,
            message: "支付失败跳转链接不能为空",
            trigger: "blur",
          },
        ],
        payCancelUrl: [
          {
            required: true,
            message: "支付取消跳转链接不能为空",
            trigger: "blur",
          },
        ],
      },
    };
  },
  watch: {
    details: {
      handler(newValue) {
        if (newValue.copyWritingVO) {
          this.searchForm = newValue.copyWritingVO;
        }
        if (newValue.businessVO) {
          this.searchForm.businessCode = newValue.businessVO.businessCode;
          this.searchForm.creator = newValue.businessVO.creator;
        }
        if (newValue.copyWritingVO.id) {
          this.editStyle = true;
        }
      },
    },
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        console.log(this.searchForm);
        if (valid) {
          let url = "";
          let datalist = {};
          if (this.searchForm.id) {
            url = "/writing/modify.json";
            datalist = { ...this.searchForm };
          } else {
            url = "/writing/create.json";
            datalist = { ...this.searchForm };
          }
          this.$fetch(url, {
            method: "post",
            data: { ...datalist },
          })
            .then((res) => {
              if (res.code === 0) {
                this.$router.push({ path: "/merchant/list" });
              }
            })
            .catch(() => {
              this.loading = false;
            });
        } else {
          this.$message({
            type: "error",
            message: "提交失败请检查!",
          });
          return false;
        }
      });
    },
  },
};
</script>
