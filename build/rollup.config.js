import resolve from '@rollup/plugin-node-resolve';
import typescript from 'rollup-plugin-typescript2';
import babel from '@rollup/plugin-babel';
import replace from '@rollup/plugin-replace';
import packageJson from '../package.json';

const extensions = ['.js', '.ts'];

const config = {
  input: 'src/kiple.ts',
  output: {
    file: 'jsBridge.js',
    format: 'iife',
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
