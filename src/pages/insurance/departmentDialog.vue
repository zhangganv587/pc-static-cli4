<template>
  <v-dialog
    title="科室信息"
    dialog-id="doctorInfo"
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
      <el-form-item
        v-for="(form, index) in departmentForm"
        :key="index"
        :label="`${form.name}：`"
        :prop="form.label"
      >
        <el-input
          v-if="form.type === 'input'"
          v-model="formModel[form.label]"
          autocomplete="off"
          :placeholder="`请输入${form.name}`"
          clearable
          :disabled="isEditDisabled"
          size="small"
        />
        <el-select
          v-if="form.type === 'select'"
          v-model="formModel[form.label]"
          :placeholder="`请选择${form.name}`"
          :disabled="isEditDisabled"
          size="small"
          clearable
        >
          <el-option
            v-for="(it, key) in form.options"
            :key="key"
            :label="it.label"
            :value="it.value"
          />
        </el-select>
      </el-form-item>
    </el-form>
  </v-dialog>
</template>

<script>
import dialogFormMixin from "@/mixins/dialogFormMixin";

export default {
  mixins: [dialogFormMixin],
  data() {
    this.submitFormArr = [
      {
        url: "/mi/department/add_dept_info.json",
        message: "新增科室",
      },
      {
        url: "/mi/department/edit_dept_info.json",
        message: "编辑科室",
      },
    ];

    return {
      isEditDisabled: false,
      formModel: {
        id: null,
        miCenterNo: null,
        hospitalNo: null,
        hospitalId: null,
        deptLevelId: null,
        deptLevelName: null,
        deptId: null,
        deptName: null,
      },
      departmentForm: [
        {
          name: "医保机构编号",
          label: "miCenterNo",
          required: true,
          type: "input",
        },
        {
          name: "医院编号",
          label: "hospitalNo",
          required: false,
          type: "input",
        },
        {
          name: "标准医院ID",
          label: "hospitalId",
          required: true,
          type: "input",
        },
        {
          name: "一级科室ID",
          label: "deptLevelId",
          required: false,
          type: "input",
        },
        {
          name: "一级科室名称",
          label: "deptLevelName",
          required: false,
          type: "input",
        },
        { name: "二级科室ID", label: "deptId", required: true, type: "input" },
        {
          name: "二级科室名称",
          label: "deptName",
          required: true,
          type: "input",
        },
      ],
    };
  },
  computed: {
    rules() {
      const map = {};
      this.departmentForm.forEach((it) => {
        if (it.required) {
          map[it.label] = [
            {
              required: true,
              message: `请${it.type === "input" ? "输入" : "选择"}${it.name}`,
              trigger: "blur",
            },
          ];
        }
      });
      return map;
    },
  },
  watch: {
    rowData(newVal) {
      if (newVal && typeof newVal === "object") {
        Object.keys(this.formModel).forEach((key) => {
          this.formModel[key] = newVal[key] || null;
          this.cacheRow[key] = newVal[key] || null;
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
