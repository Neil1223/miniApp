import '@/core/webview/app';
import '@/core/webview/components';
import { createElement } from '@/core/webview/parser/render';
import '@/webview.css';

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
