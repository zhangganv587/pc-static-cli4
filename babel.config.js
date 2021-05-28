/*
 * @Author: zhanggan
 * @Date: 2021-04-06 13:51:32
 * @LastEditors: zhanggan
 * @Description: babel
 * @FilePath: /pc-static-cli4/babel.config.js
 */
module.exports = {
  presets: [
    [
      "@babel/preset-env",
      {
        debug: false,
        modules: false,
        useBuiltIns: false,
        targets: {
          browsers: ["> 1%", "last 2 versions", "not ie <= 8"],
        },
      },
    ],
  ],
  plugins: [
    "@babel/plugin-transform-runtime",
    "@babel/plugin-proposal-export-default-from",
    "syntax-jsx",
    "transform-vue-jsx",
    "jsx-v-model",
    "syntax-dynamic-import",
  ],
};
