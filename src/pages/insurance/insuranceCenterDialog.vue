<!--
 * @Author: 张淦
 * @Date: 2020-03-18 15:01:40
 * @LastEditors: zhanggan
 * @Description: 医保后台-医保中心信息弹窗
 * @FilePath: /gpay-ops-static/src/pages/insurance/insuranceCenterDialog.vue
 -->
<template>
  <v-dialog
    title="医保中心信息"
    dialog-id="insuranceCenter"
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
      <el-form-item label="医保中心：" prop="miCenterName">
        <el-input
          v-model="formModel.miCenterName"
          autocomplete="off"
          placeholder="请输入医保中心名称"
          maxlength="32"
          :disabled="isEditDisabled"
        />
      </el-form-item>
      <el-form-item label="医保中心编号：" prop="miCenterNo">
        <el-input
          v-model="formModel.miCenterNo"
          autocomplete="off"
          placeholder="请输入医保中心编号"
          maxlength="32"
          :disabled="isEditDisabled"
        />
      </el-form-item>
    </el-form>
  </v-dialog>
</template>

<script>
import { mapGetters } from "vuex";
import dialogFormMixin from "@/mixins/dialogFormMixin";

export default {
  mixins: [dialogFormMixin],
  data() {
    this.rules = {
      miCenterName: [
        { required: true, message: "请输入医保中心名称", trigger: "blur" },
      ],
      miCenterNo: [
        { required: true, message: "请输入医保中心编号", trigger: "blur" },
      ],
    };

    this.submitFormArr = [
      {
        url: "/mi/center/add.json",
        message: "新增医保中心",
      },
      {
        url: "/mi/center/update.json",
        message: "编辑医保中心",
      },
    ];

    return {
      isEditDisabled: true,
      formModel: {
        id: null,
        miCenterName: null,
        miCenterNo: null,
        status: null,
      },
    };
  },
  computed: {
    ...mapGetters({
      dictionaryList: "dictionaryList",
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
      this.formModel.status = this.formModel.status ? this.formModel.status : 0;
      this.handleEditable(!!this.formModel.id);
    },
  },
  methods: {
    handleSubmitForm(callback) {
      this.handleSubmit({
        fetchData: {
          ...this.formModel,
        },
        callback,
      });
    },
  },
};
</script>
