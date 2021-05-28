<!--
 * @Author: 张淦
 * @Date: 2020-06-09 15:00:01
 * @LastEditors: zhanggan
 * @Description: 对账管理 - 医保账单文件 - 上传医保账单文件弹框
 * @FilePath: /gpay-ops-static/src/pages/checkAccount/component/statementFileDialog.vue
-->
<template>
  <v-dialog
    title="上传医保账单文件"
    dialog-id="uploadStatementFile"
    @dialog-close="handleClose"
  >
    <el-form
      ref="dialogFormRef"
      label-width="120px"
      :model="formModel"
      :rules="rules"
    >
      <el-form-item label="机构名称：" prop="partnerName">
        <!-- <el-select
          v-model="formModel.partnerName"
          size="small"
          default-first-option
          filterable
          filter-keep
          placeholder="请选择机构名称"
        >
          <el-option
            v-for="item in channelList"
            :key="item.channelPartnerName"
            :label="item.channelPartnerName"
            :value="item.channelPartnerName"
          />
        </el-select> -->
        <el-autocomplete
          v-model="formModel.partnerName"
          popper-class="my-autocomplete"
          :fetch-suggestions="querySearch"
          placeholder="请输入机构名称"
          @select="handleSelect"
        >
          <template slot-scope="{ item }">
            {{ item.channelPartnerName }}
          </template>
        </el-autocomplete>
      </el-form-item>
      <el-form-item label="对账单日期：" prop="accountTime">
        <el-date-picker
          v-model="datePicker"
          type="date"
          placeholder="选择对账单日期"
          @change="datePickerChange"
        />
      </el-form-item>
      <el-form-item label="账单文件：" prop="filePath">
        <el-upload
          ref="upload"
          class="upload-demo"
          :action="actionUrl"
          with-credentials
          :file-list="fileList"
          :limit="1"
          :before-upload="beforeAvatarUpload"
          :on-success="uploadSuccess"
          :on-remove="handleRemove"
        >
          <span v-show="myChannel.suffix !== null"
            >请选择*.{{ myChannel.suffix }}格式的文件</span
          >
          <el-button type="primary"> 请选择 </el-button>

          <a
            :href="returnUrl"
            style="text-decoration: underline; margin-left: 6px"
            >下载医保对账单模板</a
          >
        </el-upload>
      </el-form-item>
      <el-form-item label="备注：" prop="remark">
        <el-input v-model="formModel.remark" type="textarea" :rows="3" />
      </el-form-item>
    </el-form>
    <template slot="footer">
      <span class="dialog-footer">
        <el-button type="primary" @click="handleConfirm">上传</el-button>
        <el-button type="primary opcity" @click="handleClose">关闭</el-button>
      </span>
    </template>
  </v-dialog>
</template>

<script>
import { UPLOAD_URL } from "@/utils/constants";

export default {
  data() {
    this.rules = {
      partnerName: [
        {
          required: true,
          message: "请输入机构名称",
          trigger: ["change", "blur"],
        },
      ],
      accountTime: [
        {
          required: true,
          message: "请选择对账单日期",
          trigger: ["change", "blur"],
        },
      ],
      filePath: [
        {
          required: true,
          message: "请上传账单文件",
          trigger: ["change", "blur"],
        },
      ],
    };
    return {
      actionUrl: UPLOAD_URL,
      fileList: [],
      channelList: [],
      myChannel: {
        suffix: null,
      },
      datePicker: "",
      returnUrl: "www.baidu.com",
      formModel: {
        id: null,
        partnerName: null,
        accountTime: null,
        filePath: null,
      },
    };
  },
  mounted() {
    this.getChannelList();
  },
  methods: {
    getChannelList() {
      this.$fetch("/bill/search_channel.json", {
        method: "post",
      }).then((res) => {
        if (res.code === 0) {
          this.channelList = res.data;
        }
      });
    },
    querySearch(queryString, cb) {
      // 查询是否存在该机构
      var restaurants = this.channelList;
      var results = queryString
        ? restaurants.filter(this.createFilter(queryString))
        : restaurants;
      // 调用 callback 返回建议列表的数据
      cb(results);
    },
    createFilter(queryString) {
      return (restaurant) => {
        return (
          restaurant.channelPartnerName
            .toLowerCase()
            .indexOf(queryString.toLowerCase()) > -1
        );
      };
    },
    handleSelect(item) {
      // 选择已有的机构
      this.myChannel = item;
      this.formModel.partnerName = item.channelPartnerName;
    },
    datePickerChange(value) {
      this.formModel.accountTime = value ? new Date(value).getTime() : "";
    },
    beforeAvatarUpload(file) {
      const fileArr = file.name.split(".");
      this.myChannel.fileName = file.name;
      if (this.myChannel.suffix === null) {
        this.$message.error("请先输入机构名称!");
        return false;
      }
      if (
        fileArr.length >= 2 &&
        fileArr[fileArr.length - 1] === this.myChannel.suffix
      ) {
        return true;
      } else {
        this.$message.error("上传文件格式有误!");
        return false;
      }
    },
    handleRemove(file, fileList) {
      this.fileList = [];
      this.formModel.filePath = "";
    },
    uploadSuccess(res) {
      this.formModel.filePath = res.data.url;
    },
    handleConfirm() {
      this.$refs.dialogFormRef.validate((valid) => {
        if (!valid) {
          return;
        }
        this.$fetch("/bill/add.json", {
          method: "post",
          data: {
            ...this.formModel,
            ...this.myChannel,
            accountName: this.myChannel.channelAccountName,
            accountNo: this.myChannel.channelAccountNo,
            partnerName: this.myChannel.channelPartnerName,
            partnerNo: this.myChannel.channelPartnerNo,
            fileSuffix: this.myChannel.suffix,
            accountChannel: 6,
          },
        }).then((res) => {
          if (res.code === 0) {
            this.$parent.$refs.formSubmit.handleSearch();
            this.handleClose();
          }
        });
      });
    },
    handleClose() {
      this.handleRemove();
      this.$eventBus.$emit("dialog-visible", false);
    },
  },
};
</script>
<style lang="less" scoped>
.order-content {
  margin-bottom: 10px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
  color: #34384b;
  .content-title {
    display: inline-block;
    width: 120px;
    color: #8c9ab4;
  }
}
</style>
