import * as babel from '@babel/core';
import { ASTElement } from '.';
import getIdentifier from '../plugins/babel-plugin-require';

export const getGlobalData = (text: string) => {
  const identifiers: string[] = [];
  babel.transformSync(text, { ast: true, code: false, plugins: [getIdentifier(identifiers)] });
  return identifiers;
};

/**
 * 获取上一个兄弟节点
  */
export const getPrev = (ast: ASTElement | null): ASTElement | null => {
  let prev: ASTElement | null = null;

  if (ast && ast.prev) {
    prev = ast.prev;
  }

  if (prev && prev.type !== 'tag') {
    prev = getPrev(prev);
  }

  return prev;
}