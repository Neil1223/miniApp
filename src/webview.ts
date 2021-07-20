import './webview/app';
import './webview/components';
import { createElement } from './webview/parser/render';
import './webview.css';

class KipleApp {
  constructor() {
    this._init();
  }
  createElement = createElement;
  _init() {
    document.documentElement.style.setProperty('--app-height', window.innerHeight + 'px');

    window.viewJSBridge = {
      subscribe: KipleViewJSBridge.subscribe,
      publishHandler: KipleViewJSBridge.publishHandler,
      subscribeHandler: KipleViewJSBridge.subscribeHandler,
    };
  }
}

(window as any).core = new KipleApp();
