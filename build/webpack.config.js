const path = require('path');
const fs = require('fs');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const appDirectory = fs.realpathSync(process.cwd());
const resolveApp = (relativePath) => path.resolve(appDirectory, relativePath);

const provides = {
  console: [resolveApp('src/util/console')],
  KipleViewJSBridge: [resolveApp('src/webview/bridge/index')],
  KipleServiceJSBridge: [resolveApp('src/service/bridge/index')],
};

module.exports = {
  mode: 'production',
  devtool: 'source-map',
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
        use: 'css-loader',
        exclude: /node_modules/,
      },
    ],
  },
  plugins: [
    new webpack.ProvidePlugin(provides),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: path.join(__dirname, '../dist/index.html'),
      inject: true,
      minify: {
        html5: true,
        removeComments: true,
        minifyCSS: true,
        scriptLoading: 'blocking',
      },
    }),
  ],
};
