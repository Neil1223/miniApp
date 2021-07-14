import { ASTElement, IDataString, IGenCode } from '.';
import { getGlobalData, getPrev } from './helper';

/**
 * 根据字符串，返回字符串中的静态字符和变量
 */
export const getData = (text: string): IDataString => {
  const result: IDataString = { values: [], variates: [] };

  const reg = /{{.+?}}/gi;
  const matchData = text.match(reg);
  if (matchData) {
    const firstTarget = matchData[0];
    const splitData = text.split(firstTarget);
    if (splitData[0]) {
      result.values.push(JSON.stringify(text.split(firstTarget)[0]));
    }
    result.values.push(firstTarget.replace(/^{{|}}$/g, ''));
    // 需要分析语句中的全局变量，然后将全局变量放到 variates 中
    const variates = getGlobalData(firstTarget.replace(/^{{|}}$/g, ''));
    result.variates.push(...variates);
    if (splitData[1]) {
      const nextData = getData(splitData[1]);
      result.variates.push(...nextData.variates);
      result.values.push(...nextData.values);
    }
  } else if (text) {
    result.values.push(JSON.stringify(text));
  }

  return result;
};

/**
 * 根据 ast 生成 render 所需的 code.
 *
 * 如果 属性中含有 k:for="{{}}" 那么需要将当前的节点使用函数返回结果
 */
let arrayCount = 0;
let conditionalCount = 0;
const generateFromAST = (htmlAST: ASTElement): IGenCode => {
  let result: IGenCode = { variates: [], code: '', arrayElements: {}, conditional: [] };

  if (htmlAST.type === 'tag') {
    // 需要判断下，html 是否是 k:if,k:else, k:elif
    if (htmlAST.attribs && (htmlAST.attribs['k:if'] || htmlAST.attribs.hasOwnProperty('k:else') || htmlAST.attribs['k:elif'])) {
      let key = '';
      if (htmlAST.attribs['k:if']) {
        key = 'if';
        conditionalCount += 1;
        result.code = `conditional${conditionalCount}`;
      } else {
        // 只有同级的else才加入到数组中，不是的话直接忽略
        const prev = getPrev(htmlAST);
        if (prev && prev.attribs && (prev.attribs['k:if'] || prev.attribs['k:elif'])) {
          key = htmlAST.attribs['k:elif'] ? 'elif' : 'else';
        }
      }
      if (key) {
        result.conditional.push({ variateName: `conditional${conditionalCount}`, [key]: key === 'elif' ? [htmlAST] : htmlAST });
      }

      return result;
    }

    // 需要判断下，htmlAST.attribs 是否存在 k:for, 如果存在的话，这一块就跳过
    if (htmlAST.attribs && htmlAST.attribs['k:for']) {
      arrayCount += 1;
      result.arrayElements[`array${arrayCount}`] = htmlAST;
      result.code = `array${arrayCount}`;
      return result;
    }

    let children: string[] = [];

    // 处理 children
    if (htmlAST.children && htmlAST.children.length) {
      htmlAST.children.forEach((element) => {
        if (htmlAST.name === 'text' && element.name && element.name !== 'text') {
          // 如果组件时 text， 那么子元素只能是文字或者 text 元素
          return;
        }
        var _result = generateFromAST(element);
        if (_result.variates.length) {
          _result.variates.forEach((item) => {
            if (!result.variates.includes(item)) {
              result.variates.push(item);
            }
          });
        }

        // 合并子集中的含有的for循环，待会统一交给外部处理
        if (Object.keys(_result.arrayElements)) {
          Object.assign(result.arrayElements, _result.arrayElements);
        }

        // 合并子集中的含有的 if 语句，待会统一交给外部处理
        if (_result.conditional.length) {
          result.conditional.push(..._result.conditional);
        }

        // 如果 code 不存在，那么直接 return ==> 处理 html 中的注释
        if (!_result.code) {
          return;
        }

        if (typeof _result.code === 'string') {
          children.push(_result.code);
        } else if (Array.isArray(_result.code)) {
          children.push(..._result.code);
        }
      });
    }

    // 处理属性
    let attribs: null | string = null;
    if (Object.keys(htmlAST.attribs).length) {
      attribs = '';
      for (const key in htmlAST.attribs) {
        const dataString = getData(htmlAST.attribs[key]);
        if (dataString.variates.length) {
          dataString.variates.forEach((item) => {
            if (!result.variates.includes(item)) {
              result.variates.push(item);
            }
          });
        }
        const value = dataString.values.length > 1 ? `_concat(${dataString.values})` : dataString.values[0];
        attribs += attribs ? ',' : '';
        if (key === 'class') {
          attribs += `className:${value}`;
        } else {
          attribs += `${JSON.stringify(key)}:${value}`;
        }
      }
    }
    attribs = attribs ? `{${attribs}}` : null;
    result.code = `createElement('wx-${htmlAST.name}',${attribs},${children.join(',')})`;
  } else if (htmlAST.type === 'text') {
    // 需要使用正则解析 {{data}}
    const dataString = getData(htmlAST.data.replace(/(^\s+)|(\s+$)/gi, ''));
    result.code = dataString.values.length > 1 ? `_concat(${dataString.values})` : dataString.values[0];
    // result.code = dataString.values;
    if (dataString.variates.length) {
      dataString.variates.forEach((item) => {
        if (!result.variates.includes(item)) {
          result.variates.push(item);
        }
      });
    }
  }

  return result;
};

export default generateFromAST;
