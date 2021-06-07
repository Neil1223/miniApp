import * as path from 'path';
import { resolveApp } from '../utils';

export const getUpperCasePath = (path: string) => {
  const paths = path.split('/');
  let result = '';
  paths.forEach((item) => {
    item = item.toLowerCase();
    result += item.slice(0, 1).toUpperCase() + item.slice(1);
  });
  return result.split('.')[0];
};

const getRelativePath = (targetPath: string, curPath: any) => {
  let result = path.relative(targetPath, curPath);
  result = result.replace(/\\/g, '/').replace('../', '');
  return result;
};

/**
 * 处理小程序中的所有模板 .kml 文件
 */
const parserKml = () => {
  let inputFile = '';
  return {
    name: 'transform-template',
    options(options: { input: any }) {
      inputFile = resolveApp(options.input);
    },
    transform(source: any, fileName: string) {
      if (/\.kml/.test(fileName)) {
        console.log(fileName);
        const pagePath = getRelativePath(inputFile, fileName);
        const upperPath = getUpperCasePath(pagePath);
        return `var ${upperPath} = '${JSON.stringify(fileName)}'; export default ${upperPath};`;
      }
      return null;
    },
  };
};

export default parserKml;
