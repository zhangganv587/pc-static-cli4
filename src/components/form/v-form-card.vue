<template>
  <div class="form-card">
    <el-card shadow="none">
      <div slot="header">
        <div class="form-card-header">
          <div class="card-header-left">
            <span class="title">{{ title }}</span>
          </div>
          <div v-if="button" class="card-header-center">
            <el-button
              v-if="button.indexOf('save') > -1"
              class="header-button"
              type="primary"
              @click="handleSave()"
            >
              保存
            </el-button>
            <el-button
              v-if="button.indexOf('edit') > -1"
              class="header-button"
              :type="editType"
              @click.native="clickEdit()"
            >
              编辑
            </el-button>
            <el-button
              v-if="button.indexOf('help') > -1"
              class="header-button"
              type="text"
              @click="handlehHelp()"
            >
              帮助>>
            </el-button>
          </div>
          <div>
            <slot name="header-extra" />
          </div>
        </div>
      </div>
      <slot />
    </el-card>
  </div>
</template>
<script>
export default {
  props: {
    title: {
      type: String,
      default: "",
    },
    button: {
      type: String,
      default: "",
    },
    editType: {
      type: String,
      default: "",
    },
    handleEdit: {
      type: Function,
      default: () => {},
    },
    index: {
      type: Number,
      default: null,
    },
  },
  methods: {
    handleSave() {
      this.$emit("handleSave", this.index);
      this.$eventBus.$emit("handle-search");
    },
    clickEdit() {
      this.$emit("handleEdit", this.index);
    },
  },
};
</script>
<style lang="less" scoped>
.form-card {
  .form-card-header {
    position: relative;
    display: flex;
    justify-content: space-between;
    align-items: center;
    &::before {
      position: absolute;
      width: 4px;
      height: 12px;
      background-color: #3e7fee;
      border-radius: 3px;
      content: "";
    }
    .card-header-left {
      padding-left: 14px;
    }
    .card-header-center {
      float: left;
      margin-left: -70%;
    }
  }
  /deep/ .el-card {
    border: none;
    .el-card__header {
      padding: 18px 0 0;
      font-size: 16px;
      font-weight: 500;
      border-bottom: none;
    }
    .el-card__body {
      padding: 20px 20px 0 20px;
    }
  }
}
</style>
