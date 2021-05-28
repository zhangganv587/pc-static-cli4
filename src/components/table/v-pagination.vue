<template>
  <div class="pagination">
    <el-pagination
      :current-page="pageIndex"
      :page-sizes="pageSizes"
      :page-size="pageSize"
      :layout="layout"
      :total="totalNum"
      background
      @current-change="(page) => currentChange({ pageIndex: page })"
      @size-change="(size) => currentChange({ pageSize: size })"
    />
  </div>
</template>

<script>
export default {
  components: {},
  props: {
    pageSize: {
      type: Number,
      default: 10,
    },
    pageIndex: {
      type: Number,
      default: 1,
    },
    layout: {
      type: String,
      default: "total, prev, pager, next, sizes, jumper",
    },
    pageSizes: {
      type: Array,
      default() {
        return [5, 10, 20, 30, 40, 50];
      },
    },
    currentChange: {
      type: Function,
      default: () => {},
    },
    sizeChange: {
      type: Function,
      default: () => {},
    },
    totalNum: {
      type: Number,
      default: 0,
    },
  },
};
</script>
<style lang="less" scoped>
@import url("~@/assets/css/variables.less");

.pagination {
  @{deep} .el-pagination {
    .el-pagination__total {
      margin-right: 4px;
      font-size: 12px;
      color: #34384b;
    }

    &.is-background {
      .btn-next,
      .btn-prev,
      .el-pager li {
        font-weight: 400;
        line-height: 26px;
        color: #8c9ab4;
        background-color: #fff;
        border: 1px solid #dbe2f6;
        border-radius: 4px;
      }

      button:disabled {
        color: #a9b5ca;
        background-color: #fff;
      }

      button:not(:disabled):hover {
        color: #3e7fee;
        border: 1px solid #3e7fee;
      }
    }

    &.is-background .el-pager li:not(.disabled) {
      &.active,
      &:hover {
        color: #fff;
        background-color: #3e7fee;
        border: 1px solid #3e7fee;
      }
    }

    .el-pagination__sizes {
      margin-right: 2px;
      .el-input {
        width: 90px;
      }
    }

    .el-pagination__jump {
      margin-left: 0;
      color: #34384b;
      .el-pagination__editor .el-input__inner {
        color: #3e7fee;
      }
    }
  }
}
</style>
