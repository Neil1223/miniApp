import { parserUrl } from '@/util';
import { PageHeadElement } from '../app/header';
import { diff } from '../nodeParser/diff/diff';
import { patch } from '../nodeParser/diff/patch';
import { createDomTree } from '../nodeParser/render';
import initScrollEvent from './scroll';

/**
 * 记录已经在 View 层创建的Page
 */
const AppPages: Page[] = [];
let __webviewId__ = 0;

export class Page {
  __webviewId__: number;
  __route__: string = '';
  __DOMTree__: HTMLElement | Text | null = null;
  __VirtualDom__: IVirtualDom | null = null;
  enableTransparentTitle: boolean = false;
  enablePageScroll: boolean = false;
  enablePageReachBottom: boolean = false;
  root = document.querySelector('#app') || document.body;
  pageContainer: HTMLElement;
  navigationBar: PageHeadElement;
  webviewBody: HTMLElement;
  constructor(__webviewId__: number) {
    this.__webviewId__ = __webviewId__;
    // 创建 容器
    const pageContainer = document.createElement('wx-page');
    this.navigationBar = document.createElement('wx-page-head') as PageHeadElement;
    this.webviewBody = document.createElement('wx-page-body');
    pageContainer.appendChild(this.navigationBar);
    pageContainer.appendChild(this.webviewBody);
    this.pageContainer = pageContainer;
  }
  initScrollEvent = () => initScrollEvent(this);
  resetBackground = () => {
    const curWindowStyle = Object.assign({}, window.__wxConfig.global.window, window.__wxConfig.page[this.__route__]);
    document.body.style.backgroundColor = curWindowStyle.backgroundColor || '#ffffff';
  };
  render = (options: { [key: string]: any }) => {
    // 这里的 data 就是逻辑层的 pageOptions
    this.__VirtualDom__ = window.app[this.__route__].render(options.data);
    // 生成页面 Dom 树
    this.__DOMTree__ = createDomTree(this.__VirtualDom__);

    if (options.onPageScroll) {
      this.enablePageScroll = true;
    }
    if (options.onReachBottom) {
      this.enablePageReachBottom = true;
    }
    // 获取 title 配置
    const curWindowStyle = Object.assign({}, window.__wxConfig.global.window, window.__wxConfig.page[this.__route__]);
    if (curWindowStyle.navigationStyle === 'transparent') {
      this.enableTransparentTitle = true;
    }
    if (this.__DOMTree__) {
      // 修改页面 title
      const header = this.pageContainer.querySelector('wx-page-head');
      if (header) {
        Object.assign(header, curWindowStyle);
      }
      this.webviewBody.appendChild(this.__DOMTree__);
      const lastPage = AppPages[AppPages.length - 2];
      // 初次渲染 page， 如果存在上个page，那么就replace
      if (lastPage && lastPage.pageContainer) {
        this.root.replaceChild(this.pageContainer, lastPage.pageContainer);
      } else {
        this.root.appendChild(this.pageContainer);
      }
    }
    // 当第一次渲染页面后，需要监听当前 page 的 scroll 事件
    this.initScrollEvent();
    // 设置窗口颜色
    this.resetBackground();
  };
  reRender = (options: { [key: string]: any }) => {
    const newVirtualDom = window.app[this.__route__].render(options.data || {});
    if (this.__DOMTree__ && this.__VirtualDom__) {
      // 这个方案是没有进行 key 的使用的 ！！！
      const patches = diff(this.__VirtualDom__, newVirtualDom);
      patch(this.__DOMTree__, patches);
      this.__VirtualDom__ = newVirtualDom;
    }
  };
}
// 这里的page应该包含title，setNavigationBar 的相关API,就可以使用这里的代码进行生效
export const PageFactory = {
  createPage: (webviewId: number) => {
    var page = new Page(webviewId);
    AppPages.push(page);
    window.scrollTo(0, 0);
    return page;
  },
  removePage: (webviewId: number) => {
    const pageIndex = AppPages.findIndex((page) => page.__webviewId__ === webviewId);
    if (pageIndex > -1) {
      AppPages.splice(pageIndex, 1);
    }
  },
  getPage: (webviewId: number) => {
    const page = AppPages.find((page) => page.__webviewId__ === webviewId);
    return page || null;
  },
  getCurrentPage: () => {
    const page = PageFactory.getLastPage(0);
    return page || null;
  },
  getLastPage: (lastIndex: number) => {
    const page = AppPages[AppPages.length - lastIndex - 1];
    return page || null;
  },
  getCurrentWebviewId: () => {
    const page = PageFactory.getCurrentPage();
    return page.__webviewId__;
  },
  setCurrentWebviewId: (webviewId: number) => {
    __webviewId__ = webviewId;
  },
};

export const renderPage = (args: { options: Object; route: string }, webviewId: number) => {
  const { options, route } = args;
  const page = PageFactory.getPage(webviewId);
  if (!page) {
    throw Error(`Page not register for webviewId:${webviewId}`);
  }
  page.__route__ = route;
  if (!page.__DOMTree__) {
    page.render(options);
  } else {
    page.reRender(options);
  }
};

/**
 * 专用于创建page，如果没有参数，那么就是app初始化，如果有参数，那么就是在进行路由跳转
 */
export const initPage = (route?: string) => {
  route = route ? route : location.hash.slice(1, location.hash.length);
  if (!route) {
    route = window.__wxConfig.entryPagePath;
  }
  __webviewId__++;
  PageFactory.createPage(__webviewId__);
  route = route.split('?')[0];
  __AppCssCode__[route] && __AppCssCode__[route]();
  KipleViewJSBridge.publishHandler('registerPage', parserUrl(route), __webviewId__);
};
