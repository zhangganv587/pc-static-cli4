<template>
  <el-dialog
    :title="title"
    :width="width"
    :visible="dialogVisible"
    :close-on-click-modal="false"
    @close="handleClose"
    @open="handleOpen"
  >
    <!-- title slot -->
    <template v-if="$slots['title'] && $slots['title'][0]" slot="title">
      <slot name="title" />
    </template>

    <!-- default slot -->
    <slot />

    <!-- default footer slot -->
    <template v-if="$slots['footer'] && $slots['footer'][0]" slot="footer">
      <slot name="footer" />
    </template>

    <!-- disabled edit footer slot -->
    <template v-else-if="isEditDisabled" slot="footer">
      <span class="dialog-footer">
        <el-button type="primary opcity" @click="handleEditable"
          >编 辑</el-button
        >
      </span>
    </template>

    <!-- custome footer slot -->
    <template v-else slot="footer">
      <span class="dialog-footer">
        <el-button
          type="primary"
          :loading="isConfirming"
          @click="handleConfirm"
          >{{ confirmText }}</el-button
        >
        <el-button type="primary opcity" @click="handleClose">{{
          cancelText
        }}</el-button>
      </span>
    </template>
  </el-dialog>
</template>
<script>
export default {
  name: "VDialog",
  props: {
    width: {
      type: String,
      default: "740px",
    },
    title: {
      type: String,
      default: "",
    },
    dialogId: {
      type: String,
      default: "vdialog",
      validator(val) {
        return !!val;
      },
    },
    isEditDisabled: {
      type: Boolean,
      default: false,
    },
    isConfirming: {
      type: Boolean,
      default: false,
    },
    confirmText: {
      type: String,
      default: "保 存",
    },
    cancelText: {
      type: String,
      default: "取消",
    },
  },
  computed: {
    dialogVisible() {
      const { visible, dialogId } = this.$store.state.dialogStatus;

      if (process.env.NODE_ENV === "development") {
        if (visible) {
          if (dialogId && !this.dialogId) {
            console.warn(
              '[VDialog]: Please set the value of the ”dialogId" attribute'
            );
            console.warn(
              `           OR set the ”dialogId" attribute value to "${dialogId}”`
            );
          }
        }
      }
      return visible && dialogId === this.dialogId;
    },
  },
  methods: {
    handleConfirm() {
      this.$emit("dialog-confirm", () => {
        this.handleClose();
      });
    },

    handleOpen() {
      this.$emit("dialog-open");
    },

    handleClose() {
      this.$emit("dialog-close");
      this.$eventBus.$emit("dialog-visible", false);
    },

    handleEditable() {
      this.$emit("dialog-editable", false);
    },
  },
};
</script>
