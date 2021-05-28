/*
 * @Description form props
 * @Author wangjun
 * @Date 2020-07-07 13:47:31
 * @LastEditTime 2021-03-22 17:09:54
 * @LastEditors
 */

export const formProps = {
  size: String,
  showResetBtn: {
    type: Boolean,
    default: false,
  },
  showExportBtn: {
    type: Boolean,
    default: false,
  },
  inline: {
    type: Boolean,
    default: false,
  },
  submitHandler: Function,
  submitLoading: {
    type: Boolean,
    default: false,
  },
  submitBtnText: {
    type: String,
    default: "查询",
  },
  resetBtnText: {
    type: String,
    default: "清空",
  },
  exportBtnText: {
    type: String,
    default: "导出",
  },
  paramsHandler: Function,
  submitBtnCallback: Function,
  resetBtnCallback: Function,
  exportUrl: String, // 导出url
  exportFileName: String, // 导出文件名
  // exportBtnCallback: Function,
  forms: {
    type: Array,
    required: true,
    label: String,
    prop: {
      type: [String, Array],
      required: true,
    },
    uuid: String,
    itemType: {
      type: String,
      default: "input",
      validator: itemTypeValidator,
    },
    dataRangeTime: Array,
    options: Array,
    selectFetch: Function,
    selectResultField: String,
    selectResultHandler: Function,
    selectUrl: String,
    selectMethod: String,
    valueKey: String,
    labelKey: String,
    format: Function,
    selectParams: {
      type: Object,
      default: () => {
        return {};
      },
    },
    rules: Array,
    pickerOptions: Object,
  },
};

function itemTypeValidator(value) {
  const methodTypes = [
    "input",
    "autocomplete",
    "select",
    "date",
    "daterange",
    "monthrange",
    "selectInput",
  ];
  const valid = methodTypes.indexOf(value.toLowerCase()) !== -1;
  if (!valid) {
    throw new Error(
      "ItemType must be one of ['input', 'autocomplete', 'select', 'date', 'daterange', 'monthrange' 'selectInput']"
    );
  }
  return valid;
}
