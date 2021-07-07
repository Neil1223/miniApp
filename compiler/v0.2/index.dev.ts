import * as rollup from 'rollup';
import parserCss from './plugins/rollup-plugin-css';
import parserKml from './plugins/rollup-plugin-kml';
import { serviceRoot, viewRoot } from './plugins/rollup-plugin-parserAppJson';
import transformPage from './plugins/rollup-plugin-parserService';
import { debounce, resolveApp } from './utils';
const alias = require('@rollup/plugin-alias');
const chokidar = require('chokidar');
const serve = require('rollup-plugin-serve');

let startTime = 0;

const options = [
  {
    input: 'example/app.json',
    output: {
      file: 'dist/app-view.js',
      format: 'iife',
    },
    treeshake: false,
    plugins: [
      viewRoot(),
      parserCss(),
      parserKml(),
      alias({
        entries: [{ find: 'inject', replacement: resolveApp('compiler/v0.2/injects') }],
      }),
    ],
  },
  {
    input: 'example/app.json',
    output: {
      file: 'dist/app-service.js',
      sourcemap: true,
      format: 'iife',
    },
    plugins: [
      serviceRoot(),
      transformPage(),
      serve({
        port: 9091,
        contentBase: 'dist',
      }),
    ],
  },
];

const build = async () => {
  startTime = new Date().getTime();

  // create view.js bundle
  const viewBundle: any = await rollup.rollup(options[0] as any);

  // write the bundle to disk
  await viewBundle.write(options[0].output);

  let endTime = new Date().getTime();

  console.log('编译 view 文件成功, 耗时：', endTime - startTime);

  // create service.js bundle
  const serviceBundle: any = await rollup.rollup(options[1] as any);

  // write the bundle to disk
  await serviceBundle.write(options[1].output);

  console.log('编译 service 文件成功, 耗时：', new Date().getTime() - endTime);
};

try {
  const watch = chokidar.watch('example');
  watch.on('ready', () => {
    const debounceBuild = debounce(build, 150);
    watch.on('all', (event: string, path: string) => {
      if (!['addDir', 'unlinkDir'].includes(event)) {
        debounceBuild();
      }
    });
  });
  build();
} catch (error) {
  console.log('Build mini App Error', error);
}
