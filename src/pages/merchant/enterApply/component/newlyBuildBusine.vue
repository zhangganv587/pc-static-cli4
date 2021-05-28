<template>
  <el-dialog
    title="新建签约公司"
    :visible.sync="newlyDialogVisible"
    append-to-body
    @close="resetForm('searchForm')"
  >
    <el-form
      ref="searchForm"
      :model="searchForm"
      :rules="rules"
      label-width="120px"
    >
      <el-form-item label="公司名称：" prop="merchantName">
        <el-input
          v-model="searchForm.merchantName"
          autocomplete="off"
          width="100"
          placeholder="请输入公司名称"
        />
      </el-form-item>
      <el-form-item label="商户号：">
        {{ searchForm.merchantNo }}
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="resetForm('searchForm')"> 取消 </el-button>
      <el-button type="primary" @click="submitForm('searchForm')">
        确定
      </el-button>
    </div>
  </el-dialog>
</template>

<script>
import axios from "axios";
export default {
  props: {
    newlyDialogVisible: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      cancel: null,
      searchForm: {
        merchantNo: "",
        merchantName: "",
      },
      rules: {
        merchantName: [
          { required: true, message: "公司名称不能为空", trigger: "change" },
        ],
      },
    };
  },
  watch: {
    "searchForm.merchantName": {
      handler(val) {
        if (this.timer) {
          clearTimeout(this.timer);
        }
        if (val) {
          this.timer = setTimeout(() => {
            this.remoteSearch();
          }, 500);
        }
      },
    },
  },
  methods: {
    // 监听输入框所触发的实时搜索组件用于向后端请求的方法
    remoteSearch() {
      // 如果存在上一次请求，则取消上一次请求
      if (this.cancel) {
        this.cancel();
      }

      // 定义CancelToken，它是axios的一个属性，且是一个构造函数
      const CancelToken = axios.CancelToken;

      // 使用axios的get方法获取请求结果，在请求时需要传入cancelToken参数，
      // 实例化一个CancelToken，实例化后会生成一个类似于id的请求令牌，将它赋值给全局的cancel变量。
      this.$fetch("/Index/generate.json", {
        method: "post",
        cancelToken: new CancelToken((c) => {
          this.cancel = c;
        }),
      }).then((res) => {
        // 将请求的结果赋值给personData全局变量，用于展示搜索结果
        if (res.code === 0) {
          this.searchForm.merchantNo = "SH" + res.data.num;
        }
      });
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$emit("sendMessage", this.searchForm);
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
      this.$parent.$parent.closeDialog();
      this.$refs[formName].resetFields();
    },
  },
};
</script>
