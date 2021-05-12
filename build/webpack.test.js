const path = require('path');
const fs = require('fs');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const appDirectory = fs.realpathSync(process.cwd());
const resolveApp = (relativePath) => path.resolve(appDirectory, relativePath);

const provides = {
  // console: [resolveApp('src/core/helpers/console'), 'default'],
  KipleViewJSBridge: [resolveApp('src/webview/bridge/index')],
  KipleServiceJSBridge: [resolveApp('src/service/bridge/index')],
};

module.exports = {
  mode: 'production',
  devtool: 'source-map',
  entry: {
    service: resolveApp('src/test.ts'),
  },
  output: {
    path: resolveApp('dist'),
    filename: '[name].[hash].js',
    libraryTarget: 'amd',
    globalObject: 'this',
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js'],
    alias: {
      '@': resolveApp('src'),
      KipleViewJSBridge: resolveApp('src/'),
    },
  },
  module: {
    rules: [
      {
        test: /.ts|js?$/,
        use: 'babel-loader',
        exclude: /node_modules/,
      },
      {
        test: /.tpl?$/,
        use: [resolveApp('build/loader/tpl-loader.js')],
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        use: 'css-loader',
        exclude: /node_modules/,
      },
    ],
  },
};
