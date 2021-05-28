<!--
 * @Author: 张淦
 * @Date: 2019-11-28 11:12:48
 * @LastEditors: zhanggan
 * @Description: 收银台PC端
 * @FilePath: /gpay-ops-static/src/components/table/v-table-render.vue
 -->
<script type="text/jsx">
export default {
  functional: true,
  props: {
    rowScope: {
      type: Object,
      default: () => ({})
    },
    render: {
      type: Function,
      default: () => {}
    },
    prop: {
      type: String,
      default: ''
    }
  },
  render: (h, ctx) => {
    const { render: renderFunc, rowScope, prop } = ctx.props;
    return (
      <div>{renderFunc(h, rowScope.row[prop], rowScope.row, rowScope.$index)}</div>
    );
  }
};
</script>
