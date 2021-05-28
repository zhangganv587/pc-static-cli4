<!--
 * @Description:
 * @Author: wangjun
 * @Date: 2020-07-07 13:33:42
 * @LastEditTime: 2021-04-13 16:38:29
 * @LastEditors: zhanggan
-->
<script>
export default {
  /* eslint-disable */
    name: 'WyRender',
    functional: true,
    props: {
      scope: Object,
      render: Function
    },
    render: (h, ctx) => {
      const { render, scope } = ctx.props;
      return render ? render(h, scope) : <span>{ scope.row[scope.column.property] }</span>;
    }
  };
</script>
