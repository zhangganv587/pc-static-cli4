<template>
  <v-dialog
    title="渠道信息"
    dialog-id="channelDialog"
    :is-edit-disabled="isEditDisabled"
    :is-confirming="isConfirming"
    @dialog-confirm="handleSubmitForm"
    @dialog-open="handleDialogOpen"
    @dialog-close="handleResetForm"
    @dialog-editable="handleEditable"
  >
    <el-form
      ref="dialogFormRef"
      label-width="120px"
      :model="formModel"
      :rules="rules"
    >
      <el-form-item label="渠道名称：" prop="payWayName">
        <el-input
          v-model="formModel.payWayName"
          placeholder="请输入渠道名称"
          clearable
          maxlength="15"
          :disabled="isEditDisabled"
        />
      </el-form-item>
      <el-form-item label="渠道编码：" prop="payWayCode">
        <el-input
          v-model="formModel.payWayCode"
          placeholder="请输入渠道编码"
          maxlength="15"
          clearable
          :disabled="isEditDisabled"
        />
      </el-form-item>
      <el-form-item label="币种：" prop="currency">
        <el-select
          v-model="formModel.currency"
          placeholder="请选择币种"
          :disabled="isEditDisabled"
          filterable
          clearable
          @change="currencySelect"
        >
          <el-option
            v-for="currency in currencyList"
            :key="currency.id"
            :label="currency.dictText"
            :value="currency.dictValue"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="渠道汇率：" prop="rate">
        <el-input
          v-model="formModel.rate"
          maxlength="6"
          placeholder="请输入渠道汇率"
          clearable
          :disabled="isEditDisabled"
        />
      </el-form-item>
      <el-form-item label="渠道运营文案：" prop="copy">
        <el-input
          v-model="formModel.copy"
          placeholder="请输入渠道运营文案"
          clearable
          maxlength="20"
          :disabled="isEditDisabled"
        />
      </el-form-item>
      <el-form-item label="渠道图标：" prop="icon">
        <el-row>
          <el-col :span="6">
            <v-form-upload
              :action="actionUrl"
              :disabled="isEditDisabled"
              :file-list="formModel.icon"
              :on-success="(...args) => handleUploadSuccess('icon')(...args)"
              :on-remove="(...args) => handleUploadRemove('icon')(...args)"
            />
          </el-col>
          <el-col :span="18">
            <p>
              请上传75*75像素的.png.jpg.jpeg格式的图片<br />图片大小不超过2M
            </p>
          </el-col>
        </el-row>
      </el-form-item>
      <el-form-item label="渠道标签：" prop="tag">
        <el-row>
          <el-col :span="6">
            <v-form-upload
              :action="actionUrl"
              :disabled="isEditDisabled"
              :file-list="formModel.tag"
              :on-success="(...args) => handleUploadSuccess('tag')(...args)"
              :on-remove="(...args) => handleUploadRemove('tag')(...args)"
            />
          </el-col>
          <el-col :span="18">
            <p>请上传.png.jpg.jpeg格式的图片<br />图片大小不超过1M</p>
          </el-col>
        </el-row>
      </el-form-item>
      <el-form-item label="备注：" prop="remark">
        <el-input
          v-model="formModel.remark"
          placeholder="请输入备注"
          clearable
          type="textarea"
          maxlength="150"
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
import { UPLOAD_URL } from "@/utils/constants";
import VFormUpload from "@/components/form/v-form-upload";
import dialogFormMixin from "@/mixins/dialogFormMixin";

