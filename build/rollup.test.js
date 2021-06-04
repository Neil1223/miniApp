import transformConfig from './plugin/rollup-plugin-json';
import transformPage from './plugin/rollup-plugin-page';

const config = {
  input: 'example/app.json',
  output: {
    file: 'dist/service.js',
    sourcemap: true,
    format: 'iife',
  },
  plugins: [transformConfig(), transformPage()],
};

export default config;
