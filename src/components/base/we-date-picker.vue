<template>
  <el-date-picker
    ref="elDatePicker"
    v-model="datePicker"
    class="date_picker"
    align="right"
    size="small"
    :type="pickerData.type"
    :range-separator="pickerData.rangeSeparator"
    :start-placeholder="pickerData.startPlaceholder"
    :end-placeholder="pickerData.endPlaceholder"
    :default-time="['00:00:00', '23:59:59']"
    value-format
    clearable
    :picker-options="pickerOptions"
    @change="currentChange"
  />
</template>

<script>
export default {
  props: {
    pickerProps: {
      type: Object,
      default: () => {},
    },
    value: {
      type: Array,
      default: () => [],
    },
    // 为 0 表示没有限制
    defaultRange: {
      type: Number,
      default: 7,
    },
    // 为 0 表示没有限制
    maxRange: {
      type: Number,
      default: 0,
    },
  },
  data() {
    this.defaultPickerProps = {
      type: "datetimerange",
      rangeSeparator: "至",
      startPlaceholder: "开始日期",
      endPlaceholder: "结束日期",
    };
    this.initPickerDate = [];

    return {
      datePicker: this.initPickerDate,
      pickerData: this.defaultPickerProps,
      pickerOptions: {
        onPick: this.handlePick,
      },
    };
  },
  watch: {
    pickerProps: {
      immediate: true,
      handler(newVal) {
        this.pickerData = { ...this.pickerData, ...newVal };
      },
    },
    value(newVal) {
      if (
        Number(this.defaultRange) > 0 &&
        (!Array.isArray(newVal) || newVal.length === 0)
      ) {
        this.datePicker = this.initPickerDate;
      } else {
        this.datePicker = newVal;
      }
      console.log(this.datePicker, "datePicker");
      this.currentChange(this.datePicker);
    },
  },
  created() {
    this.$eventBus.$on("resetDatePicker", () => {
      this.datePicker = [];
      this.currentChange(null);
    });
  },
  mounted() {
    this.datePickerShortCut(this.defaultRange);
  },
  methods: {
    datePickerShortCut(days) {
      days = Number(days);

      if (Number.isNaN(days) || days === 0) {
        this.datePicker = [];
      } else {
        const end = new Date();
        const start = new Date();
        start.setTime(start.getTime() - 3600 * 1000 * 24 * Number(days));
        this.initPickerDate = this.datePicker = [
          this.dayjs(start).format("YYYY-MM-DD 00:00:00"),
          this.dayjs(end).format("YYYY-MM-DD 23:59:59"),
        ];
      }

      this.currentChange(this.datePicker);
    },

    currentChange(datePicker) {
      let outDate = [];

      if (Array.isArray(datePicker) && datePicker.length === 2) {
        outDate = [
          this.dayjs(datePicker[0]).format("YYYY-MM-DD HH:mm:ss"),
          this.dayjs(datePicker[1]).format("YYYY-MM-DD HH:mm:ss"),
        ];

        // 对最大范围限制进行处理
        if (this.maxRange > 0) {
          const diffDays = this.dayjs(datePicker[1]).diff(
            this.dayjs(datePicker[0]),
            "day"
          );
          if (diffDays > this.maxRange) {
            outDate[1] = this.dayjs(datePicker[0])
              .add(this.maxRange, "day")
              .format("YYYY-MM-DD 00:00:00");
          }
        }
      }

      this.datePicker = outDate;
      this.$emit("currentChange", outDate);
    },

    // 设置时间选择范围
    handlePick({ minDate, maxDate }) {
      if (this.maxRange > 0 && minDate && maxDate === null) {
        const otherPickMin = this.dayjs(minDate).subtract(this.maxRange, "day");
        const otherPickMax = this.dayjs(minDate).add(this.maxRange, "day");

        this.pickerOptions = {
          ...this.pickerOptions,
          disabledDate(currentDate) {
            return currentDate >= otherPickMax || currentDate <= otherPickMin;
          },
        };
      }
    },
  },
};
</script>
<style lang="less" scoped>
.date_picker {
  /deep/ .el-range-input,
  /deep/ .el-range-separator {
    box-sizing: content-box;
  }
}
</style>
