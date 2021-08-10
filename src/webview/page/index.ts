import { parserUrl } from '@/util';
import { PageBodyElement } from '../app/body';
import { PageHeadElement } from '../app/header';
import { diff } from '../parser/diff/diff';
import { patch } from '../parser/diff/patch';
import { createDomTree } from '../parser/render';
import initScrollEvent from './scroll';

/**
 * 记录已经在 View 层创建的Page
 */
const AppPages: Page[] = [];
let __webviewId__ = 0;

window.aaa = AppPages;

export class Page {
  __webviewId__: number;
  __route__: string = '';
  __DOMTree__: HTMLElement | Text | Comment | null = null;
  __VirtualDom__: IVirtualDom | null = null;
  enableTransparentTitle: boolean = false;
  enablePageScroll: boolean = false;
  enablePageReachBottom: boolean = false;
  isTablePage: boolean = false;
  root = document.querySelector('wx-app') || document.body;
  pageContainer: HTMLElement;
  navigationBar: PageHeadElement;
  webviewBody: PageBodyElement;
  constructor(__webviewId__: number) {
    this.__webviewId__ = __webviewId__;
    // 创建容器
    const pageContainer = document.createElement('wx-page');
    this.navigationBar = document.createElement('wx-page-head') as PageHeadElement;
    this.webviewBody = document.createElement('wx-page-body') as PageBodyElement;
    pageContainer.appendChild(this.navigationBar);
    pageContainer.appendChild(this.webviewBody);
    this.pageContainer = pageContainer;
  }
  initScrollEvent = () => initScrollEvent(this);
  resetBackground = () => {
    const curWindowStyle = Object.assign({}, window.__wxConfig.global.window, window.__wxConfig.page[this.__route__]);
    this.pageContainer.style.backgroundColor = curWindowStyle.backgroundColor || '#ffffff';
  };
  setPullDownRefresh = (options: { [key: string]: any }, webviewConfig: IWindow) => {
    if (options.onPullDownRefresh && webviewConfig.enablePullDownRefresh) {
      this.webviewBody.enablePullDownRefresh = true;
    }
  };
  render = (options: { [key: string]: any }) => {
    // 获取当前 webview 的 config
    const curWindowStyle = Object.assign({}, window.__wxConfig.global.window, window.__wxConfig.page[this.__route__]);
    if (options.onPageScroll) {
      this.enablePageScroll = true;
    }
    if (options.onReachBottom) {
      this.enablePageReachBottom = true;
    }
    if (curWindowStyle.navigationStyle === 'transparent') {
      this.enableTransparentTitle = true;
    }

    // 当第一次渲染页面后，需要监听当前 page 的 scroll 事件
    this.initScrollEvent();
    // 设置窗口颜色
    this.resetBackground();
    // 设置title
    Object.assign(this.navigationBar, curWindowStyle);
    // 设置下拉刷新
    this.setPullDownRefresh(options, curWindowStyle);

    this.__VirtualDom__ = window.app[this.__route__].render(options.data);
    // 生成页面 Dom 树
    this.__DOMTree__ = createDomTree(this.__VirtualDom__, window.app[this.__route__].hash);
    if (this.__DOMTree__) {
      this.webviewBody.appendChild(this.__DOMTree__);
      const lastPage = AppPages[AppPages.length - 2];
      // 初次渲染 page， 如果存在上个page，那么就replace
      if (lastPage && lastPage.pageContainer) {
        this.root.replaceChild(this.pageContainer, lastPage.pageContainer);
      } else {
        this.root.insertBefore(this.pageContainer, this.root.firstChild);
      }
    }
  };
  reRender = (options: { [key: string]: any }) => {
    const newVirtualDom = window.app[this.__route__].render(options.data || {});
    const hash = window.app[this.__route__].hash;
    if (this.__DOMTree__ && this.__VirtualDom__) {
      // 这个方案是没有进行 key 的使用的 ！！！
      const patches = diff(this.__VirtualDom__, newVirtualDom);
      patch(this.__DOMTree__, patches, hash);
      this.__VirtualDom__ = newVirtualDom;
    }
  };
}

/**
 * 管理 View 层的 Page Stack.
 */
