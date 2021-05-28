<!--
 * @Description:
 * @Author: wangjun
 * @Date: 2020-07-07 13:42:55
 * @LastEditTime: 2021-04-01 10:56:04
 * @LastEditors: Please set LastEditors
-->
<template>
  <el-form
    ref="form"
    class="wy-form"
    :model="params"
    :size="size"
    :inline="inline"
  >
    <el-form-item
      v-for="(form, index) in forms"
      :key="index"
      :prop="form.prop"
      :label="form.label"
      :rules="form.rules || []"
    >
      <el-input
        v-if="form.itemType === 'input' || form.itemType === undefined"
        v-model="params[form.modelValue]"
        v-bind="form.attrs"
        v-on="form.onEvents"
      />
      <el-autocomplete
        v-if="form.itemType === 'autocomplete' || form.itemType === undefined"
        v-model="params[form.modelValue]"
        v-bind="form.attrs"
        v-on="form.onEvents"
      />
      <el-cascader
        v-if="form.itemType === 'cascader' || form.itemType === undefined"
        v-model="params[form.modelValue]"
        v-bind="form.attrs"
        v-on="form.onEvents"
      />
      <el-select
        v-else-if="form.itemType === 'select'"
        v-model="params[form.modelValue]"
        v-bind="form.attrs"
        v-on="form.onEvents"
      >
        <el-option
          v-for="(option, optionIndex) in form.options"
          :key="optionIndex + '_local'"
          :value="
            typeof option === 'object'
              ? option[form.valueKey || 'value']
              : option
          "
          :label="
            typeof option === 'object'
              ? option[form.labelKey || 'label']
              : option
          "
        />
        <el-option
          v-for="(op, opIndex) in selectOptions[selectOptionPrefix + index]"
          :key="opIndex + '_remote'"
          :value="typeof op === 'object' ? op[form.valueKey || 'value'] : op"
          :label="typeof op === 'object' ? op[form.labelKey || 'label'] : op"
        />
      </el-select>
      <el-date-picker
        v-else-if="form.itemType === 'date' || form.itemType === 'month'"
        v-model="params[form.modelValue]"
        :type="form.itemType"
        v-bind="form.attrs"
        v-on="form.onEvents"
      />
      <el-date-picker
        v-else-if="form.itemType === 'daterange'"
        v-model="params[form.modelValue]"
        type="daterange"
        v-bind="form.attrs"
        v-on="form.onEvents"
      />
      <template v-else-if="form.itemType === 'selectInput'">
        <el-input
          :ref="'selectInput_input_Ref' + index"
          v-model="selectInputValue[form.uuid]"
          v-bind="form.attrs"
          @change="(v) => handleChangeInputValue(v, form.uuid)"
          v-on="form.onEvents"
        >
          <template slot="prepend">
            <el-select
              :ref="'selectInput_select_Ref' + index"
              v-model="selectInputType[form.uuid]"
              width="100"
              @change="(v) => handleChangeSelect(v, form.uuid, form.options)"
            >
              <el-option
                v-for="(option, optionIndex) in form.options"
                :key="optionIndex + '_local'"
                :value="
                  typeof option === 'object'
                    ? option[form.valueKey || 'value']
                    : option
                "
                :label="
                  typeof option === 'object'
                    ? option[form.labelKey || 'label']
                    : option
                "
              />
            </el-select>
          </template>
        </el-input>
      </template>
    </el-form-item>
    <el-form-item label="">
      <el-button type="primary" @click="searchHandler">
        {{ submitBtnText }}
      </el-button>
      <el-button
        v-if="showResetBtn"
        type="primary"
        :plain="true"
        @click="resetForm"
      >
        {{ resetBtnText }}
      </el-button>
    </el-form-item>
    <el-button
      v-if="showExportBtn"
      type="primary"
      :loading="exportLoading"
      style="display: block; margin-bottom: 15px"
      @click="exportForm"
    >
      {{ exportBtnText }}
    </el-button>
  </el-form>
</template>

<script>
import { formProps } from "./props";
import moment from "moment";

