<template>
  <div class="table">
    <el-table
      ref="elTable"
      :data="data"
      size="default"
      header-row-class-name="header-row"
      border
      :row-key="rowkey"
      v-bind="$attrs"
      v-on="$listeners"
      @selection-change="selectionChange"
    >
      <el-table-column
        v-if="type === 'index'"
        :type="type"
        label="序号"
        width="60"
      />
      <el-table-column v-else-if="type && type != 'index'" :type="type" />
      <el-table-column
        v-for="(column, index) in columns"
        :key="index"
        v-bind="column"
        :fixed="column.fixed"
        :align="column.align"
        :prop="columns.prop"
        :min-width="columns.width || ''"
      >
        <template slot-scope="scope">
          <v-table-render
            v-if="column.render"
            :render="column.render"
            :row-scope="scope"
            :prop="column.prop"
          />
          <span v-else>{{ scope.row[column.prop] }}</span>
        </template>
      </el-table-column>
    </el-table>
    <div v-if="pagination && pagination.totalNum" class="table-paginate">
      <VPagination
        :page-index="pagination.pageIndex"
        :page-size="pagination.pageSize"
        :current-change="currentChange"
        :total-num="pagination.totalNum"
      />
    </div>
  </div>
</template>
<script>
import VTableRender from "./v-table-render";
import VPagination from "./v-pagination";

export default {
  name: "VTable",
  components: {
    VTableRender,
    VPagination,
  },
  props: {
    data: {
      type: Array,
      default() {
        return [];
      },
    },
    type: {
      type: String,
      default: "",
    },
    rowkey: {
      type: String,
      default: "",
    },
    columns: {
      type: Array,
      default() {
        return [];
      },
    },
    align: {
      type: String,
      default: "left",
    },
    pagination: {
      type: Object,
      default() {
        return {};
      },
    },
  },
  data() {
    this.tableMethods = [
      "clearSelection",
      "toggleRowSelection",
      "toggleAllSelection",
      "toggleRowExpansion",
      "setCurrentRow",
      "clearSort",
      "clearFilter",
      "doLayout",
      "sort",
    ];
    return {};
  },
  mounted() {
    this.tableMethods.forEach((element) => {
      this.$on(element, this.$refs.elTable[element]);
    });
  },
  methods: {
    headerRowStyle() {
      return { "text-align": "center" };
    },
    selectionChange(val) {
      this.$emit("selectionChange", val);
    },
    currentChange(data) {
      this.$emit("currentChange", data);
    },
  },
};
</script>
<style lang="less" scoped>
@import url("~@/assets/css/variables.less");

.table {
  @{deep} .header-row {
    background-color: #e9effd;
  }
  .table-paginate {
    float: right;
    margin-top: 16px;
    text-align: right;
  }
}
</style>
