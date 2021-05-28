<template>
  <div class="insurance__doctor">
    <el-form
      ref="doctorSearchForm"
      label-width="130px"
      :inline="true"
      :model="searchForm"
    >
      <el-form-item prop="hospitalNo">
        <el-input
          v-model="searchForm.hospitalNo"
          placeholder="医院编号"
          clearable
        />
      </el-form-item>
      <el-form-item prop="miCenterNo">
        <el-input
          v-model="searchForm.miCenterNo"
          placeholder="医保机构编号"
          clearable
        />
      </el-form-item>
      <el-form-item prop="doctorNo">
        <el-input
          v-model="searchForm.doctorNo"
          placeholder="医生编号"
          clearable
        />
      </el-form-item>
      <el-form-item prop="doctorName">
        <el-input
          v-model="searchForm.doctorName"
          placeholder="医生名称"
          clearable
        />
      </el-form-item>
      <el-form-item prop="doctorType">
        <el-select
          v-model="searchForm.doctorType"
          placeholder="医生类别"
          filterable
          clearable
        >
          <el-option
            v-for="(it, key) in doctorTypeState"
            :key="key"
            :label="it.label"
            :value="it.value"
          />
        </el-select>
      </el-form-item>
      <!-- <el-form-item
        prop="createTime"
      >
        <we-date-picker
          v-model="searchForm.createTime"
          :picker-props="pickerProps"
          :max-range="31"
          @currentChange="datePickerChange"
        />
      </el-form-item> -->
      <el-form-item>
        <v-form-submit
          ref="formSubmit"
          :action="queryUrl"
          :immediate="true"
          :pagination="pagination"
          @click:search="handleSearch"
        >
          查询
        </v-form-submit>
        <v-form-reset :form-ref="$refs['doctorSearchForm']" />
      </el-form-item>
    </el-form>
    <!-- <v-add-btn @click="handleInfo({}, 'doctorInfo')">
      添加医生
    </v-add-btn> -->
    <v-table
      v-loading="loading"
      :data="tableData"
      :columns="columns"
      :pagination="pagination"
      @currentChange="currentChange"
    />
    <doctorDialog :row-data="row" />
  </div>
</template>
<script>
import tableFormMixin from "@/mixins/tableFormMixin";
import prohibitMixin from "@/mixins/prohibitMixin";
import doctorDialog from "./doctorDialog";

export default {
  name: "Doctor",
  components: {
    doctorDialog,
  },
  mixins: [tableFormMixin, prohibitMixin],
  data() {
    this.columns = this.getColumns();
    this.queryUrl = "/mi/doctor/query.json";
    this.pickerProps = {
      startPlaceholder: "更新开始时间",
      endPlaceholder: "更新结束时间",
    };
    return {
      searchForm: {
        hospitalNo: "",
        miCenterNo: "",
        doctorNo: "",
        doctorName: "",
        doctorType: "",
      },
      doctorTypeState: [
        { value: 0, label: "普通" },
        { value: 1, label: "责任" },
      ],
    };
  },
  methods: {
    datePickerChange(datePicker) {
      this.$refs.doctorSearchForm.clearValidate();
      this.searchForm.createTimeStart = datePicker
        ? new Date(datePicker[0]).getTime()
        : "";
      this.searchForm.createTimeEnd = datePicker
        ? new Date(datePicker[1]).getTime()
        : "";
    },
    getColumns() {
      const columns = [
        { prop: "miCenterNo", label: "医保机构编号" },
        { prop: "hospitalNo", label: "医院编号" },
        { prop: "doctorUserId", label: "医生ID" },
        { prop: "doctorNo", label: "医生编号" },
        { prop: "idNo", label: "身份证信息" },
        { prop: "doctorName", label: "医生名称" },
        {
          prop: "doctorType",
          label: "医生类别",
          render: (h, value, row) => {
            return +value === 1 ? "责任" : "普通";
          },
        },
        { prop: "hospitalId", label: "标准医院ID" },
        { prop: "departmentId", label: "标准科室ID" },
        { prop: "practiceCertNo", label: "执业医师证号" },
        { prop: "registerCertNo", label: "注册医师证号" },
        {
          prop: "recordState",
          label: "医保备案状态",
          render: (h, value, row) => {
            return +value === 1 ? "已备案" : "未备案";
          },
        },
        // { prop: 'status',
        //   label: '操作',
        //   width: '100',
        //   render: (h, value, row) => {
        //     return (
        //       <div>
        //         <el-button onClick={() => this.handleInfo(row, 'doctorInfo')} type="text">修改</el-button>
        //       </div>
        //     );
        //   }
        // }
      ];
      return columns;
    },
  },
};
</script>
