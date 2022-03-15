import * as babel from '@babel/core';
import * as htmlparser2 from 'htmlparser2';
import { DomHandler } from 'domhandler';
import { ASTElement } from '.';
import getIdentifier, { getTempIdentifier } from '../plugins/babel-plugin-require';

export const getGlobalData = (text: string) => {
  const identifiers: string[] = [];
  babel.transformSync(text, { ast: true, code: false, plugins: [getIdentifier(identifiers)] });
  return identifiers;
};

export const getTempGlobalData = (text: string) => {
  const identifiers: string[] = [];
  babel.transformSync(text, { ast: true, code: false, plugins: [getTempIdentifier(identifiers)] });
  return identifiers;
};

export const htmlParser = (htmlString: string, pageVariable?: string) => {
  const addNode = (DomHandler as any).prototype.addNode;
  (DomHandler as any).prototype.addNode = function (node: any) {
    node.__pageVariable__ = pageVariable;
    addNode.call(this, node);
  };
  var handler = new DomHandler(undefined, {});
  new htmlparser2.Parser(handler, {}).end(htmlString);
  return handler.root.children;
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
};

/**
 * 获取 rollup 加载 app.json 的时间, 用于生成 hash
 */
export const getCurTime = function (this: any) {
  const first = Array.from(this.getModuleIds())[0];
  return this.getModuleInfo(first).meta.time;
};
