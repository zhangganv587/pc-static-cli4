<template>
  <div class="wy-table">
    <el-table
      ref="wyTableRef"
      v-loading="loading"
      v-bind="$attrs"
      :data="data"
      :span-method="merge ? mergeMethod : spanMethod"
      v-on="tableListeners"
    >
      <wy-column
        v-for="(item, index) in column"
        :key="index"
        v-bind="$attrs"
        :column="item"
      />
    </el-table>
    <div v-if="showPagination && total > pageSize" :class="paginationClass">
      <el-pagination
        class="wy-table-pagination"
        v-bind="$attrs"
        background
        :current-page="currentPage"
        :total="total"
        :style="{ 'margin-bottom': paginationTop, float: paginationAlign }"
        v-on="pageListeners"
        @current-change="currentChangePage"
      />
    </div>
  </div>
</template>

<script>
/* eslint-disable */
  import WyColumn from './wy-column';
  import { only } from './utils';
  export default {
    components: {
      WyColumn
    },
    props: {
      column: Array,
      data: Array,
      spanMethod: Function,
      searchParams: {
        type: Object,
        default: () => {}
      },
      showPagination: {
        type: Boolean,
        default: false
      },
      paginationTop: {
        type: String,
        default: '10px'
      },
      paginationAlign: {
        type: String,
        default: 'right'
      },
      tableHeight: {
        type: Number,
        default: 0
      },
      heightFlag: {
        type: Boolean,
        default: true
      },
      total: Number,
      pageSize: Number,
      currentChangePage: {
        type: Function,
        default: () => {}
      },
      currentPage: Number,
      paginationClass: String,
      merge: Array,
      loading: {
        type: Boolean,
        default: false
      }
    },
    data() {
      const tableEvent = 'select select-all selection-change cell-mouse-enter cell-mouse-leave cell-click cell-dblclick row-click row-contextmenu row-dblclick header-contextmenu sort-change header-click current-change';
      const tableListeners = only(this.$listeners, tableEvent);
      const pageEvent = 'size-change prev-click next-click';
      const pageListeners = only(this.$listeners, pageEvent);

      return {
        mergeLine: {},
        mergeIndex: {},
        tableListeners,
        pageListeners,
        curHeight: 0
      };
    },
    computed: {
      dataLength() {
        return this.data.length;
      }
    },
    watch: {
      merge() {
        this.getMergeArr(this.data, this.merge);
      },
      dataLength() {
        this.getMergeArr(this.data, this.merge);
      }
    },
    created() {
      if (this.heightFlag) {
      // this.curHeight = beforeHeight(423 - this.tableHeight);
      } else {
        this.curHeight = null;
      }
      this.getMergeArr(this.data, this.merge);
    },
    methods: {
      clearSelection() {
        this.$refs.wyTableRef.clearSelection();
      },
      toggleRowSelection(row, selected) {
        this.$refs.wyTableRef.toggleRowSelection(row, selected);
      },
      toggleAllSelection() {
        this.$refs.wyTableRef.toggleAllSelection();
      },
      toggleRowExpansion(row, expanded) {
        this.$refs.wyTableRef.toggleRowExpansion(row, expanded);
      },
      setCurrentRow(row) {
        this.$refs.wyTableRef.setCurrentRow(row);
      },
      clearSort() {
        this.$refs.wyTableRef.clearSort();
      },
      clearFilter(columnKey) {
        this.$refs.wyTableRef.clearFilter(columnKey);
      },
      doLayout() {
        this.$refs.wyTableRef.doLayout();
      },
      sort(prop, order) {
        this.$refs.wyTableRef.sort(prop, order);
      },
      getMergeArr(tableData, merge) {
        if (!merge) { return; }
        this.mergeLine = {};
        this.mergeIndex = {};
        merge.forEach((item, k) => {
          tableData.forEach((data, i) => {
            if (i === 0) {
              this.mergeIndex[item] = this.mergeIndex[item] || [];
              this.mergeIndex[item].push(1);
              this.mergeLine[item] = 0;
            } else {
              if (data[item] === tableData[i - 1][item]) {
                this.mergeIndex[item][this.mergeLine[item]] += 1;
                this.mergeIndex[item].push(0);
              } else {
                this.mergeIndex[item].push(1);
                this.mergeLine[item] = i;
              }
            }
          });
        });
      },
      mergeMethod({ row, column, rowIndex, columnIndex }) {
        const index = this.merge.indexOf(column.property);
        if (index > -1) {
          const _row = this.mergeIndex[this.merge[index]][rowIndex];
          const _col = _row > 0 ? 1 : 0;
          return {
            rowspan: _row,
            colspan: _col
          };
        }
      },
      refreshCellData(row, index) {
        const newData = [];
        this.data.forEach((v, i) => {
          let vData = {};
          if (i === index) {
            vData = row;
          } else {
            vData = v;
          }
          newData.push(vData);
        });
        this.$set(this, 'data', newData);
      }
    }
  };

</script>
