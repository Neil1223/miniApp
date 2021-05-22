import { isPlainObject } from '@/util/util';
import { require as customRequire } from '../helpers/require';
import { IPageOptions, IAppOptions, IAppPage } from './index.d';

const PageConfig = {};
let globPageRegisterPath = '';
let globApp: WrapperApp;
const AppPages: IAppPage[] = [];

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
    this.__callPageLifeTime__('onLaunch');
    this.__callPageLifeTime__('onShow');
  }
  __callPageLifeTime__(name: string) {
    this[name] && this[name]();
  }
  init() {
    KipleServiceJSBridge.on('onAppEnterBackground', () => {
      this.__callPageLifeTime__('onHide');
    });
    KipleServiceJSBridge.on('onAppEnterForeground', () => {
      this.__callPageLifeTime__('onShow');
    });
  }
}

class WrapperPage {
  __webviewId__: number;
  route: string;
  data: any;
  isTabBar: any;
  constructor(options: IPageOptions, route: string, __webviewId__: number) {
    this.__webviewId__ = __webviewId__;
    this.route = route;
    for (const key in options) {
      if (key !== 'data') {
        if (typeof options[key] === 'function') {
          this[key] = options[key];
        }
      } else {
        this[key] = JSON.parse(JSON.stringify(options[key]));
      }
    }
  }
  __callPageLifeTime__(name: string, query?: any) {
    this[name] && this[name](query);
  }
  public setData(data: Object) {
    // TODO: 1. 需要合并 setDate??是否会影响webview之间通讯的性能 2. 进行diff render
    Object.assign(this.data, data);
    const sendData = { options: { data: this.data }, route: this.route };
    KipleServiceJSBridge.publishHandler('RENDER_PAGE', sendData, this.__webviewId__);
  }
}

/**
 * 注册小程序。接受一个 Object 参数，其指定小程序的生命周期回调，全局data等
 * @param {IAppOptions} Options
 */
export const App = (options: IAppOptions) => {
  globApp = new WrapperApp(options);
};

/**
 * 用于注册一个小程序页面，接受一个 object 作为属性，用来指定页面的初始数据、生命周期回调、事件处理等。
 * @param {IPageOptions} Options
 */
export const Page = (options: IPageOptions) => {
  if (!checkPageInPagesJson(globPageRegisterPath)) {
    throw new Error(`Page register error. ${globPageRegisterPath} has not been declared in pages.json.`);
  }
  if (!isPlainObject(options)) {
    throw new Error(`Page's option should be an object.please see ${globPageRegisterPath}.js`);
  }
  console.info(`Add page: ${globPageRegisterPath}`);
  PageConfig[globPageRegisterPath] = options;
};

export const getApp = () => globApp;

export const getCurrentPages = () => AppPages.map((item) => item.page);

export const checkPageInPagesJson = (e: string) => window.__wxConfig.pages.includes(e);

/**
 * 修改当前的正在注册的page的路由路径
 * 需要判断当前路径是否是已经在config的pages里面，存在的话才进行修改
 */
export const setGlobPageRegisterPath = (e: string) => {
  if (checkPageInPagesJson(e)) {
    globPageRegisterPath = e;
  }
};

/**
 * 路由跳转后，触发page的生命周期函数. 路由跳转前的暂未处理
 */
export const callPageRouteHook = (type: string, options: any) => {
  const { delta = 1 } = options;
  const currentPages: WrapperPage[] = getCurrentPages();
  const fromPage = currentPages[currentPages.length - 2];

  switch (type) {
    case 'navigateTo': // 前一个页面触发 onHide
      fromPage && fromPage.__callPageLifeTime__('onHide');
      break;
    case 'redirectTo': // 前一个页面触发 onUnload
      fromPage && fromPage.__callPageLifeTime__('onUnload');
      break;
    case 'switchTab': // 前一个页面时 tabBar 页面, 则触发 onHide 事件，非 tabBar 触发 onUnload
      fromPage && fromPage.__callPageLifeTime__(fromPage.isTabBar ? 'onHide' : 'onUnload');
      break;
    case 'navigateBack': // 当删除的页面很多时，最后的多个页面触发 onUnload， 未删除的最后一个页面触发 onShow
      for (let index = AppPages.length - delta; index < AppPages.length; index++) {
        const lastPage = AppPages[index]?.page;
        lastPage && lastPage.__callPageLifeTime__('onUnload');
      }
      AppPages.splice(AppPages.length - delta, delta);
      AppPages[AppPages.length - 1] && AppPages[AppPages.length - 1].page.__callPageLifeTime__('onShow');
      break;
    default:
      break;
  }
};

export const registerPage = (route: string, webviewId: number, query: Object) => {
  console.log('create page start.');
  if (!PageConfig[route]) {
    customRequire(route);
  }
  // 需要check路由是否在pages里面
  const pageInstance = new WrapperPage(PageConfig[route], route, webviewId);
  const appPage = { page: pageInstance, route, webviewId: webviewId };
  AppPages.push(appPage);
  pageInstance.__callPageLifeTime__('onLoad', query);
  const data = { options: pageInstance, route };
  KipleServiceJSBridge.publishHandler('RENDER_PAGE', data, webviewId);
  pageInstance.__callPageLifeTime__('onShow');
  console.log('create page end.');
};
