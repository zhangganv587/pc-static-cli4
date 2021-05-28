<!--
 * @Description: wy-form-table
 * @Author: wangjun
 * @Date: 2020-08-19 18:56:04
 * @LastEditTime: 2020-08-19 19:28:09
 * @LastEditors: Please set LastEditors
-->

# wy-form-table

## 引入

在`main.js`引入组件

```js
import Vue from 'vue';
import WyFormTable from '@/components/wy-form-table';
import axios from 'axios';

Vue.use(WyFormTable, {
  axios
})

```

页面中直接使用

```vue
<template>
  <wy-form-table
    ref="wyTableRef"
    url="/api/pharmacy/error/page"
    urlMethod="post"
    :formOptions="formOptions"
    :column="column"
    :paramsHandler="paramsHandler"
    layout="total, sizes, prev, pager, next, jumper"
    :page-sizes="[10, 20, 50]"
    showPagination
    paginationClass='fix-pagination'
    border>
    <template slot-scope="slotProps">

    </template>
  </wy-form-table>
</template>

<script>
export default {
  data () {
    return {
      formOptions: {
        inline: true,
        size: 'small',
        submitBtnText: '查询',
        showResetBtn: true,
        showExportBtn: true,
        submitBtnCallback: this.submitBtnCallback,
        resetBtnCallback: this.resetBtnCallback,
        exportBtnCallback: this.exportBtnCallback,
        forms: [
          {
            prop: 'areaCode',
            itemType: 'cascader',
            attrs: {
              width: '160',
              placeholder: '全国',
              options: [],
              props: { checkStrictly: true }
            }
          },
          {
            prop: ['gmtCreatedStart', 'gmtCreatedEnd'],
            itemType: 'daterange',
            attrs: {
              width: '255',
              rangeSeparator: '～',
              clearable: false,
              startPlaceholder: '开始日期',
              endPlaceholder: '结束日期'
            },
            dataRangeTime: defaultDate
          },
          {
            prop: 'hospitalId',
            itemType: 'select',
            attrs: {
              width: '160',
              placeholder: '请选择医疗机构',
              remoteMethod: this.handleFetchSuggestions,
              remote: true,
              filterable: true,
              clearable: true
            },
            options: []
          },
          {
            prop: 'errorLevel',
            itemType: 'select',
            attrs: {
              width: '120',
              clearable: true,
              placeholder: '规则级别'
            },
            options: [
              { value: 'A', label: 'A类' },
              { value: 'B', label: 'B类' },
              { value: 'C', label: 'C类' }
            ],
            onEvents: {
              change: this.handleChangeRule
            }
          },
          {
            prop: 'ruleCode',
            itemType: 'select',
            attrs: {
              width: '120',
              clearable: true,
              placeholder: '规则名称'
            },
            options: []
          },
          {
            prop: 'fellowStatus',
            itemType: 'select',
            attrs: {
              width: '120',
              clearable: true,
              placeholder: '是否遵从'
            },
            options: [
              { value: 1, label: '是' },
              { value: 0, label: '否' }
            ]
          },
          {
            prop: 'patientName',
            itemType: 'input',
            attrs: {
              placeholder: '请输入患者姓名'
            }
          },
          {
            prop: 'callSerialNo',
            itemType: 'input',
            attrs: {
              width: '120',
              placeholder: '调用流水号'
            }
          }
        ]
      },
      column: [
        { label: '序号', type: 'index', index: this.indexMethod, width: 55 },
        { prop: 'hospitalName', label: '机构名称', width: 120, showOverflowTooltip: true },
        {
          prop: 'gmtCreated',
          label: '时间',
          width: 180,
          showOverflowTooltip: true,
          render: (h, scope) => {
            return <span>
              {`${moment(scope.row.gmtCreated).format('YYYY-MM-DD HH:mm:ss')}`}
            </span>;
          }
        }
      ]
    };
  },
  ...
}
</script>

```
