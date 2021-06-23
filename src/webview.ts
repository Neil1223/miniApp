import registerAllElement from './webview/components';
import { createElement } from './webview/parser/render';
import './webview/app';

class KipleApp {
  constructor() {
    this.registerAllElement();
    this._init();
  }
  registerAllElement = registerAllElement;
  createElement = createElement;
  _init() {
    window.viewJSBridge = {
      subscribe: KipleViewJSBridge.subscribe,
      publishHandler: KipleViewJSBridge.publishHandler,
      subscribeHandler: KipleViewJSBridge.subscribeHandler,
    };
  }
}

(window as any).core = new KipleApp();
