import { IAppOptions } from './index.d';

let globApp: WrapperApp;

class WrapperApp {
  [x: string]: any;
  constructor(options: IAppOptions) {
    for (const key in options) {
      if (key !== 'globalData') {
        if (typeof options[key] === 'function') {
          this[key] = options[key];
        }
      } else {
        this[key] = JSON.parse(JSON.stringify(options[key]));
      }
    }
    this.init();
    this.__callAppLifeTime__('onLaunch');
    this.__callAppLifeTime__('onShow');
  }
  __callAppLifeTime__(name: string) {
    this[name] && this[name]();
  }
  init() {
    KipleServiceJSBridge.on('onAppEnterBackground', () => {
      this.__callAppLifeTime__('onHide');
    });
    KipleServiceJSBridge.on('onAppEnterForeground', () => {
      this.__callAppLifeTime__('onShow');
    });
  }
}

/**
 * 注册小程序。接受一个 Object 参数，其指定小程序的生命周期回调，全局data等
 * @param {IAppOptions} Options
 */
 export const App = (options: IAppOptions) => {
  globApp = new WrapperApp(options);
};

export const getApp = () => globApp;