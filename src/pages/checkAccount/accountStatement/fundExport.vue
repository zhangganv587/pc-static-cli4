<template>
  <div class="page-fund-export">
    <el-form ref="form" label-width="120px" :inline="true" :model="formModel">
      <el-form-item prop="opUserName">
        <el-input
          v-model="formModel.opUserName"
          clearable
          placeholder="操作人"
        />
      </el-form-item>
      <el-form-item prop="jobStatus">
        <el-select v-model="formModel.jobStatus" clearable placeholder="状态">
          <el-option value="0" label="进行中" />
          <el-option value="1" label="已完成" />
          <el-option value="2" label="已失败" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-bunch>
          <el-button type="primary" @click="debounceHandleSearch(true)">
            查询
          </el-button>
          <el-button plain @click="handleReset"> 清空 </el-button>
        </el-bunch>
      </el-form-item>
    </el-form>
    <div class="reload">
      <el-button type="primary" @click="debounceHandleSearch(false)">
        手动刷新列表
      </el-button>
    </div>
    <div class="list">
      <el-table v-loading="loading" :data="tableData" size="large" border>
        <el-table-column type="index" label="序号" width="60" align="center" />
        <el-table-column prop="title" label="任务标题" width="300" />
        <el-table-column prop="filters" label="筛选条件">
          <template slot-scope="{ row }">
            <div v-html="row.filters.replace(/\n/g, '<br/>')" />
          </template>
        </el-table-column>
        <el-table-column prop="opUserName" label="操作人" width="120" />
        <el-table-column prop="startTime" label="开始时间" width="200" />
        <el-table-column prop="completeTime" label="结束时间" width="200" />
        <el-table-column
          prop="jobStatus"
          label="状态"
          width="100"
          align="center"
        >
          <template slot-scope="scope">
            <el-tag :type="statusMap[scope.row.jobStatus].type">
              {{ statusMap[scope.row.jobStatus].label }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column
          prop="id"
          label="操作"
          width="120"
          fixed="right"
          align="center"
        >
          <template slot-scope="{ row }">
            <el-bunch>
              <el-link
                v-if="row.jobStatus === 1"
                :href="row.filePath"
                type="primary"
              >
                下载对账单
              </el-link>
            </el-bunch>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="pagination">
      <el-pagination
        background
        align="right"
        layout="total, prev, pager, next, sizes, jumper"
        :total="totalSize"
        :current-page="pageIndex"
        @current-change="handlePageNo"
        @size-change="handlePageSize"
      />
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import { debounce } from "throttle-debounce";

export default {
  data() {
    return {
      formModel: {
        opUserName: null, // 操作人
        jobStatus: null, // 状态
      },
      statusMap: {
        0: {
          label: "进行中",
          type: "",
        },
        1: {
          label: "已完成",
          type: "success",
        },
        2: {
          label: "已失败",
          type: "danger",
        },
      },
      pageIndex: 1,
      pageSize: 10,
      loading: false,
    };
  },
  computed: {
    ...mapGetters({
      exportList: "exportList",
    }),
    tableData() {
      return this.exportList.dataList;
    },
    totalSize() {
      return this.exportList.totalNum;
    },
  },
  created() {
    this.debounceHandleSearch = debounce(100, this.handleSearch);
    this.debounceHandleSearch();
  },
  mounted() {
    this.debounceHandleSearch();
  },
  methods: {
    ...mapActions({
      getExportList: "getExportList",
    }),
    handleReset() {
      this.$refs.form.resetFields();
    },
    handlePageNo(val) {
      this.pageIndex = val;
      this.debounceHandleSearch();
    },
    handlePageSize(val) {
      this.pageSize = val;
      this.debounceHandleSearch();
    },
    handleSearch(reset) {
      if (reset) {
        this.pageIndex = 1;
      }
      const query = {
        pageIndex: this.pageIndex,
        pageSize: this.pageSize,
        ...this.formModel,
      };
      this.loading = true;
      this.getExportList(query).finally(() => {
        this.loading = false;
      });
    },
  },
};
</script>
<style lang="less" scoped>
.page-fund-export {
  .reload {
    padding-bottom: 16px;
    text-align: right;
  }
  .pagination {
    padding: 16px 0px;
  }
}
</style>
