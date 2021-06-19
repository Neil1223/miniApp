import { IForCode, IGenCode } from '.';
import generateFromAST, { getData } from './generateFromAST';

/**
 * 处理k:for的元素
 */
const transformArrayElement = (arrayElements: IGenCode['arrayElements']): IForCode => {
  const result: IForCode = { code: '', variates: [] };
  const keys = Object.keys(arrayElements);

  keys.forEach((key) => {
    // 先获取 k:for 的值，解析它，然后将其从 ast 中删除
    var listString = arrayElements[key].attribs['k:for'];
    const list = getData(listString).values[0];
    const index = arrayElements[key].attribs['k:for-index'] || 'index';
    const item = arrayElements[key].attribs['k:for-item'] || 'item';
    delete arrayElements[key].attribs['k:for'];
    delete arrayElements[key].attribs['k:for-item'];
    delete arrayElements[key].attribs['k:for-index'];

    // 解析当前节点
    const _result = generateFromAST(arrayElements[key]);
    // 解析当前节点下面的 for 循环
    const subCode = transformArrayElement(_result.arrayElements);
    // 合并所有的变量
    _result.variates = _result.variates.filter((variate) => variate !== item && variate !== index);
    subCode.variates = subCode.variates.filter((variate) => variate !== item && variate !== index);
    result.variates.push(...getData(listString).variates, ..._result.variates, ...subCode.variates);

    var code = `
      var ${key} = [];
      {
        for(let _index = 0; _index < ${list}.length; _index++){
          var ${item} = ${list}[_index];
          var ${index} = _index;
          ${subCode.code ? `${subCode.code}\n${index} = _index;` : ''}
          ${key}.push(${_result.code}) 
        }
      }
    `;
    result.code += code;
  });

  result.variates = Array.from(new Set(result.variates));
  return result;
};

export default transformArrayElement;
