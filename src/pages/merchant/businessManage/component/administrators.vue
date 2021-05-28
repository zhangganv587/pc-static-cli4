<template>
  <v-dialog
    title="管理员设置"
    dialog-id="adminSetting"
    :is-edit-disabled="isEditDisabled"
    :is-confirming="isConfirming"
    @dialog-confirm="handleSubmitForm"
    @dialog-close="handleResetForm"
    @dialog-editable="handleEditable"
  >
    <el-form
      ref="dialogFormRef"
      label-width="120px"
      :model="formModel"
      inline-message="true"
      :rules="rules"
    >
      <el-form-item label="机构名称：" prop="institutionName">
        <el-input
          v-model="formModel.institutionName"
          autocomplete="off"
          placeholder="机构名称"
          :disabled="true"
        />
      </el-form-item>
      <el-form-item label="接入业务：" prop="businessName">
        <el-input
          v-model="formModel.businessName"
          autocomplete="off"
          placeholder="接入业务"
          :disabled="true"
        />
      </el-form-item>
      <el-form-item label="管理人OA：" prop="creator">
        <el-input
          v-model="formModel.creator"
          autocomplete="off"
          placeholder="管理人OA"
          :disabled="isEditDisabled"
        />
      </el-form-item>
    </el-form>
  </v-dialog>
</template>

<script>
import dialogFormMixin from "@/mixins/dialogFormMixin";

export default {
  mixins: [dialogFormMixin],
  data() {
    this.rules = {
      creator: [{ required: true, message: "管理人OA账号", trigger: "blur" }],
    };

    this.submitFormArr = [
      {
        url: "",
        message: "",
      },
      {
        url: "/pay/business/admin.json",
        message: "修改管理员",
      },
    ];

    return {
      isEditDisabled: true,
      formModel: {
        id: "",
        institutionName: "",
        businessName: "",
        creator: "",
      },
    };
  },
  watch: {
    rowData(newVal) {
      if (newVal && typeof newVal === "object") {
        Object.keys(this.formModel).forEach((key) => {
          this.formModel[key] = newVal[key] || "";
          this.cacheRow[key] = newVal[key] || "";
        });
      }
      this.handleEditable(!!this.formModel.id);
    },
  },
  methods: {
    handleSubmitForm(callback) {
      this.handleSubmit({
        fetchData: {
          ...this.formModel,
          creator: this.formModel.creator.toLowerCase(),
        },
        callback,
      });
    },
  },
};
</script>
