const { defineConfig } = require("@vue/cli-service");
const path = require("path");
const NodePolyfillPlugin = require("node-polyfill-webpack-plugin");
const { VuetifyPlugin } = require('webpack-plugin-vuetify')
module.exports = defineConfig({
  transpileDependencies: [
    'vuetify',
    'vuetify-dialog',
  ],
  chainWebpack: (config) => {
    config.module
      .rule("vue")
      .use("vue-loader")
      .tap((options) => {
        return {
          ...options,
          compilerOptions: {
            compatConfig: {
              MODE: 3,
            },
          },
        };
      });
  },
  configureWebpack: {
    plugins: [new NodePolyfillPlugin(),new VuetifyPlugin({ autoImport: true }),],
    optimization: {
      splitChunks: {
        chunks: "all",
      },
    },
  },
  lintOnSave: false,
});
