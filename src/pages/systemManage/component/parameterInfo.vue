<template>
  <v-dialog
    title="参数信息"
    dialog-id="parameterInfo"
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
      <!-- <el-form-item
        label="参数类型："
        prop="dictCode"
      >
        <el-select
          v-model="formModel.dictCode"
          placeholder="请选择参数类型"
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
      </el-form-item> -->
      <el-form-item label="参数名称：" prop="propertyKey">
        <el-input
          v-model="formModel.propertyKey"
          autocomplete="off"
          placeholder="请输入参数名称"
          :disabled="isEditDisabled"
        />
      </el-form-item>
      <el-form-item label="参数编号：" prop="propertyValue">
        <el-input
          v-model="formModel.propertyValue"
          autocomplete="off"
          placeholder="请输入参数编号"
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
      // dictCode: [
      //   { required: true, message: '请选择参数类型', trigger: 'change' }
      // ],
      propertyKey: [
        { required: true, message: "请输入参数名称", trigger: "blur" },
      ],
      propertyValue: [
        { required: true, message: "请输入参数编号", trigger: "blur" },
      ],
    };

    this.submitFormArr = [
      {
        url: "/property/insert.json",
        message: "新增参数",
      },
      {
        url: "/property/update.json",
        message: "编辑参数",
      },
    ];

    return {
      isEditDisabled: true,
      formModel: {
        id: "",
        // dictCode: '',
        propertyKey: "",
        propertyValue: "",
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
      this.formModel.propertyKey = this.formModel.propertyKey.replace(
        /\s/g,
        ""
      );
      this.formModel.propertyValue = this.formModel.propertyValue.replace(
        /\s/g,
        ""
      );
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
