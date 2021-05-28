/*
 * @Author: 张淦
 * @Date: 2019-12-09 16:59:16
 * @LastEditors: zhanggan
 * @Description: 商户2.0
 * @FilePath: /gpay-ops-static/src/mixins/tableFormMixin.js
 */
export default {
  data() {
    return {
      // 分页
      pagination: {
        pageSize: 10,
        pageIndex: 1,
        totalNum: 0,
      },

      // table
      tableData: [],

      // dialog
      row: {},
    };
  },
  computed: {
    loading() {
      return this.$store.state.effectLoading[this.queryUrl];
    },
  },
  methods: {
    handleSearch({ data }) {
      if (data && data.dataList) {
        this.tableData = data.dataList;
        this.pagination.pageIndex = data.pageNum;
        this.pagination.pageSize = data.pageSize;
        this.pagination.totalNum = data.totalNum;
        // 当需要接口返回所有数据的时候，将数据赋值给totalFetchData
        if (this.totalFetchData) {
          this.totalFetchData = data;
        }
        if (this.tableDataList && data.pageDTO) {
          this.tableDataList = data.pageDTO.dataList;
          this.pagination.pageIndex = data.pageDTO.pageNum;
          this.pagination.pageSize = data.pageDTO.pageSize;
          this.pagination.totalNum = data.pageDTO.totalNum;
        } else {
          this.tableDataList = [];
        }
      } else {
        if (this.totalFetchData) {
          this.totalFetchData = {
            gpayPaySum: 0,
            gpayPayAmount: 0,
            gpayRefundSum: 0,
            gpayRefundAmount: 0,
            channelPaySum: 0,
            channelPayAmount: 0,
            channelRefundSum: 0,
            channelRefundAmount: 0,
          };
          this.tableDataList = [];
        } else {
          this.tableData = [];
        }
      }
    },

    currentChange(val) {
      this.pagination = { ...this.pagination, ...val };
    },

    handleInfo(row, dialogId) {
      this.row = row;
      this.$eventBus.$emit("dialog-visible", {
        visible: true,
        dialogId,
      });
    },
  },
};
