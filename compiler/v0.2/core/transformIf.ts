import { ASTElement, IForCode, IGenCode } from '.';
import generateFromAST, { getData } from './generateFromAST';

const getIfCode = (variateName: string, ast: ASTElement) => {
  const result: IForCode = { code: '', variates: [] };
  const conditionalString = ast.attribs['k:if'];
  const conditional = getData(conditionalString);
  delete ast.attribs['k:if'];

  const _result = generateFromAST(ast);

  result.variates.push(...conditional.variates, ..._result.variates);
  result.code = `if(${conditional.values[0]}){
    ${variateName} = ${_result.code}
  }`;
  return result;
};

const getElifCode = (variateName: string, ast?: ASTElement[] | ASTElement) => {
  const result: IForCode = { code: '', variates: [] };

  if (!ast || !Array.isArray(ast)) {
    return result;
  }
  const code = ast.map((item) => {
    const conditionalString = item.attribs['k:elif'];
    const conditional = getData(conditionalString).values[0];
    delete item.attribs['k:elif'];
    const _result = generateFromAST(item);

    return `else if(${conditional}){
      ${variateName} = ${_result.code}
    }`;
  });
  result.code = code.join('');
  return result;
};

const getElseCode = (variateName: string, ast?: ASTElement) => {
  const result: IForCode = { code: '', variates: [] };

  if (!ast) {
    return result;
  }
  delete ast.attribs['k:else'];
  const _result = generateFromAST(ast);
  result.code = `else{
    ${variateName} = ${_result.code}
  }`;
  return result;
};

/**
 * 处理 k:if,k:else, k:elif
 */
const transformIf = (data: IGenCode['conditional']): IForCode => {
  const result: IForCode = { code: '', variates: [] };

  // 合并含有相同 variateName 的数据
  const conditionals: IGenCode['conditional'] = [];
  data.forEach((item) => {
    if (conditionals.length === 0) {
      conditionals.push(item);
      return;
    }
    const lastConditional = conditionals[conditionals.length - 1];
    if (item.variateName !== lastConditional.variateName) {
      conditionals.push(item);
    } else {
      // 需要根据 key 的值判断下，是 else 的话 需要是一个数组
      if (item.elif) {
        if (lastConditional.elif) {
          lastConditional.elif.push(item.elif[0]);
        } else {
          lastConditional.elif = item.elif;
        }
      } else {
        Object.assign(lastConditional, item);
      }
    }
  });

  // 遍历 conditionals， 生成 code
  conditionals.forEach((conditional) => {
    if (!conditional.if) {
      return;
    }
    const ifCode = getIfCode(conditional.variateName, conditional.if);
    const elseCode = getElseCode(conditional.variateName, conditional.else);
    const elifCode = getElifCode(conditional.variateName, conditional.elif);

    result.variates.push(...ifCode.variates, ...elifCode.variates, ...elseCode.variates);

    const code = `
    var ${conditional.variateName} = null;
    ${ifCode.code}${elifCode.code}${elseCode.code}
    `;
    result.code += code;
  });

  return result;
};

export default transformIf;
