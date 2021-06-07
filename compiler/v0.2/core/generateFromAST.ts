import { ASTElement, IDataString, IGenCode } from '.';
import { getGlobalData } from './helper';

/**
 * 根据字符串，返回字符串中的静态字符和变量
 */
const getData = (text: string): IDataString => {
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
 * 根据 ast 生成 render 所需的 code
 */
const generateFromAST = (htmlAST: ASTElement): IGenCode => {
  let result: IGenCode = { variates: [], code: '' };

  if (htmlAST.type === 'tag') {
    let children: string[] = [];
    if (htmlAST.children && htmlAST.children.length) {
      htmlAST.children.forEach((element) => {
        var _result = generateFromAST(element);
        if (_result.variates.length) {
          _result.variates.forEach((item) => {
            if (!result.variates.includes(item)) {
              result.variates.push(item);
            }
          });
        }
        if (typeof _result.code === 'string') {
          children.push(_result.code);
        } else if (Array.isArray(_result.code)) {
          children.push(..._result.code);
        }
      });
    }
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
        const value = dataString.variates.length > 1 ? `''.concat(${dataString.values.join(',')})` : dataString.values[0];
        attribs += attribs ? ',' : '';
        if (key === 'class') {
          attribs += `className:${value}`;
        } else {
          attribs += `${key}:${value}`;
        }
      }
    }
    attribs = attribs ? `{${attribs}}` : null;
    result.code = `createElement('wx-${htmlAST.name}',${attribs},${children.join(',')})`;
  } else if (htmlAST.type === 'text') {
    // 需要使用正则解析 {{data}}
    const dataString = getData(htmlAST.data.replace(/(^\s+)|(\s+$)/gi, ''));
    result.code = dataString.values;
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
