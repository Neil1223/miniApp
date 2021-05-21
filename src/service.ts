import kiple from './service/api/index';
import { define, require } from './service/core/helpers/require';
import { App, Page, getApp, getCurrentPages } from './service/core/page';
import initApp from './service/core/helpers/initApp';

const pageFunction = { App, Page, getApp, getCurrentPages };

class KipleApp {
  constructor() {
    this._init();
  }

  _init() {
    Object.assign(window, pageFunction, { kiple }, { define, require, initApp });
    window.viewJSBridge = {
      subscribe: KipleViewJSBridge.subscribe,
      publishHandler: KipleViewJSBridge.publishHandler,
      subscribeHandler: KipleViewJSBridge.subscribeHandler,
    };

    window.serviceJSBridge = {
      subscribe: KipleServiceJSBridge.subscribe,
      publishHandler: KipleServiceJSBridge.publishHandler,
      subscribeHandler: KipleServiceJSBridge.subscribeHandler,
    };

    // TODO save some config.
  }
}
new KipleApp();
