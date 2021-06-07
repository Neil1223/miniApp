import * as babel from '@babel/core';
import getIdentifier from '../plugins/babel-plugin-require';

export const getGlobalData = (text: string) => {
  const identifiers: string[] = [];
  babel.transformSync(text, { ast: true, code: false, plugins: [getIdentifier(identifiers)] });
  return identifiers;
};
