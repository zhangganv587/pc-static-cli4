/*
 * @Author: zhanggan
 * @Date: 2021-04-13 11:08:05
 * @LastEditors: zhanggan
 * @Description: 这里是描述
 * @FilePath: /pc-static-cli4/src/utils/index.js
 */
import WePagination from "@/components/base/we-pagination.vue";
import WeTable from "@/components/base/we-table.vue";
import WeDatePicker from "@/components/base/we-date-picker.vue";
import VTable from "@/components/table/v-table.vue";
import VAddBtn from "@/components/base/v-add-btn.vue";
import VFormReset from "@/components/form/v-form-reset.vue";
import VFormSubmit from "@/components/form/v-form-submit.vue";
import VDialog from "@/components/base/v-dialog.vue";

import format from "./format";
import dayjs from "dayjs";
import common from "@/utils/common";

class Utils {
  install(vue) {
    vue.component("we-pagination", WePagination);
    vue.component("we-table", WeTable);
    vue.component("we-date-picker", WeDatePicker);
    vue.component("v-table", VTable);
    vue.component("v-add-btn", VAddBtn);
    vue.component("v-form-submit", VFormSubmit);
    vue.component("v-form-reset", VFormReset);
    vue.component("v-dialog", VDialog);
    Object.assign(vue.prototype, {
      dayjs: dayjs,
      format: format,
      $common: common,
    });
  }
}

export default new Utils();
