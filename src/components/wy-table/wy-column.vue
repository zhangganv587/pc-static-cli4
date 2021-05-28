<!--
 * @Description:
 * @Author: wangjun
 * @Date: 2020-07-16 17:59:25
 * @LastEditTime: 2021-03-08 11:03:18
 * @LastEditors: Please set LastEditors
-->
<template>
  <el-table-column
    v-bind="$attrs"
    :prop="column.prop"
    :label="column.label"
    :type="column.type"
    :index="column.index"
    :column-key="column.columnKey"
    :width="column.width"
    :min-width="column.minWidth"
    :fixed="column.fixed"
    :render-header="column.renderHeader"
    :sortable="column.sortable || false"
    :sort-method="column.sortMethod"
    :sort-by="column.sortBy"
    :sort-orders="column.sortOrders"
    :resizable="column.resizable || true"
    :formatter="column.formatter"
    :show-overflow-tooltip="column.showOverflowTooltip || false"
    :align="column.align || align || 'left'"
    :header-align="
      column.headerAlign || headerAlign || column.align || align || 'left'
    "
    :class-name="column.className"
    :label-class-name="column.labelClassName"
    :selectable="column.selectable"
    :reserve-selection="column.reserveSelection || false"
    :filters="column.filters"
    :filter-placement="column.filterPlacement"
    :filter-multiple="column.filterMultiple"
    :filter-method="column.filterMethod"
    :filtered-value="column.filteredValue"
    v-on="$listeners"
  >
    <template slot="header" slot-scope="scope">
      <wy-render
        v-if="column.renderHeader"
        :scope="scope"
        :render="column.renderHeader"
      />
      <span v-else>{{ scope.column.label }}</span>
    </template>

    <template slot-scope="scope">
      <wy-render :scope="scope" :render="column.render" />
    </template>

    <template v-if="column.children">
      <wy-column
        v-for="(col, index) in column.children"
        :key="index"
        :column="col"
      />
    </template>
  </el-table-column>
</template>

<script>
/* eslint-disable */
  import WyRender from './wy-render';
  import forced from './forced.js';
  export default {
    name: 'WyColumn',
    components: {
      WyRender
    },
    props: {
      column: Object,
      headerAlign: String,
      align: String
    },
    watch: {
      column: {
        handler() {
          this.setColumn();
        },
        immediate: true
      }
    },
    methods: {
      setColumn() {
        if (this.column.type) {
          this.column.renderHeader = forced[this.column.type].renderHeader;
          this.column.render = this.column.render || forced[this.column.type].renderCell;
        }
        if (this.column.formatter) {
          this.column.render = (h, scope) => {
            return <span>{ scope.column.formatter(scope.row, scope.column, scope.row, scope.$index) }</span>;
          };
        }
      }
    }
  };
</script>
