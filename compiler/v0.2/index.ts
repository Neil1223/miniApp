import * as rollup from 'rollup';
import parserCss from './plugins/rollup-plugin-css';
import parserKml from './plugins/rollup-plugin-kml';
import { serviceRoot, viewRoot } from './plugins/rollup-plugin-parserAppJson';
import transformPage from './plugins/rollup-plugin-parserService';
import { resolveApp } from './utils';
const alias = require('@rollup/plugin-alias');

const startTime = new Date().getTime();

const inputOptions = {
  input: 'example/app.json',
  plugins: [serviceRoot(), transformPage()],
};

const outputOptions = {
  file: 'dist/app-service.js',
  sourcemap: true,
  format: 'iife',
};

const inputOptions1 = {
  input: 'example/app.json',
  treeshake: false,
  plugins: [
    viewRoot(),
    parserCss(),
    parserKml(),
    alias({
      entries: [{ find: 'inject', replacement: resolveApp('compiler/v0.2/injects') }],
    }),
  ],
};

const outputOptions1 = {
  file: 'dist/app-view.js',
  format: 'iife',
};

const build = async () => {
  // create a bundle
  const bundle: any = await rollup.rollup(inputOptions as any);

  // write the bundle to disk
  await bundle.write(outputOptions as any);

  let endTime = new Date().getTime();

  console.log('编译 service 文件成功, 耗时：', endTime - startTime);

  // create a bundle
  const bundle1: any = await rollup.rollup(inputOptions1 as any);

  // write the bundle to disk
  await bundle1.write(outputOptions1 as any);

  console.log('编译 view 文件成功, 耗时：', new Date().getTime() - endTime);
};

console.log('Start Build Mini App');
try {
  build().then(() => {
    const endTime = new Date().getTime();
    console.log('Build Mini App Success. Consume: ', endTime - startTime, 'ms');
  });
} catch (error) {
  console.log('Build mini App Error');
}
