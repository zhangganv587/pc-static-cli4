<!--
 * @Author: 张淦
 * @Date: 2019-11-28 11:12:48
 * @LastEditors: 张淦
 * @Description: 商户2.0
 * @FilePath: /gpay-ops-static/src/components/base/we-pagination.vue
 -->
<!-- 在ele分页按钮的基础上,在做一层分页的封装 -->
<template>
  <el-pagination
    v-if="total >= 1"
    :current-page="currentPage"
    :page-sizes="pageSizes"
    :page-size="pageSize"
    :layout="layout"
    :total="total"
    @current-change="(page) => currentChange({ pageNumber: page })"
    @size-change="(size) => currentChange({ pageSize: size })"
  />
</template>

<script>
export default {
  components: {},
  props: {
    pageSize: {
      type: Number,
      default: 10,
    },
    total: {
      type: Number,
      default() {
        return 0;
      },
    },
    currentPage: {
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
  },
};
</script>
