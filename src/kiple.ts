import api from './service/api/index';
import apiNames from '.././lib/apis.js';
import { wrapperUnimplemented, wrapper } from './core/helpers/api';
import { promisify } from './core/helpers/promise';
import { define, require } from './core/helpers/require';
import * as pageFunction from './core/page';

const kiple = Object.create(null);

apiNames.forEach((name: string) => {
  if (api[name]) {
    kiple[name] = promisify(name, wrapper(name, api[name]));
  } else {
    kiple[name] = wrapperUnimplemented(name);
  }
});

class KipleApp {
  constructor() {
    this._init();
  }

  _init() {
    (window as any).kiple = kiple;
    Object.assign(window, pageFunction, { define, require });
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
