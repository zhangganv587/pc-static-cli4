/*
 * @Description utils
 * @Author wangjun
 * @Date 2020-07-22 12:10:44
 * @LastEditTime: 2021-04-13 16:40:33
 * @LastEditors
 */
/* eslint-disable */
export const only = (obj, keys) => {
  obj = obj || {};
  if (typeof keys === 'string') {
    keys = keys.split(/ +/);
  }
  return keys.reduce(function(ret, key) {
    if (obj[key] == null) {
      return ret;
    }
    ret[key] = obj[key];
    return ret;
  }, {});
};