export default {
  name: "WyForm",
  props: formProps,
  data() {
    const { forms } = this.$props;
    const datePrefix = "daterange-prefix";
    const selectOptionPrefix = "select-option-prefix";
    const dataObj = {
      selectOptions: {},
    };
    const params = {};
    const format = {};
    const selectInputType = {};
    const selectInputValue = {};
    forms.forEach((v, i) => {
      const propType = typeof v.prop;
      if (propType === "string") {
        v.modelValue = v.prop;
        params[v.prop] = "";
        if (v.format) {
          format[v.prop] = v.format;
        }
      }
      if (v.itemType === "selectInput") {
        const dataKey = "selectInput" + i;
        dataObj.selectOptions[dataKey] = v.options;
        selectInputType[v.uuid] = v.options[0].value;
        selectInputValue[v.uuid] = "";
      }
      if (v.itemType === "select" && (v.selectFetch || v.selectUrl)) {
        const dataKey = selectOptionPrefix + i;
        dataObj.selectOptions[dataKey] = [];
        const { $WYOPITONS } = this;
        if (!v.selectMethod) {
          v.selectMethod = "get";
        }
        this.getRemoteData({
          fetch: v.selectFetch
            ? v.selectFetch
            : () => {
                return $WYOPITONS.axios[v.selectMethod](
                  v.selectUrl,
                  v.selectMethod.toLowerCase() === "get"
                    ? { params: v.selectParams }
                    : v.selectParams
                );
              },
          dataKey,
          resultField: v.selectResultField || "result",
          resultHandler: v.selectResultHandler,
        });
      }
    });

    return {
      exportLoading: false,
      params,
      datePrefix,
      selectOptionPrefix,
      selectInputType,
      ...dataObj,
      format,
      selectInputValue,
    };
  },
  computed: {
    itemStyle() {
      const { itemWidth } = this;
      if (itemWidth) {
        return `width: ${itemWidth}px;`;
      }
      return "";
    },
  },
  created() {},
  mounted() {},
  methods: {
    isArray(value) {
      return (
        typeof value === "object" &&
        Object.prototype.toString.call(value) === "[object Array]"
      );
    },
    formProps(form, index) {
      let props = form.prop;
      if (form.itemType === "daterange" || form.itemType === "monthrange") {
        props = this.datePrefix + index;
      } else if (form.itemType === "selectInput") {
        props = form.prop[0];
      }
      return props;
    },
    setParam(property, value) {
      this.$set(this.params, property, value);
    },
    searchHandler() {
      this.getParams((error, params) => {
        if (!error) {
          const { submitHandler, submitBtnCallback } = this;
          if (submitHandler) {
            submitHandler(params);
            submitBtnCallback && submitBtnCallback(params);
          } else {
            throw new Error("submitHandler参数为必须!");
          }
        }
      });
    },
    handleChangeInputValue(v, i) {
      this.params[this.selectInputType[i]] = v;
    },
    handleChangeSelect(v, i, options) {
      options.forEach((v) => {
        if (this.selectInputType[i] !== v.value) {
          this.params[v.value] = "";
        }
      });
      this.selectInputValue[i] = "";
    },
    getParams(callback) {
      this.$refs.form.validate((valid) => {
        if (valid) {
          const { params, datePrefix, format } = this;
          const formattedForm = {};
          Object.keys(params).forEach((v) => {
            if (v.indexOf(datePrefix) === -1) {
              formattedForm[v] = format[v]
                ? format[v](params[v], v)
                : params[v];
            }
          });
          if (callback) {
            callback(null, formattedForm);
          }
        } else {
          if (callback) {
            callback(new Error());
          }
        }
      });
    },
    resetForm() {
      // this.$refs.form.resetFields();
      const { resetBtnCallback } = this;
      if (resetBtnCallback) {
        resetBtnCallback(this);
      }
    },
    exportForm() {
      const { exportUrl, exportFileName, params, paramsHandler } = this;
      this.$notify({
        title: "导出提示",
        message: this.$createElement(
          "i",
          { style: "color: #3E7FEE" },
          "最多只能导出10000条数据"
        ),
        size: "small",
      });
      this.exportLoading = true;
      if (exportUrl) {
        let resetParams = params;
        if (paramsHandler) {
          resetParams = this.paramsHandler(JSON.parse(JSON.stringify(params)));
        }
        this.$WYOPITONS
          .axios({
            method: "post",
            data: resetParams,
            url: exportUrl,
            responseType: "blob",
          })
          .then((blob) => {
            this.exportLoading = false;
            // 获取文件后缀
            const fileExt = blob.type && blob.type.split("/")[1];

            // 参考 https://blog.csdn.net/mobius_z/article/details/82790327
            const downloadElement = document.createElement("a");
            const href = window.URL.createObjectURL(blob);

            // 创建下载的链接
            downloadElement.href = href;

            // 下载后文件名
            downloadElement.download = `${exportFileName}.${fileExt || "xls"}`;
            document.body.appendChild(downloadElement);

            // 点击下载
            downloadElement.click();

            // 下载完成移除元素
            document.body.removeChild(downloadElement);
            window.URL.revokeObjectURL(href);
          })
          .catch(() => {
            this.exportLoading = false;
          });
      }
    },
    changeDate(date, startDate, endDate) {
      if (date === null) {
        this.params[startDate] = "";
        this.params[endDate] = "";
        return;
      }
      this.params[startDate] = moment(date[0]).format("YYYY-MM-DD");
      this.params[endDate] = moment(date[1]).format("YYYY-MM-DD");
    },
    changeMonthDate(date, startDate, endDate) {
      if (date === null) {
        this.params[startDate] = "";
        this.params[endDate] = "";
        return;
      }
      this.params[startDate] = date[0];
      this.params[endDate] = date[1];
    },
    getRemoteData({ fetch, dataKey, resultField, resultHandler }) {
      fetch().then((response) => {
        let result = response;
        if (typeof response === "object" && !this.isArray(response)) {
          if (resultField.indexOf(".") !== -1) {
            resultField.split(".").forEach((vv) => {
              result = result[vv];
            });
          } else {
            result = response[resultField];
          }
        }
        if (!result || !(result instanceof Array)) {
          console.warn(`接口返回的字段:${resultField} 不是数组`);
        }
        if (resultHandler) {
          this.selectOptions[dataKey] = result.map(resultHandler);
        } else {
          this.selectOptions[dataKey] = result;
        }
      });
    },
  },
};
</script>
