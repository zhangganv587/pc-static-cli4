<template>
  <el-dialog :visible="dialogPreviewStatus.visible" @close="handleClose">
    <img
      width="100%"
      :src="dialogPreviewStatus.fileUrl"
      :alt="dialogPreviewStatus.fileName"
    />
  </el-dialog>
</template>
<script>
import { mapState } from "vuex";

export default {
  name: "VPreviewDialog",
  computed: {
    ...mapState(["dialogPreviewStatus"]),
  },
  methods: {
    handleClose() {
      this.$eventBus.$emit("dialog-upload-preview", false);
    },
  },
};
</script>
