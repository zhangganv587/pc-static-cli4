<!--
 * @Author: 张淦
 * @Date: 2020-03-23 11:18:14
 * @LastEditors: zhanggan
 * @Description:
 * @FilePath: /pc-static-cli4/src/components/base/v-add-btn.vue
 -->
<script>
export default {
  name: "VAddBtn",
  props: {
    size: {
      type: String,
      default: "medium",
    },
    type: {
      type: String,
      default: "primary",
    },
    plain: {
      type: Boolean,
      default: false,
    },
    round: {
      type: Boolean,
      default: false,
    },
    circle: {
      type: Boolean,
      default: false,
    },
    loading: {
      type: Boolean,
      default: false,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    icon: {
      type: String,
      default: "",
    },
    autofocus: {
      type: Boolean,
      default: false,
    },
    nativeType: {
      type: String,
      default: "button",
    },
    refresh: {
      type: Boolean,
      default: false,
    },
    refreshUrl: {
      type: String,
      default: "",
    },
  },
  render() {
    // 触发事件
    const handleClickEvent = () => {
      this.$emit("click");
    };

    const handleRefresh = () => {
      this.$fetch(this.refreshUrl, {
        method: "post",
      }).then((res) => {
        if (res.code === 0) {
          this.$message({
            type: "success",
            message: "缓存刷新成功",
          });
        }
      });
    };

    return (
      <el-row type="flex" justify="end" style={{ marginBottom: "18px" }}>
        {this.refresh ? (
          <el-button size={this.size} onClick={handleRefresh}>
            刷新缓存
          </el-button>
        ) : null}
        <el-button
          size={this.size}
          type={this.type}
          plain={this.plain}
          round={this.round}
          circle={this.circle}
          loading={this.loading}
          disabled={this.disabled}
          autofocus={this.autofocus}
          native-type={this.nativeType}
          onClick={handleClickEvent}
        >
          {this.$slots.default[0]}
        </el-button>
      </el-row>
    );
  },
};
</script>
