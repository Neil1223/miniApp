import * as htmlparser2 from 'htmlparser2';
import generateFromAST from '../core/generateFromAST';
import { getRelativePath, getUpperCasePath, resolveApp } from '../utils';

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
        const pagePath = getRelativePath(inputFile, fileName);
        const upperPath = getUpperCasePath(pagePath).split('.')[0];
        const ast = htmlparser2.parseDOM(source);
        const { code, variates } = generateFromAST(ast[0] as any); // 需要生成 code 和 code 中使用的变量

        const result = `
        import {createElement,_concat} from 'inject/view.js';
        var ${upperPath} = (pageData) => {
          ${variates.map((item) => `var ${item} = pageData['${item}'];`).join('\n')}
          return ${Array.isArray(code) ? code.join(',') : code}
        };
        export default ${upperPath};
        `;

        return result;
      }
      return null;
    },
  };
};

export default parserKml;