export default {
  components: {
    VFormUpload,
  },
  mixins: [dialogFormMixin],
  data() {
    this.submitFormArr = [
      {
        url: "/pay/channel/creat.json",
        message: "新增渠道",
      },
      {
        url: "/pay/channel/modify.json",
        message: "修改渠道",
      },
    ];

    var rateValidator = (rule, value, callback) => {
      if (!value) {
        callback(new Error("渠道汇率不能为空！"));
      } else if (!/^\d{1,2}(\.\d{1,3})?$/.test(value)) {
        callback(new Error("渠道汇率的取值范围为0.001-99.999"));
      } else {
        callback();
      }
    };

    this.rules = {
      payWayName: [
        {
          required: true,
          message: "请输入渠道名称",
          trigger: ["blur", "change"],
        },
      ],
      payWayCode: [
        {
          required: true,
          message: "请输入渠道编号",
          trigger: ["blur", "change"],
        },
      ],
      currency: [
        { required: true, message: "请输入币种", trigger: ["blur", "change"] },
      ],
      rate: [{ validator: rateValidator, trigger: ["blur", "change"] }],
      icon: [
        {
          required: true,
          message: "请上传渠道图标",
          trigger: ["blur", "change"],
        },
      ],
    };
    return {
      isEditDisabled: true, // 编辑状态
      actionUrl: UPLOAD_URL,
      formModel: {
        id: "",
        payWayName: "",
        payWayCode: "",
        currency: "",
        currencyName: "",
        rate: 1,
        copy: "",
        icon: [],
        tag: [],
        remark: "",
      },
    };
  },
  computed: {
    ...mapGetters({
      currencyList: "currencyList",
    }),
  },
  watch: {
    rowData(newVal) {
      if (newVal && Object.keys(newVal).length) {
        const newState = {
          ...newVal,
          rate: newVal.rate / 1000,
          icon: this.formatUrl2Image(newVal.icon, "渠道图标"),
          tag: this.formatUrl2Image(newVal.tag, "渠道标签图标"),
        };
        this.formModel = { ...newState };
        this.cacheRow = { ...newState };
      } else {
        this.formModel = {
          id: "",
          payWayName: "",
          payWayCode: "",
          currency: "",
          currencyName: "",
          rate: 1,
          copy: "",
          icon: [],
          tag: [],
          remark: "",
        };
        this.cacheRow = {
          id: "",
          payWayName: "",
          payWayCode: "",
          currency: "",
          currencyName: "",
          rate: 1,
          copy: "",
          icon: [],
          tag: [],
          remark: "",
        };
      }
      this.handleEditable(!!this.formModel.id);
    },
  },
  methods: {
    // 处理 详情和新增 切换时候图片展示的问题
    handleDialogOpen() {
      const { id } = this.formModel;

      if (id && id === this.cacheRow.id) {
        this.formModel = {
          ...this.formModel,
          ...this.cacheRow,
        };
      }
    },

    handleSubmitForm(callback) {
      this.handleSubmit({
        fetchData: {
          ...this.formModel,
          rate: parseFloat(this.formModel.rate) * 1000,
          icon: this.formatImage2Url(this.formModel.icon),
          tag: this.formatImage2Url(this.formModel.tag),
        },
        callback,
      });
    },

    handleUploadSuccess(type) {
      this.$refs["dialogFormRef"].clearValidate("icon");
      return (res, file) => {
        const resFile = {
          name: file.name,
          url: res.data.url,
        };

        if (Array.isArray(this.formModel[type])) {
          this.formModel[type].push(resFile);
        } else {
          this.formModel[type] = [resFile];
        }
      };
    },

    handleUploadRemove(type) {
      return (file, fileList) => {
        this.formModel[type] = fileList;
      };
    },

    // 将 filelist 转换成 url
    formatImage2Url(urlObj) {
      if (typeof urlObj === "string") {
        return urlObj;
      }

      if (Array.isArray(urlObj) && urlObj.length) {
        return urlObj[0].url;
      }

      return "";
    },

    // 将 url 转换成 filelist
    formatUrl2Image(url, defaultName = "图片") {
      if (url) {
        const name = this.$common.getUrlParams(url, "name") || defaultName;

        return [{ url, name }];
      }

      return [];
    },

    // 把currencyName(dictText)保存下来
    currencySelect(item) {
      if (Array.isArray(this.currencyList)) {
        this.currencyList.forEach((element) => {
          if (element.dictValue === item) {
            this.formModel.currencyName = element.dictText;
          }
        });
      }
    },

    // 重置表单
    // ⚠️注意：和 mixin 定义了重复的方法会覆盖 mixin 里面的方法，而生命周期方法重复了，会按顺序依次执行
    // 详细参考：https://cn.vuejs.org/v2/guide/mixins.html
    handleResetForm() {
      this.handleEditable(!!this.formModel.id);
      this.formModel = {
        ...this.cacheRow,
        icon: [],
        tag: [],
      };
      this.$nextTick(() => {
        this.$refs.dialogFormRef.clearValidate();

        this.$eventBus.$emit("dialog-visible", {
          visible: false,
          dialogId: "channelDialog",
        });
      });
    },
  },
};
</script>
