const path = require('path');
const fs = require('fs');
const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const appDirectory = fs.realpathSync(process.cwd());
const resolveApp = (relativePath) => path.resolve(appDirectory, relativePath);
const isDev = process.env.NODE_ENV === 'dev';

const provides = {
  console: [resolveApp('src/util/console')],
  KipleViewJSBridge: [resolveApp('src/core/webview/bridge/index')],
  KipleServiceJSBridge: [resolveApp('src/core/service/bridge/index')],
};

module.exports = {
  mode: 'production',
  devtool: isDev ? 'source-map' : false,
  entry: {
    webview: resolveApp('src/webview.ts'),
    service: resolveApp('src/service.ts'),
  },
  output: {
    path: resolveApp('dist'),
    filename: '[name].js',
    libraryTarget: 'umd',
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
        test: /.html?$/,
        use: [resolveApp('build/loader/tpl-loader.js')],
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader'],
        exclude: /node_modules/,
      },
    ],
  },
  plugins: [
    new webpack.ProvidePlugin(provides),
    new MiniCssExtractPlugin({
      filename: '[name].css',
    }),
  ],
};
