import * as path from 'path';
import { resolveApp } from '../utils';

const reg = /\d+rpx/gi;

const getCssArray = (text: string): Array<string | number> => {
  const result: Array<string | number> = [];

  while (reg.test(text)) {
    const matchTexts = text.match(reg);
    if (matchTexts) {
      const matchText = matchTexts[0];
      const firstString = text.split(matchText);
      if (firstString[0]) {
        result.push(JSON.stringify(firstString[0]));
      }
      result.push(matchText.split('rpx')[0]);
      text = firstString[1] ? firstString[1] : '';
    }
  }
  result.push(JSON.stringify(text));

  return result;
};

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
 * 处理css文件
 */
const parserCss = () => {
  let inputFile = '';
  return {
    name: 'transform-css',
    options(options: { input: any }) {
      inputFile = resolveApp(options.input);
    },
    transform(source: string, fileName: string) {
      if (/\.css$/.test(fileName)) {
        console.log('编译css');
        const arrayCode: Array<string | number> = getCssArray(source);
        console.log(fileName);
        const pagePath = getRelativePath(inputFile, fileName);
        const upperPath = getUpperCasePath(pagePath) + 'Style';
        return `var ${upperPath} = [${arrayCode.join(',')}]; export default ${upperPath};`;
      }
      return null;
    },
  };
};

export default parserCss;
