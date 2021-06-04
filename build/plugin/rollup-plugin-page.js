import * as path from 'path';
import * as fs from 'fs';
import * as babel from '@babel/core';
import * as presetEnv from '@babel/preset-env';

const appDirectory = fs.realpathSync(process.cwd());
const resolveApp = (relativePath) => path.resolve(appDirectory, relativePath);

const getRelativePath = (targetPath, curPath) => {
  let result = path.relative(targetPath, curPath);
  result = result.replace(/\\/g, '/').replace('../', '');
  return result;
};

/**
 * 获取js中require其他的js的路径
 */
const transformRequireCode = (requireContent) => () => {
  return {
    visitor: {
      CallExpression(path) {
        if (path.node.callee.name === 'require') {
          const _arguments = path.node.arguments;
          const requirePath = _arguments[0].value;
          requireContent.push(requirePath);
        }
      },
    },
  };
};

/**
 * 处理小程序中的所有 js,将 js 包裹在 define 中，同时生成 sourceMap
 */
const transformPage = () => {
  let inputFile = '';
  return {
    name: 'transform-page',
    options(options) {
      inputFile = resolveApp(options.input);
    },
    transform(source, fileName) {
      if (/\.js$/.test(fileName)) {
        const requireContents = [];
        const pagePath = getRelativePath(inputFile, fileName);
        const result = `define("${pagePath}", function(require, module, exports, window,document,frames,self,location,navigator,localStorage,history,Caches,screen,alert,confirm,prompt,fetch,XMLHttpRequest,WebSocket,webkit,ttJSCore,Reporter,print){${source}});`;

        let { code, map } = babel.transformSync(result, {
          presets: [presetEnv],
          plugins: [transformRequireCode(requireContents)],
          filename: fileName,
          sourceMaps: true,
        });

        if (requireContents.length) {
          code += `import '${requireContents[0]}'`;
        }

        return { code, map };
      }
      return null;
    },
  };
};

export default transformPage;
