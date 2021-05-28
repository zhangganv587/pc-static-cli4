<template>
  <v-dialog
    title="医生信息"
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
        v-for="(form, index) in doctorForm"
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
        url: "/mi/doctor/insert.json",
        message: "新增医生",
      },
      {
        url: "/mi/doctor/update.json",
        message: "编辑医生",
      },
    ];

    return {
      isEditDisabled: false,
      formModel: {
        id: null,
        miCenterNo: null,
        hospitalNo: null,
        doctorUserId: null,
        doctorNo: null,
        doctorName: null,
        idNo: null,
        sex: 1,
        doctorType: 0,
        hospitalId: null,
        practiceCertNo: null,
        registerCertNo: null,
        filingState: 0,
      },
      doctorForm: [
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
          name: "医生ID",
          label: "doctorUserId",
          required: true,
          type: "input",
        },
        {
          name: "医生名称",
          label: "doctorName",
          required: true,
          type: "input",
        },
        { name: "身份证信息", label: "idNo", required: true, type: "input" },
        {
          name: "医生性别",
          label: "sex",
          required: true,
          type: "select",
          options: [
            { value: 1, label: "男" },
            { value: 2, label: "女" },
            { value: 3, label: "未知" },
          ],
        },
        {
          name: "医生类别",
          label: "doctorType",
          required: true,
          type: "select",
          options: [
            { value: 0, label: "普通" },
            { value: 1, label: "责任" },
          ],
        },
        {
          name: "标准科室ID",
          label: "departmentId",
          required: true,
          type: "input",
        },
        {
          name: "科室编码",
          label: "departmentNo",
          required: true,
          type: "input",
        },
        {
          name: "标准科室名称",
          label: "departmentName",
          required: true,
          type: "input",
        },
        {
          name: "执业医师证号",
          label: "practiceCertNo",
          required: false,
          type: "input",
        },
        {
          name: "注册医师证号",
          label: "registerCertNo",
          required: false,
          type: "input",
        },
      ],
    };
  },
  computed: {
    rules() {
      const map = {};
      this.doctorForm.forEach((it) => {
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
        this.formModel.doctorType = this.formModel.doctorType
          ? this.formModel.doctorType
          : 0;
        this.formModel.sex = this.formModel.sex ? this.formModel.sex : 3;
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
