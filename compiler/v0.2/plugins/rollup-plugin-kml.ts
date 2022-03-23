import generateFromAST from '../core/generateFromAST';
import { htmlParser } from '../core/helper';
import transformFor from '../core/transformFor';
import transformIf from '../core/transformIf';
import { saveImportedTemplate } from '../core/transformTemplate';
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
        const pageVariable = getUpperCasePath(pagePath).split('.')[0];

        const ast = htmlParser(source, pageVariable, pagePath);
        // 处理 template
        const [importTemplate, pageEl] = saveImportedTemplate(ast as any, inputFile, fileName);

        let { code, variates, arrayElements, conditional } = generateFromAST(pageEl as any); // 需要生成 code 和 code 中使用的变量

        //处理 for 循环语句
        const arrayCodes = transformFor(arrayElements);
        variates.push(...arrayCodes.variates);

        // 处理 if 判断语句
        const conditionalCodes = transformIf(conditional);
        variates.push(...conditionalCodes.variates);

        variates = Array.from(new Set(variates));

        const result = `
        import {createElement,_concat,__renderTemplate} from 'inject/view.js';
        ${importTemplate}
        var ${pageVariable} = (pageData) => {
          ${variates.map((item) => `var ${item} = pageData['${item}'];`).join('\n')}
          ${conditionalCodes.code}${arrayCodes.code}
          return ${Array.isArray(code) ? code.join(',') : code}
        };
        export default ${pageVariable};
        `;

        return result;
      }
      return null;
    },
  };
};

export default parserKml;
