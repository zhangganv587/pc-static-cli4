<!--
 * @Author: 张淦
 * @Date: 2020-03-18 16:23:15
 * @LastEditors: zhanggan
 * @Description: 医保后台-医疗机构信息弹窗
 * @FilePath: /gpay-ops-static/src/pages/insurance/medicalInstitutionDialog.vue
 -->
<template>
  <v-dialog
    title="医疗机构信息"
    dialog-id="medicalInstitution"
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
      <el-form-item label="医疗机构：" prop="hospitalName">
        <el-input
          v-model="formModel.hospitalName"
          autocomplete="off"
          placeholder="请输入医疗机构名称"
          maxlength="32"
          :disabled="isEditDisabled"
        />
      </el-form-item>
      <el-form-item label="医疗机构机构号：" prop="hospitalNum">
        <el-input
          v-model="formModel.hospitalNum"
          autocomplete="off"
          placeholder="请输入医疗机构机构号"
          maxlength="32"
          :disabled="isEditDisabled"
        />
      </el-form-item>
      <el-form-item prop="hospitalType" label="医疗机构类型：">
        <el-select
          v-model="formModel.hospitalType"
          placeholder="请选择医疗机构类型"
          filterable
          clearable
          :disabled="isEditDisabled"
        >
          <el-option
            v-for="(key, value) in hospitalList"
            :key="value"
            :label="key"
            :value="value"
          />
        </el-select>
      </el-form-item>
      <el-form-item prop="miCenterNo" label="医保中心：">
        <el-select
          v-model="formModel.miCenterNo"
          placeholder="请选择医保中心"
          filterable
          clearable
          :disabled="isEditDisabled"
          @change="centerChange"
        >
          <el-option
            v-for="(center, index) in medicalCenterList"
            :key="index"
            :label="center.value"
            :value="center.code"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="两定单位编号：" prop="hospitalNo">
        <el-input
          v-model="formModel.hospitalNo"
          autocomplete="off"
          placeholder="请输入两定单位编号"
          maxlength="32"
          :disabled="isEditDisabled"
        />
      </el-form-item>
      <el-form-item label="联系人：" prop="contact">
        <el-input
          v-model="formModel.contact"
          autocomplete="off"
          placeholder="请输入联系人名称"
          maxlength="32"
          :disabled="isEditDisabled"
        />
      </el-form-item>
      <el-form-item label="联系人手机号：" prop="mobile">
        <el-input
          v-model="formModel.mobile"
          autocomplete="off"
          placeholder="请输入联系人手机号"
          maxlength="32"
          :disabled="isEditDisabled"
        />
      </el-form-item>
      <el-form-item label="前置机链接地址：" prop="remark">
        <el-input
          v-model="formModel.remark"
          autocomplete="off"
          placeholder="请输入前置机链接地址编号"
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
import { HOSPITAL_TYPE } from "@/utils/constants";

export default {
  mixins: [dialogFormMixin],
  data() {
    this.hospitalList = HOSPITAL_TYPE;
    this.rules = {
      hospitalName: [
        {
          required: true,
          message: "请输入医疗中心名称",
          trigger: ["blur", "change"],
        },
      ],
      hospitalNum: [
        {
          required: true,
          message: "请输入医疗中心机构号",
          trigger: ["blur", "change"],
        },
      ],
      hospitalType: [
        {
          required: true,
          message: "请选择医疗机构类型",
          trigger: ["blur", "change"],
        },
      ],
      miCenterNo: [
        {
          required: true,
          message: "请选择医保中心",
          trigger: ["blur", "change"],
        },
      ],
      hospitalNo: [
        {
          required: true,
          message: "请输入两定单位编号",
          trigger: ["blur", "change"],
        },
      ],
      remark: [
        {
          required: true,
          message: "请输入前置机链接地址编号",
          trigger: ["blur", "change"],
        },
      ],
    };

    this.submitFormArr = [
      {
        url: "/mi/hospital/add.json",
        message: "新增医疗机构",
      },
      {
        url: "/mi/hospital/update.json",
        message: "编辑医疗机构",
      },
    ];

    return {
      isEditDisabled: true,
      formModel: {
        id: null,
        hospitalName: null,
        hospitalNum: null,
        hospitalType: null,
        miCenterName: null,
        miCenterNo: null,
        hospitalNo: null,
        contact: null,
        mobile: null,
        remark: null,
      },
    };
  },
  computed: {
    ...mapGetters({
      medicalCenterList: "medicalCenterList",
    }),
  },
  watch: {
    rowData(newVal) {
      if (newVal && typeof newVal === "object") {
        Object.keys(this.formModel).forEach((key) => {
          this.formModel[key] = newVal[key] || null;
          this.cacheRow[key] = newVal[key] || null;
        });
        this.formModel.hospitalType =
          newVal.hospitalType || newVal.hospitalType === 0
            ? newVal.hospitalType + ""
            : null;
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
    centerChange() {
      this.medicalCenterList.forEach((element) => {
        if (element.code === this.formModel.miCenterNo) {
          this.formModel.miCenterName = element.value;
        }
      });
    },
  },
};
</script>
