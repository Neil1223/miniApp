import kiple from 'kiple-platform/service/api/index';
import { define, require } from '@/core/service/helpers/require';
import { App, Page, getApp, getCurrentPages } from '@/core/service/page';
import initApp from '@/core/service/helpers/initApp';

const pageFunction = { App, Page, getApp, getCurrentPages };

class KipleApp {
  constructor() {
    this._init();
  }

  _init() {
    Object.assign(window, pageFunction, { kiple }, { define, require, initApp });

    window.serviceJSBridge = {
      subscribe: KipleServiceJSBridge.subscribe,
      publishHandler: KipleServiceJSBridge.publishHandler,
      subscribeHandler: KipleServiceJSBridge.subscribeHandler,
    };

    // TODO save some config.
  }
}
new KipleApp();
