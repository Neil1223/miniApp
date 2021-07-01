import './webview/app';
import './webview/components';
import { createElement } from './webview/parser/render';

class KipleApp {
  constructor() {
    this._init();
  }
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
