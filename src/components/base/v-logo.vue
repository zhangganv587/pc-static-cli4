<!--
 * @Author: zhanggan
 * @Date: 2020-06-25 18:21:02
 * @LastEditors: zhanggan
 * @Description: header - logo
 * @FilePath: /pc-static-cli4/src/components/base/v-logo.vue
-->
<script type="text/jsx">
export default {
  name: 'Logo',
  props: {
    isCollapse: {
      type: Boolean,
      default: false
    }
  },
  render() {
    return (
      <router-link to="/">
        <div class="logo">
          <img
            src={require('@/assets/images/logo.png')}
            class="logo-img"
          />
          <span class={ `logo-text ${this.isCollapse ? 'collapse' : ''}` }>统一支付平台</span>
        </div>
      </router-link>
    );
  }
};
</script>

<style lang="less" scoped>
.logo {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 56px;
  line-height: 56px;
  text-align: center;
  background-color: #34384b;
  .logo-img {
    width: 34px;
    height: 24px;
  }
  .logo-text {
    width: auto;
    margin-left: 8px;
    overflow: hidden;
    font-size: 20px;
    font-weight: 500;
    color: #fff;
    opacity: 1;
    transition: all 0.24s ease-out 0.3s;
    &.collapse {
      width: 0;
      margin-left: 0;
      opacity: 0;
    }
  }
}
</style>
