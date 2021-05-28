<!--
 * @Description: form table
 * @Author: wangjun
 * @Date: 2020-07-07 14:19:39
 * @LastEditTime: 2021-04-13 16:39:52
 * @LastEditors: zhanggan
-->
<template>
  <div>
    <wy-form
      v-if="formOptions"
      ref="wyFormRef"
      :forms="formOptions.forms"
      :inline="formOptions.inline"
      :submit-handler="searchHandler"
      :submit-loading="loading"
      :show-export-btn="formOptions.showExportBtn"
      :show-reset-btn="formOptions.showResetBtn"
      :submit-btn-text="formOptions.submitBtnText"
      :reset-btn-text="formOptions.resetBtnText"
      :params-handler="paramsHandler"
      :submit-btn-callback="formOptions.submitBtnCallback"
      :reset-btn-callback="formOptions.resetBtnCallback"
      :export-url="formOptions.exportUrl"
      :export-file-name="formOptions.exportFileName"
      :export-btn-callback="formOptions.exportBtnCallback"
    />
    <slot :props="slotProps.props" />
    <wy-table
      v-bind="$attrs"
      :data="tableData"
      :column="column"
      :loading="loading"
      :show-pagination="showPagination"
      :current-change-page="handleCurrentChange"
      :current-page="pagination.pageNumber"
      :page-sizes="pageSizes"
      :page-size="pagination.pageSize"
      :layout="layout"
      :total="total"
      :pagination-class="paginationClass"
      v-on="$listeners"
      @size-change="handleSizeChange"
    />
  </div>
</template>

<script>
/* eslint-disable */
  import WyTable from '../wy-table/wy-table';
  import WyForm from '../wy-form/form';

  export default {
    name: '',
    components: {
      WyTable,
      WyForm
    },
    props: {
      formOptions: {
        type: Object
      },
      column: Array,
      spanMethod: Function,
      fetch: {
        type: Function
      },
      searchParams: {
        type: Object,
        default: () => {
          return {};
        }
      },
      url: {
        type: String
      },
      urlMethod: {
        type: String,
        default: 'post',
        validator: value => {
          const methodTypes = ['get', 'post', 'put', 'delete'];
          return methodTypes.indexOf(value.toLowerCase()) !== -1;
        }
      },
      headers: {
        type: Object,
        default: () => {
          return {};
        }
      },
      resultField: {
        type: Array,
        default: () => ['dataList']
      },
      totalField: {
        type: Array,
        default: () => ['totalNum']
      },
      dataHandler: {
        type: Function
      },
      paramsHandler: {
        type: Function
      },
      showPagination: {
        type: Boolean,
        default: false
      },
      pageSizes: {
        type: Array,
        default: () => {
          return [10, 20, 50, 100];
        }
      },
      pageSize: {
        type: Number,
        default: 10
      },
      layout: {
        type: String,
        default: 'total, prev, pager, next, jumper, sizes'
      },
      pageNumberKey: {
        type: String,
        default: 'pageIndex'
      },
      pageSizeKey: {
        type: String,
        default: 'pageSize'
      },
      paginationTop: {
        type: String,
        default: '15px'
      },
      paginationAlign: {
        type: String,
        default: 'right'
      },
      paginationClass: String,
      merge: Array
    },
    data() {
      const _this = this;
      return {
        pagination: {
          pageNumber: 1,
          pageSize: (() => {
            const { pageSizes } = _this;
            if (pageSizes.length > 0) {
              return pageSizes[0];
            }
            return 10;
          })()
        },
        total: 0,
        loading: false,
        slotProps: {
          props: {}
        },
        tableData: []
      };
    },

    computed: {},
    watch: {},
    created() {

    },
    mounted() {
      const { autoLoad, formOptions, searchParams } = this;
      if (autoLoad) {
        if (formOptions) {
          this.$refs.wyFormRef.getParams((error, formParams) => {
            if (!error) {
              this.fetchHandler(Object.assign(formParams, searchParams));
            }
          });
        } else {
          this.fetchHandler(searchParams);
        }
      }
    },
    methods: {
      setParam(property, value) {
        this.$refs.wyFormRef && this.$refs.wyFormRef.setParam(property, value);
      },
      handleSizeChange(size) {
        if (!size) { return; }
        this.pagination.pageSize = size;
        this.searchHandler();
      },
      handleCurrentChange(pageNumber) {
        if (!pageNumber) { return; }
        this.pagination.pageNumber = pageNumber;
        this.searchHandler(false);
      },
      searchHandler(resetpageNumber = true, resetpageSize = false) {
        this.$refs.wyFormRef.$children[0].validate(valid => {
          if (valid) {
            if (resetpageNumber) {
              this.pagination.pageNumber = 1;
            }
            if (resetpageSize) {
              this.pagination.pageSize = 10;
            }
            const params = this.$refs.wyFormRef.params;
            if (this.paramsHandler) {
              const resetParams = this.paramsHandler(JSON.parse(JSON.stringify(params)));
              this.fetchHandler(resetParams);
            } else {
              this.fetchHandler(params);
            }
          }
        });
      },
      fetchHandler(formParams = {}) {
        this.loading = true;
        let {
          fetch, urlMethod, url, $WYOPITONS, headers,
          resultField, pageNumberKey, pageSizeKey,
          totalField, searchParams, showPagination,
          pagination
        } = this;
        searchParams = JSON.parse(JSON.stringify(Object.assign(searchParams, formParams)));
        if (showPagination) {
          searchParams = Object.assign(searchParams, {
            [pageNumberKey]: pagination.pageNumber,
            [pageSizeKey]: pagination.pageSize
          });
        }
        let requestObject = null;
        if (fetch) {
          requestObject = fetch(searchParams);
        } else {
          $WYOPITONS.axios.interceptors.request.use(
            config => {
              Object.keys(headers).forEach(v => {
                config.headers[v] = headers[v];
              });
              return config;
            },
            error => {
              return Promise.reject(error);
            }
          );
          urlMethod = urlMethod.toLowerCase();
          if (urlMethod === 'get') {
            requestObject = $WYOPITONS.axios[urlMethod](url, { searchParams });
          } else {
            requestObject = $WYOPITONS.axios[urlMethod](url, searchParams);
          }
        }
        requestObject.then(response => {
          let result = response;
          this.$set(this.slotProps, 'props', response);
          this.getResponseData && this.getResponseData(response);
          if (response && !(response instanceof Array)) {
            if (resultField && resultField.length) {
              resultField.forEach(vv => {
                result = result[vv];
              });
            } else {
              result = response[resultField];
            }
          }

          if (!result || !(result instanceof Array)) {
            throw new Error(`接口返回字段:${resultField} 不是数组`);
            /* eslint-disable */
            this.loading = false
            return false
            /* eslint-disable */
          }
        if (this.dataHandler) {
          this.tableData = result.map(this.dataHandler)
        } else {
          this.tableData = result
        }
        let totalValue = response
        if (Object.prototype.toString.call(response) === '[object Array]') {
          totalValue = response.length
        } else if (typeof response === 'object') {
          if (totalField && totalField.length) {
            totalField.forEach(vv => {
              totalValue = totalValue[vv]
            })
          } else {
            totalValue = response[totalField]
          }
        } else {
          totalValue = 0
        }
        this.total = totalValue
        this.loading = false
      }).catch(error => {
        this.loading = false
      })
    }
  }
}
</script>
