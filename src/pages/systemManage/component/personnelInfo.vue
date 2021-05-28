<template>
  <v-dialog
    title="人员信息"
    dialog-id="personnelInfo"
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
      :rules="rules"
    >
      <el-form-item label="OA账号：" prop="staffNo">
        <el-input
          v-model="formModel.staffNo"
          autocomplete="off"
          placeholder="请输入OA账号"
          maxlength="15"
          :disabled="isEditDisabled"
        />
      </el-form-item>
      <el-form-item label="管理业务：" multiple prop="businessCodes">
        <el-select
          v-model="formModel.businessCodes"
          placeholder="请选择管理业务"
          multiple
          :disabled="isEditDisabled"
        >
          <el-option
            v-for="account in businessAdministration"
            :key="account.id"
            :label="account.business"
            :value="account.businessCode"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="备注：" prop="memo">
        <el-input
          v-model="formModel.memo"
          type="textarea"
          :rows="3"
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
      staffNo: [{ required: true, message: "请输入 OA 账号", trigger: "blur" }],
      businessCodes: [
        { required: true, message: "请选择管理业务", trigger: "change" },
      ],
    };

    this.submitFormArr = [
      {
        url: "/rule/creat.json",
        message: "新增人员",
      },
      {
        url: "/rule/modify.json",
        message: "编辑人员",
      },
    ];

    // 用于重置表单数据
    this.cacheRow = null;

    return {
      isEditDisabled: false,
      formModel: {
        id: "",
        staffNo: "",
        businessCodes: [],
        memo: "",
      },
    };
  },
  computed: {
    ...mapGetters({
      businessAdministration: "businessAdministration",
    }),
  },
  watch: {
    rowData(newVal) {
      if (newVal && typeof newVal === "object") {
        const { id, groupId, def, memo } = newVal;
        const newFormModel = {
          id: id || "",
          staffNo: groupId || "",
          businessCodes: typeof def === "string" ? def.split("|") : [],
          memo: memo || "",
        };

        this.cacheRow = { ...newFormModel };
        this.formModel = { ...newFormModel };
      }

      this.handleEditable(!!this.formModel.id);
    },
  },
  created() {
    this.$common.judgeState({
      businessAdministration: "getBusinessAdministration",
    });
  },
  methods: {
    handleSubmitForm(callback) {
      this.handleSubmit({
        fetchData: {
          ...this.formModel,
          businessCodes: this.formModel.businessCodes.join("|"),
        },
        callback,
      });
    },
  },
};
</script>
