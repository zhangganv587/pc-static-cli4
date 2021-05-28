<!--
 * @Author: 张淦
 * @Date: 2020-03-31 18:01:36
 * @LastEditors: 张淦
 * @Description: 医保后台-操作人信息
 * @FilePath: /gpay-ops-static/src/pages/insurance/operatorDialog.vue
 -->
<template>
  <v-dialog
    title="操作人信息"
    dialog-id="operatorManage"
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
      <el-form-item label="操作人：" prop="operator">
        <el-input
          v-model="formModel.operator"
          autocomplete="off"
          placeholder="请输入操作人"
          maxlength="32"
          :disabled="isEditDisabled"
        />
      </el-form-item>
      <el-form-item label="账号：" prop="accountNum">
        <el-input
          v-model="formModel.accountNum"
          autocomplete="off"
          placeholder="请输入账号"
          maxlength="32"
          :disabled="isEditDisabled"
        />
      </el-form-item>
      <el-form-item label="密码：" prop="password">
        <el-input
          v-model="formModel.password"
          autocomplete="off"
          placeholder="请输入密码"
          maxlength="32"
          :disabled="isEditDisabled"
        />
      </el-form-item>
      <el-form-item label="医疗机构：" prop="hospitalNum">
        <el-select
          v-model="formModel.hospitalNum"
          placeholder="请选择医疗机构"
          :disabled="isEditDisabled"
          filterable
          clearable
          @change="hospitalChange"
        >
          <el-option
            v-for="(hospital, index) in hospitalDetail"
            :key="index"
            :label="hospital.value"
            :value="hospital.code"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="医保中心：" prop="miCenterNo">
        <el-select
          v-model="formModel.miCenterNo"
          placeholder="请选择医保中心"
          :disabled="isEditDisabled"
          filterable
          clearable
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
      operator: [
        {
          required: true,
          message: "请输入操作人",
          trigger: ["blur", "change"],
        },
      ],
      accountNum: [
        { required: true, message: "请输入账号", trigger: ["blur", "change"] },
      ],
      password: [
        { required: true, message: "请输入密码", trigger: ["blur", "change"] },
      ],
      hospitalNum: [
        {
          required: true,
          message: "请选择医疗机构",
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
    };

    this.submitFormArr = [
      {
        url: "/mi/operator/add.json",
        message: "新增操作人",
      },
      {
        url: "/mi/operator/update.json",
        message: "编辑操作人",
      },
    ];

    return {
      isEditDisabled: true,
      formModel: {
        id: null,
        operator: null,
        accountNum: null,
        password: null,
        miCenterName: null,
        miCenterNo: null,
        hospitalName: null,
        hospitalNum: null,
        hospitalNo: null,
        status: 0,
      },
    };
  },
  computed: {
    ...mapGetters({
      hospitalDetail: "hospitalDetail",
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
      }

      this.formModel.status = this.formModel.status ? this.formModel.status : 0;
      this.handleEditable(!!this.formModel.id);
    },
  },
  created() {
    this.$common.judgeState({
      medicalCenterList: "getMedicalCenterList",
    });
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
    hospitalChange() {
      this.hospitalDetail.forEach((element) => {
        if (element.code === this.formModel.hospitalNum) {
          this.formModel.hospitalName = element.value;
          this.formModel.hospitalNo = element.desc;
        }
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
