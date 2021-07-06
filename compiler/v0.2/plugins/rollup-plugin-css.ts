import postcss from 'postcss';
import { getFileHash, getRelativePath, getUpperCasePath, resolveApp } from '../utils';
import postcssScope from './postcss-plugin-scope';

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
      if (firstString.length > 1) {
        firstString.splice(0, 1);
        text = firstString.join(matchText);
      } else {
        text = '';
      }
    }
  }
  result.push(JSON.stringify(text));

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
    transform: async function (source: string, fileName: string) {
      if (/\.css$/.test(fileName)) {
        let hash = '';
        if (!/app\.css/.test(fileName)) {
          hash = getFileHash(fileName, this);
        }
        console.log(hash);
        if (hash) {
          const result = await postcss([postcssScope(hash)])
            .use(require('postcss-import'))
            .process(source, { from: fileName });
          source = result.css;
        }
        const arrayCode: Array<string | number> = getCssArray(source);
        const pagePath = getRelativePath(inputFile, fileName);
        const upperPath = getUpperCasePath(pagePath) + 'Style';
        return `var ${upperPath} = [${arrayCode.join(',')}]; export default ${upperPath};`;
      }
      return null;
    },
  };
};

export default parserCss;
