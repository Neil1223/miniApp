import { render, createElement, createVirtualDom } from './render';
import registerAllElement from '../components';

/**
 * ExParser 相当于 react 中的 react 和 react-dom ;
 * 包含组件注册，创建，更新，diff...等操作;
 * 需要放置视图层.
 */
class ExParser {
  constructor() {
    this.registerAllElement();
  }
  registerAllElement = registerAllElement;
  createElement = createElement;
  render = render;
  createVirtualDom = createVirtualDom;
  removeChild = () => {};
  replaceChild = () => {};
  insertBefore = () => {};
  appendChild = () => {};
  renderToParserTree = () => {};
}

(window as any).core = new ExParser();
