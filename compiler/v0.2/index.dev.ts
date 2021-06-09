import * as rollup from 'rollup';
import parserCss from './plugins/rollup-plugin-css';
import parserJson from './plugins/rollup-plugin-json';
import parserKml from './plugins/rollup-plugin-kml';
import { serviceRoot, viewRoot } from './plugins/rollup-plugin-parserAppJson';
import transformPage from './plugins/rollup-plugin-parserService';
import { resolveApp } from './utils';
const alias = require('@rollup/plugin-alias');
const serve = require('rollup-plugin-serve');

let startTime = 0;

const watchOptions = [
  {
    input: 'example/app.json',
    plugins: [serviceRoot(), transformPage()],
    output: {
      file: 'dist/app-service.js',
      sourcemap: true,
      format: 'iife',
    },
  },
  {
    input: 'example/app.json',
    plugins: [parserJson()],
    output: {
      file: 'dist/app-config.js',
      format: 'cjs',
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
