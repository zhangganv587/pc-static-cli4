/*
 * @Author: zhanggan
 * @Date: 2021-04-14 14:03:16
 * @LastEditors: zhanggan
 * @Description: 这里是描述
 * @FilePath: /pc-static-cli4/src/directives/auth.js
 */
export default (vm) => {
  return {
    bind(el, binding) {
      vm.$nextTick(function () {
        const { userRoles } = vm.$store.state;
        if (!userRoles.includes(binding.value)) {
          el.setAttribute("data-auth", binding.value);
          const thisEl = document.querySelector(
            `[data-auth='${binding.value}']`
          );
          if (thisEl && thisEl.parentNode) {
            thisEl.parentNode.removeChild(thisEl);
          }
        }
      });
    },
  };
};
