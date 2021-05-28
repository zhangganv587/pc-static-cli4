<template>
  <v-dialog
    title="字典信息"
    dialog-id="dictionaryInfo"
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
      <el-form-item label="字典类型：" prop="dictCode">
        <el-select
          v-model="formModel.dictCode"
          placeholder="请选择字典类型"
          :disabled="isEditDisabled"
          filterable
          clearable
        >
          <el-option
            v-for="item in dictionaryList"
            :key="item.dictCode"
            :label="item.dictName"
            :value="item.dictCode"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="字典名称：" prop="dictText">
        <el-input
          v-model="formModel.dictText"
          autocomplete="off"
          placeholder="请输入字典名称"
          :disabled="isEditDisabled"
        />
      </el-form-item>
      <el-form-item label="字典编号：" prop="dictValue">
        <el-input
          v-model="formModel.dictValue"
          autocomplete="off"
          placeholder="请输入字典编号"
          :disabled="isEditDisabled"
        />
      </el-form-item>
      <el-form-item label="备注：" prop="remark">
        <el-input
          v-model="formModel.remark"
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
      dictCode: [
        { required: true, message: "请选择字典类型", trigger: "change" },
      ],
      dictText: [
        { required: true, message: "请输入字典名称", trigger: "blur" },
      ],
      dictValue: [
        { required: true, message: "请输入字典编号", trigger: "blur" },
      ],
    };

    this.submitFormArr = [
      {
        url: "/dict/insert.json",
        message: "新增字典",
      },
      {
        url: "/dict/update.json",
        message: "编辑字典",
      },
    ];

    return {
      isEditDisabled: true,
      formModel: {
        id: "",
        dictCode: "",
        dictText: "",
        dictValue: "",
        remark: "",
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
        },
        callback,
      });
    },
  },
};
</script>
