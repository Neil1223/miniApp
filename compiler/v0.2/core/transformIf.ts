import { IForCode, IGenCode } from '.';

/**
 * 处理 k:if,k:else, k:elif
 */
const transformIf = (conditional: IGenCode['conditional'], indexKey?: string, itemKesy?: string): IForCode => {
  const result: IForCode = { code: '', variates: [] };

  console.log(']]]]]', conditional);

  return result;
};

export default transformIf;
