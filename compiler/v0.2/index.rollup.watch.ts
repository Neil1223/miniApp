import * as rollup from 'rollup';
import * as fs from 'fs-extra';
import parserCss from './plugins/rollup-plugin-css';
import parserKml from './plugins/rollup-plugin-kml';
import { serviceRoot, viewRoot } from './plugins/rollup-plugin-parserAppJson';
import transformPage from './plugins/rollup-plugin-parserService';
import { resolveApp } from './utils';
const alias = require('@rollup/plugin-alias');
const serve = require('rollup-plugin-serve');
const chokidar = require('chokidar');

let startTime = 0;

/**
 * 使用 rollup 自带的 watch 进行文件夹的监听，优点是效率高，缺点是无法在 kml 编译后，触发 js 的编译
 * （之所以是有这个需求，是因为媒体组件的 src 可能是在 js 中进行的赋值，需要在编译 js 的时候将静态文件编译到 dist 目录）
 */

const watchOptions = [
  {
    input: 'example/app.json',
    plugins: [serviceRoot(), transformPage()],
    watch: {
      include: 'example/**',
    },
    output: {
      file: 'dist/app-service.js',
      sourcemap: true,
      format: 'iife',
    },
  },
  {
    input: 'example/app.json',
    output: {
      file: 'dist/app-view.js',
      format: 'iife',
    },
    treeshake: false,
    watch: {
      include: 'example/**',
    },
    plugins: [
      viewRoot(),
      parserCss(),
      parserKml(),
      alias({
        entries: [{ find: 'inject', replacement: resolveApp('compiler/v0.2/injects') }],
      }),
      serve({
        port: 9091,
        contentBase: 'dist',
      }),
    ],
  },
];

const watcher = rollup.watch(watchOptions as any);

// 监听业务代码
watcher.on('event', (event) => {
  switch (event.code) {
    case 'START':
      startTime = new Date().getTime();
      break;
    case 'END':
      console.log('编译文件成功, 耗时：', new Date().getTime() - startTime);
      startTime = new Date().getTime();
      break;
    case 'ERROR':
      console.error(event);
      process.exit(1);
  }
});

// 监听静态文件
try {
  const files = ['.png', '.jpg', '.svg', '.mp4', '.mov', '.m4v', '.3gp', '.avi', '.m3u8'];
  const watch = chokidar.watch(
    files.map((item) => `example/**/**${item}`),
    { cwd: process.cwd() }
  );

  watch.on('all', (event: string, path: string) => {
    const filePath = resolveApp(path);
    if (['add', 'change'].includes(event)) {
      fs.copySync(filePath, filePath.replace('example', 'dist'));
    }
    if (event === 'unlink') {
      fs.removeSync(filePath.replace('example', 'dist'));
    }
  });
} catch (error) {
  console.log('Build mini App Error', error);
}