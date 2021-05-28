<script>
export default {
  props: {
    labelWidth: {
      type: String,
      default: "auto",
    },
    size: {
      type: String,
      default: "small",
    },
  },
  render(h) {
    return (
      <div>
        <el-form ref="form" model="form" label-width="80px"></el-form>
      </div>
    );
  },
};
</script>
