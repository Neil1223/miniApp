const path = require('path');
const fs = require('fs');
const webpack = require('webpack');

const appDirectory = fs.realpathSync(process.cwd());
const resolveApp = (relativePath) => path.resolve(appDirectory, relativePath);

const config = {
  mode: 'production',
  devtool: 'source-map',
  entry: {
    service: resolveApp('example/app.json'),
  },
  output: {
    path: resolveApp('dist'),
    filename: '[name].js',
    globalObject: 'this',
    library: {
      type: 'commonjs',
    },
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js'],
    alias: {
      '@': resolveApp('src'),
      'uni-pages': resolveApp('example/app.json'),
    },
  },
  module: {
    rules: [
      {
        test: resolveApp('example/app.json'),
        use: [resolveApp('build/loader/pages-loader.js')],
        type: 'javascript/auto',
      },
      {
        test: /\.js$/,
        use: [resolveApp('build/loader/test.js')],
      },
    ],
  },
};

webpack(config, (error, stats) => {
  if (error) {
    console.log('error', error);
    return;
  }

  if (stats.hasErrors()) {
    /* eslint-disable prefer-promise-reject-errors */
    const status = stats.toJson({ all: false, warnings: true, errors: true });
    return console.log('Build failed with errors.', status);
  }

  console.log('stats');
});
