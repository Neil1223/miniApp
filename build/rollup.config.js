import resolve from '@rollup/plugin-node-resolve';
import typescript from 'rollup-plugin-typescript2';
import babel from '@rollup/plugin-babel';
import replace from '@rollup/plugin-replace';
import packageJson from '../package.json';

const extensions = ['.js', '.ts'];

// 编译使用 rollup 进行编译可能会很快
const config = {
  input: 'src/test.js',
  output: {
    file: 'jsBridge.js',
    format: 'amd',
  },
  plugins: [
    resolve(),
    typescript({ tsconfig: 'tsconfig.json' }),
    babel({ babelHelpers: 'runtime', extensions, exclude: 'node_modules/**' }),
    replace({
      preventAssignment: true,
      VERSION: JSON.stringify(packageJson.version),
      ENV: JSON.stringify(process.env.NODE_ENV || 'development'),
    }),
  ],
};

export default config;
