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
      <el-form-item prop="hospitalId">
        <el-input
          v-model="searchForm.hospitalId"
          placeholder="医院ID"
          clearable
        />
      </el-form-item>
      <el-form-item prop="deptName">
        <el-input
          v-model="searchForm.deptName"
          placeholder="科室名称"
          clearable
        />
      </el-form-item>
      <el-form-item prop="deptNo">
        <el-input
          v-model="searchForm.deptNo"
          placeholder="科室编号"
          clearable
        />
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
      添加科室
    </v-add-btn> -->
    <v-table
      v-loading="loading"
      :data="tableData"
      :columns="columns"
      :pagination="pagination"
      @currentChange="currentChange"
    />
    <departmentDialog :row-data="row" />
  </div>
</template>
<script>
import tableFormMixin from "@/mixins/tableFormMixin";
import prohibitMixin from "@/mixins/prohibitMixin";
import departmentDialog from "./departmentDialog";

export default {
  name: "Doctor",
  components: {
    departmentDialog,
  },
  mixins: [tableFormMixin, prohibitMixin],
  data() {
    this.columns = this.getColumns();
    this.queryUrl = "/mi/department/page_list.json";
    this.pickerProps = {
      startPlaceholder: "更新开始时间",
      endPlaceholder: "更新结束时间",
    };
    return {
      searchForm: {
        hospitalNo: "",
        miCenterNo: "",
        hospitalId: "",
        deptName: "",
        deptNo: "",
      },
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
        { prop: "id", label: "编号" },
        { prop: "miCenterNo", label: "医保机构编号" },
        { prop: "hospitalNo", label: "医院编号" },
        { prop: "hospitalId", label: "医院ID" },
        { prop: "deptId", label: "科室UUID" },
        { prop: "deptName", label: "科室名称" },
        { prop: "deptNo", label: "科室医保编号" },
        {
          prop: "recordState",
          label: "医保备案状态",
          render: (h, value, row) => {
            return +value === 1 ? "已备案" : "未备案";
          },
        },
        { prop: "errorMsg", label: "错误信息" },
        // { prop: 'status',
        //   label: '操作',
        //   width: '100',
        //   render: (h, value, row) => {
        //     return (
        //       <div>
        //         <el-button onClick={() => this.handleInfo(row, 'doctorInfo')} type="text">修改</el-button>
        //         <el-button onClick={() => this.handleInfo(row, 'doctorInfo')} type="text">医保备案</el-button>
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