export const PageFactory = {
  createPage: (webviewId: number) => {
    var page = new Page(webviewId);
    AppPages.push(page);
    window.scrollTo(0, 0);
    return page;
  },
  removePage: (pageIndex: number) => {
    if (pageIndex > -1) {
      AppPages.splice(pageIndex, 1);
    }
  },
  replacePage: (replaceLength: number = 1, currentWebviewId?: number) => {
    let currentPage: Page | undefined;
    if (currentWebviewId !== undefined) {
      currentPage = AppPages.find((item) => item.__webviewId__ === currentWebviewId);
    } else {
      currentPage = PageFactory.getCurrentPage();
    }
    const lastPage = PageFactory.getLastPage(replaceLength);
    if (lastPage && lastPage.pageContainer && currentPage?.pageContainer) {
      lastPage.initScrollEvent();
      lastPage.resetBackground();
      lastPage.root.replaceChild(lastPage.pageContainer, currentPage.pageContainer);
      // 移除页面
      PageFactory.deleteLastPage(replaceLength, 0);
    }
  },
  /* 移除指定长度的非 tab 页面 */
  deleteLastPage: (delta: number = 1, tabPageLength: number) => {
    const index = AppPages.length - tabPageLength - 1;
    const lastPage = AppPages[index];
    const tabList = window.__wxConfig.tabBar.list.map((item) => item.pagePath);
    if (!tabList.includes(lastPage.__route__)) {
      PageFactory.removePage(index);
    } else {
      tabPageLength += 1;
    }
    delta -= 1;
    if (delta > 0) {
      PageFactory.deleteLastPage(delta, tabPageLength);
    }
  },
  replacePageIndex: (firstIndex: number, lastIndex: number) => {
    [AppPages[firstIndex], AppPages[lastIndex]] = [AppPages[lastIndex], AppPages[firstIndex]];
  },
  getPage: (webviewId: number) => {
    const page = AppPages.find((page) => page.__webviewId__ === webviewId);
    return page || null;
  },
  getPageByRoute: (route: string) => {
    const page = AppPages.find((page) => page.__route__ === route);
    return page || null;
  },
  getCurrentPage: () => {
    const page = PageFactory.getLastPage(0);
    return page;
  },
  getLastPage: (lastIndex: number) => {
    const page = AppPages[AppPages.length - lastIndex - 1];
    return page || null;
  },
  getCurrentWebviewRoute: () => {
    const page = PageFactory.getCurrentPage();
    return page.__route__;
  },
  getCurrentWebviewId: () => {
    const page = PageFactory.getCurrentPage();
    return page.__webviewId__;
  },
  getLastTablePageIndex: () => {
    for (let index = AppPages.length - 1; index >= 0; index--) {
      if (AppPages[index].isTablePage) {
        return index;
      }
    }
    return -1;
  },
  getPageIndex: (webviewId?: number) => {
    let index: number;
    if (webviewId) {
      index = AppPages.findIndex((item) => item.__webviewId__ === webviewId);
    } else {
      index = AppPages.length - 1;
    }
    return { index, length: AppPages.length };
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
    __AppCssCode__[route] && __AppCssCode__[route](page.pageContainer);
    page.render(options);
  } else {
    page.reRender(options);
  }
};

/**
 * 初始化 App，在 wx-app 中处理 app.css, tabBar
 */
export const initApp = (route?: string) => {
  route = route ? route : location.pathname;
  route = route.replace(/^\//, '');

  // 初始化App，使用 wx-app 替换 div#app 元素
  const rootEl: any = document.getElementById('app');
  if (!rootEl) {
    throw Error('No Root Element');
  }
  rootEl.parentNode.replaceChild(document.createElement('wx-app'), rootEl);

  // 初始化 page
  initPage(route);
};

/**
 * 专用于创建page
 */
export const initPage = (route?: string) => {
  __webviewId__++;
  const page = PageFactory.createPage(__webviewId__);
  route = route ? route.split('?')[0] : window.__wxConfig.entryPagePath;

  // 如果事首页，那么需要移除返回按钮 || 页面是 tab 的时候，也需要移除返回按钮
  const tabList = window.__wxConfig.tabBar?.list.map((item) => item.pagePath);
  if (route === window.__wxConfig.entryPagePath || tabList.includes(route)) {
    page.navigationBar.showBackButton = false;
  }

  if (tabList.includes(route)) {
    page.isTablePage = true;
  }

  // 通知 service 层，执行 page 的初始化
  KipleViewJSBridge.publishHandler('registerPage', parserUrl(route), __webviewId__);
};
