import { isPlainObject, parserUrl } from '@/util/util';
import { require as customRequire } from '../helpers/require';
import { checkPageInPagesJson, getGlobPageRegisterPath } from './app';
import { WrapperComponent } from './component';
import { IPageOptions, IAppPage } from './index.d';

const PageConfig = {};
const AppPages: IAppPage[] = [];
let topWebviewId = 0; // 用于表示在顶部的 webview

export class WrapperPage {
  __webviewId__: number;
  __route__: string;
  data: any;
  __isTabBar__: boolean = false;
  __usingComponents__: { [path: string]: WrapperComponent } = {}; // 每个页面引用的自定义组件的集合，来自于page.json,页面中如果实例化后，需要 new WrapperComponent
  __components__: string[] = [];
  constructor(options: IPageOptions, route: string, __webviewId__: number) {
    this.__webviewId__ = __webviewId__;
    this.__route__ = route;
    if (checkPageInTabList(route)) {
      this.__isTabBar__ = true;
    }
    for (const key in options) {
      if (typeof options[key] === 'function') {
        this[key] = options[key];
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
    const sendData = { options: { data: this.data }, route: this.__route__ };
    KipleServiceJSBridge.publishHandler('RE_RENDER_PAGE', sendData, this.__webviewId__);
  }
}

/**
 * 用于注册一个小程序页面，接受一个 object 作为属性，用来指定页面的初始数据、生命周期回调、事件处理等。
 * @param {IPageOptions} Options
 */
export const Page = (options: IPageOptions) => {
  const globPageRegisterPath = getGlobPageRegisterPath();
  if (!checkPageInPagesJson(globPageRegisterPath)) {
    throw new Error(`Page register error. ${globPageRegisterPath} has not been declared in pages.json.`);
  }
  if (!isPlainObject(options)) {
    throw new Error(`Page's option should be an object.please see ${globPageRegisterPath}.js`);
  }
  console.info(`Add page: ${globPageRegisterPath}`);
  PageConfig[globPageRegisterPath] = options;
};

// 如果是多个tab页面的时候，只返回最后一个 tab 的 page 实例
export const getCurrentPages = () => AppPages.map((item) => item.page);

export const getPageByRoute = (route: string) => AppPages.find((item) => item.route === route);
export const getPageById = (webviewId: number) => AppPages.find((item) => item.webviewId === webviewId);

export const checkPageInTabList = (e: string) => {
  const list = window.__wxConfig.tabBar ? window.__wxConfig.tabBar.list.map((item) => item.pagePath) : [];
  return list.includes(e);
};

const deletePages = (delta: number = 1) => {
  AppPages.splice(AppPages.length - delta, delta);
};

/* 移除指定长度的页面 */
const deleteLastPage = (delta: number = 1, tabPageLength: number, ignoreTab: Boolean = true) => {
  const index = AppPages.length - tabPageLength - 1;
  const lastPage = AppPages[index];
  if (!ignoreTab || !lastPage.page.__isTabBar__) {
    AppPages.splice(index, 1);
  } else {
    tabPageLength += 1;
  }
  delta -= 1;
  if (delta > 0) {
    deleteLastPage(delta, tabPageLength, ignoreTab);
  }
};

/**
 * 路由跳转后，触发page的生命周期函数. 路由跳转前的暂未处理
 */
export const callPageRouteHook = (type: string, options: any) => {
  const { delta = 1, url } = options;
  let { route } = parserUrl(url || '');
  route = route.replace(/^\//, '');
  const currentPages: WrapperPage[] = getCurrentPages();
  const fromPage = currentPages[currentPages.length - 2];

  switch (type) {
    case 'navigateTo': // 前一个页面触发 onHide
      fromPage && fromPage.__callPageLifeTime__('onHide');
      break;
    case 'redirectTo': // 当前页面触发 onUnload，删除当前页面
      fromPage && fromPage.__callPageLifeTime__('onUnload');
      deletePages(1);
      break;
    case 'reLaunch': // 所有页面触发 onUnload，删除所有页面
      for (let index = 0; index < AppPages.length; index++) {
        const lastPage = AppPages[index]?.page;
        lastPage && lastPage.__callPageLifeTime__('onUnload');
      }
      deleteLastPage(AppPages.length, 0, false);
      break;
    case 'switchTab': // 前一个页面时 tabBar 页面, 则触发 onHide 事件，非 tabBar 触发 onUnload
      // 所有非 tab 页面触发 onUnload事件
      for (let index = AppPages.length - delta; index < AppPages.length; index++) {
        const lastPage = AppPages[index]?.page;
        lastPage && !lastPage.__isTabBar__ && lastPage.__callPageLifeTime__('onUnload');
      }
      // 如果上一个页面是 tab 页面，那么触发他的 onHide 事件
      const lastPage = getPageById(topWebviewId);
      if (lastPage && lastPage.page.__isTabBar__) {
        lastPage.page.__callPageLifeTime__('onHide');
      }
      // 删除所有非 tab 页面
      deleteLastPage(AppPages.length, 0);
      // 判断 route 是否存在，如果存在的话，那么需要触发它的 onShow 事件
      const curPage = getPageByRoute(route);
      if (curPage) {
        curPage.page.__callPageLifeTime__('onShow');
        topWebviewId = curPage.webviewId;
      }
      break;
    case 'navigateBack': // 当删除的页面很多时，最后的多个页面触发 onUnload， 未删除的最后一个页面触发 onShow
      for (let index = AppPages.length - delta; index < AppPages.length; index++) {
        const lastPage = AppPages[index]?.page;
        lastPage && lastPage.__callPageLifeTime__('onUnload');
      }

      deletePages(delta);
      const topPage = AppPages[AppPages.length - 1];
      if (topPage) {
        topPage.page.__callPageLifeTime__('onShow');
        topWebviewId = topPage.webviewId;
      }
      break;
    default:
      break;
  }
};

export const registerPage = (route: string, webviewId: number, query: Object) => {
  console.log('create page start......');
  if (!PageConfig[route]) {
    customRequire(route);
  }
  // 需要check路由是否在pages里面
  const pageInstance = new WrapperPage(PageConfig[route], route, webviewId);
  const appPage = { page: pageInstance, route, webviewId: webviewId };
  AppPages.push(appPage);
  pageInstance.__callPageLifeTime__('onLoad', query);
  topWebviewId = webviewId;
  const data = { options: pageInstance, route };
  KipleServiceJSBridge.publishHandler('RENDER_PAGE', data, webviewId);
  pageInstance.__callPageLifeTime__('onShow');
  console.log('create page end.');
};
