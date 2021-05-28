<template>
  <div>
    <el-upload
      ref="elUpload"
      :class="className"
      :name="name"
      :action="action"
      :show-file-list="showFileList"
      :list-type="listType"
      :file-list="fileList"
      :limit="limit"
      :disabled="disabled"
      :on-exceed="handleExceed"
      :before-upload="beforeUpload"
      :on-success="handleSuccess"
      :on-preview="handlePreview"
      :on-remove="handleRemove"
      with-credentials
    >
      <!-- default slot -->
      <template v-if="$slots.default">
        <slot />
      </template>

      <!-- custome slot -->
      <template v-else>
        <el-button v-if="'button' === btnType" type="primary">
          {{ btnText }}
        </el-button>

        <i v-else-if="'picture' === btnType" class="el-icon-plus" />

        <i v-else-if="'text' === btnType">点击上传</i>
      </template>
    </el-upload>
  </div>
</template>
<script>
export default {
  props: {
    className: {
      type: String,
      default: "avatar-uploader",
    },
    name: {
      type: String,
      default: "file",
    },
    action: {
      type: String,
      default: "",
    },
    showFileList: {
      type: Boolean,
      default: true,
    },
    listType: {
      type: String,
      default: "picture-card",
      validator(value) {
        return ["picture", "text", "picture-card"].includes(value);
      },
    },
    btnText: {
      type: String,
      default: "上传文件",
    },
    btnType: {
      type: String,
      default: "picture",
      validator(value) {
        return ["picture", "text", "button"].includes(value);
      },
    },
    maxSize: {
      type: Number,
      default: 0,
    },
    limit: {
      type: Number,
      default: 1,
    },
    fileList: {
      type: Array,
      default: () => [],
    },
    accept: {
      type: String,
      default: "",
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    onSuccess: {
      type: Function,
      default: () => {},
    },
    onRemove: {
      type: Function,
      default: () => {},
    },
  },
  data() {
    this.elUploadDom = null;
    this.elUploadDomDisplay = null;

    // 用于计数已上传图片数量
    this.uploadedNum = 0;
    return {};
  },
  watch: {
    // 这里不能设置 immediate
    // 因为如果设置立即监听，this.elUploadDom 此时还没获取到，就会报错
    // 解决办法：在 mounted 里面执行一次逻辑
    fileList(newVal) {
      this.uploadedNum = newVal.length;
      this.handleDisplayButton(newVal.length >= this.limit);
    },
  },
  mounted() {
    // 这里有两个需要注意的点
    // 1、为了保证各组件间互不影响，这里通过组件实例获取对应的节点，而不是通过 domcument.querySelector
    // 2、getComputedStyle 会获取元素的实时和全部（包括内联、样式文件等设置）样式，导致回流
    this.elUploadDom = this.$refs.elUpload.$el.querySelector(".el-upload");
    this.elUploadDomDisplay =
      getComputedStyle(this.elUploadDom).display || "inline-block";

    this.uploadedNum = this.fileList.length;
    this.handleDisplayButton(this.fileList.length >= this.limit);
  },
  beforeDestroy() {
    this.elUploadDom = null;
  },
  methods: {
    handleExceed(files, fileList) {
      this.$message.warning(`当前限制上传${this.limit}个文件`);
    },

    handleChange(file, fileList) {
      if (fileList.length >= this.limit) {
        this.elUploadDom.style.display = "none";
      } else {
        this.elUploadDom.style.display = this.elUploadDomDisplay;
      }
    },

    beforeUpload(file) {
      let isPassFile = true;
      const { type: fileType, name: fileName, size: fileSize } = file;

      // 文件类型限制
      if (this.accept) {
        isPassFile = this.accept.split(",").some((type) => {
          const regexp = new RegExp(`${type}$`, "i");
          return regexp.test(fileType) || regexp.test(fileName);
        });

        if (!isPassFile) {
          this.$message.warning(`上传文件格式只支持 ${fileType} !`);
          return isPassFile;
        }
      }

      // 文件最大限制
      if (this.maxSize > 0) {
        isPassFile = fileSize <= this.maxSize;

        if (!isPassFile) {
          this.$message.warning(`上传文件大小最大只支持 ${this.maxSize} !`);
          return isPassFile;
        }
      }

      // 文件个数限制
      if (this.uploadedNum >= this.limit) {
        this.$message.warning(`上传文件最多 ${this.limit} 个!`);
        return false;
      }

      return isPassFile;
    },

    handleSuccess(res, file, fileList) {
      this.handleDisplayButton(fileList.length >= this.limit);
      typeof this.onSuccess === "function" &&
        this.onSuccess(res, file, fileList);
    },

    handlePreview(file) {
      this.$eventBus.$emit("dialog-upload-preview", {
        visible: true,
        fileName: file.name,
        fileUrl: file.url,
      });
    },

    handleRemove(file, fileList) {
      const { display } = this.elUploadDom.style;

      if (display === "none" && fileList.length < this.limit) {
        this.elUploadDom.style.display = this.elUploadDomDisplay;
      }

      this.uploadedNum = fileList.length;

      typeof this.onRemove === "function" && this.onRemove(file, fileList);
    },

    // 上传按钮显示与否
    handleDisplayButton(isHidden) {
      if (isHidden) {
        this.elUploadDom.style.display = "none";
      } else {
        this.elUploadDom.style.display = this.elUploadDomDisplay;
      }
    },
  },
};
</script>
<style lang="less">
.avatar-uploader {
  /deep/ .el-upload-list--picture-card {
    .el-upload-list__item {
      width: 120px;
      height: 120px;
    }
  }

  /deep/ .el-upload--picture-card {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 120px;
    height: 120px;
  }
}
</style>
