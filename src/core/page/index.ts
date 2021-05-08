import { isPlainObject } from '@/util/util';
import { IPageOptions, IAppOptions, IAppPage } from './index.d';

const PageConfig = {};
let globPageRegisterPath = '';
let curWebviewId = 1;
let globApp: any = null;
const AppPages: IAppPage[] = [];

class WrapperApp {
  constructor(options: IAppOptions) {}
}

class WrapperPage {
  __webviewId__: number;
  route: string;
  data: any;
  constructor(options: IPageOptions, route: string) {
    this.__webviewId__ = curWebviewId;
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
  private setData(data) {
    console.log('这里会触发render');
    Object.assign(this.data, data);
    KipleServiceJSBridge.publishHandler('reRenderPage', this.data, this.route);
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
  if (!isPlainObject(options)) {
    throw Error(`Page's option should be an object.please see ${globPageRegisterPath}.js`);
  }
  console.log(`Add page: ${globPageRegisterPath}`);
  PageConfig[globPageRegisterPath] = options;
};

export const loadSprint = (path: string) => {
  globPageRegisterPath = path;
};

export const getApp = () => globApp;

export const getCurrentPages = () => AppPages.map((item) => item.page);

// 路由跳转的时候需要调用这个函数，暂时可以将这个暴露出来，进行测试
// 组件注册后，如何通知页面进行渲染
export const registerPage = (path: string) => {
  console.log('create page start.');
  console.log('===', PageConfig[path]);
  const pageInstance = new WrapperPage(PageConfig[path], path);
  const appPage = { page: pageInstance, path, webviewId: curWebviewId };
  AppPages.push(appPage);
  pageInstance.onLoad && pageInstance.onLoad();
  pageInstance.onShow && pageInstance.onShow();
  curWebviewId++;
  KipleServiceJSBridge.publishHandler('renderPage', pageInstance.data, path);
  console.log('create page end.');
};
