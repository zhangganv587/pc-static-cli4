<!--
 * @Description: API 文档
 * @Author: wangjun
 * @Date: 2020-08-19 18:57:26
 * @LastEditTime: 2020-09-02 19:21:38
 * @LastEditors: Please set LastEditors
-->

# API 文档

## 属性

| 参数 | 说明 | 类型 | 可选值 | 默认值 |
| --- |------|:----:|-----|:-----:|
| fetch | 封装好的获取数据的函数，返回一个promise，会获得搜索条件对象作为参数。若提供该属性，则不会再调用 url属性获取数据 | function | - | - |
| url | 后端数据接口 | string | - | - |
| urlMethod| 接口请求方式 | string | get, post, delete, put | get |
| auto-load | 是否默认加载数据 | boolean | true, false | true |
| headers | 请求头信息 | object | - | - |
| list-field | 接口返回值对应数据的字段值 | string | - | data.list |
| total-field | 接口返回值对应数据总数的字段值 | string | - | data.total |
| params | 搜索参数 | object | - | - |
| paramsHandler | 搜索参数操作方法 | function | 函数argument为params | 必须return修改后的params |
| form-options | form表单设置(见下方[**Form Option 属性**](#form-option-属性)) | object | - | - |
| data-handler | 数组数据的 map 处理函数 | function | - | - |
| columns | table column配置对象的数组。具体配置见下面[**Table column 属性**](#table-column-属性) | array | - | - |
| showPagination | 是否显示分页组件，如设为false，查询时不传分页参数 | boolean | true, false | true |
| page-sizes | 每页显示个数的控件选项 | array | - | [20, 50, 100] |
| layout | 分页控件的结构，每个类型用逗号分隔 | string | sizes, prev, pager, next, jumper, ->, total, slot | total, prev, pager, next, jumper, sizes |

注：更多属性，请参考 VIT [Table 组件的文档](http://vit.hp.guahao-inc.com/component/table)。

理论支持的`VIT Table`所有属性

### Table column 属性

| 参数 | 说明 | 类型 | 可选值 | 默认值 |
| --- |------|:----:|-----|:-----:|
| prop | 展示字段的字段值 | string | - | - |
| label | 列名 | string | - | - |
| width| 列宽 | number | - | 140 |
| minWidth | 最小列宽 | number | - | - |
| filter | 过滤器名（只有配置在全局的filter才有效） | string | - | - |
| render | 处理数据的函数，接收行数据作为参数 | function | - | - |
| slotName | 使用 slot 标记的代码块的 slot 属性值 | string | - | - |
| type | `0.4.28`后支持，Element UI Table支持的一个属性，借用这个属性来切换是否使用本组件column内的插槽内容，当本属性没有给值时，本组件保持和之前版本一样的兼容性，组件会接管column数组中的定义并定义Element UI Table Column，只有指定的属性才会给予，并且会实现组件中给予的`render`和`formatter`等功能。如果该属性一旦有给值时，`column`定义的所有属性都会传递给Element UI Table Column，本组件也不会对column内容进行处理，相应的处理能力也交给Element UI Table本身，通过这种方式，也可以支持Element UI Table中的多选列，Index列等，设置为`default`也即为Element UI Table的缺省模式，会从数据对象中读取`prop`属性，也会受到`filter`的过滤，只不过处理都是Element UI Table来进行了。 | string | default/selection/index/expand |  |

注：更多属性，请参考 VIT [Table 组件的文档](http://vit.hp.guahao-inc.com/component/table)。

注：关于`formatter`属性，如果定义了`renderer`或者`filter`的时候，`formatter`不起作用。

### Form Option 属性

| 参数 | 说明 | 类型 | 可选值 | 默认值 |
| --- |------|:----:|-----|:-----:|
| forms | form表单配置对象数组。详情见[**Form Item 属性**](#form-item-属性) | array[object] | - | - |
| size | 全局的表单尺寸 | string | large/small/mini | mini |
| showResetBtn | 是否显示'重置'按钮 | boolean | - | false
| showExportBtn | 是否显示'导出'按钮 | boolean | - | false
| inline | 行内表单模式 | boolean | - | false |
submitHandler | 查询按钮的click处理函数，接收form表单对象数据作为第一个参数 | function | - | - |
| submitLoading | 查询按钮的加载中状态 | boolean | - | - |
| submitBtnText | 查询按钮的文本 | string | - | 查询 |
| resetBtnText | 重置按钮的文本 | string | - | 重置 |
| submitBtnCallback | 确认按钮点击事件的回调函数， 在点击搜索之后执行 | function | - | - |
| resetBtnCallback | 重置按钮点击事件的回调函数，在重置了搜索条件之后执行 | function | a | - |
| exportBtnText | 导出按钮的文本 | string | - | 导出 |
| exportBtnCallback | 导出按钮点击事件的回调函数，在导出之后执行 | function | 函数argument为表单实例 | - |

### Form Item 属性

| 参数 | 说明 | 类型 | 可选值 | 默认值 |
| --- |------|:----:|-----|:-----:|
| label | form表单标签 | string | - | - |
| prop | form表单属性key值 | string/array(daterange类型 开始/结束时间) | - | - |
| itemType | 表单类型，目前支持input/select/date/daterange/monthrange/autocomplete/cascader八种表单 | string | input/select/date/daterange/monthrange/autocomplete/cascader/selectInput | - |
| size | 表单尺寸 | string | large/small/mini | mini |
| attrs | 表单元素属性 | 支持对应VIT组件属性 | - | - |
| onEvents | 表单元素事件 | 支持对应VIT组件事件 | - | - |
| options | 填充select下拉option的数组数据 | [string]/[object] | - | - |
| format | 提供一个函数对form表单的结果进行处理，这个函数接收两个参数：form 表单的值 和 表单的 key（即 prop），函数需要将处理后的结果return出来 | function | - | - |
| dataRangeTime | 当前时间日期选择器特有的选项，对 daterange 有效 | array | - | - |

## 函数

| 方法名 | 说明 | 参数 |
| ----- |-----|-----|
| searchHandler | 重新搜索数据，参数1表示是否重置分页为1，默认为true，参数2表示是否重置分页页数为10，默认为false。使用方法`this.$refs.wyTableRef.searchHandler(false, false)`（例中`wy-form-table`的`ref`属性为`wyTableRef`） | resetPageNumber, resetPageSize |

## Slots

待补充

## Events

支持 table 所有事件
