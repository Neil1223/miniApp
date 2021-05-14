import { diff } from '../nodeParser/diff/diff';
import { createDomTree } from '../nodeParser/render';

/**
 * 记录已经在 View 层创建的Page
 */
const AppPages: Page[] = [];
let __webviewId__ = 0;

class Page {
  __webviewId__: number;
  __route__: string = '';
  __DOMTree__: HTMLElement | Text | null = null;
  __VirtualDom__: IVirtualDom | null = null;
  root = document.querySelector('#app') || document.body;
  constructor(__webviewId__: number) {
    this.__webviewId__ = __webviewId__;
  }
  render = (data: Object) => {
    this.__VirtualDom__ = window.app[this.__route__].render(data);
    this.__DOMTree__ = createDomTree(this.__VirtualDom__);
    if (this.__DOMTree__) {
      this.root.appendChild(this.__DOMTree__);
    }
  };
  reRender = (data: Object) => {
    const newVirtualDom = window.app[this.__route__].render(data);
    const newDomTree = createDomTree(newVirtualDom);
    if (newDomTree && this.__DOMTree__) {
      this.root.replaceChild(newDomTree, this.__DOMTree__);
      console.log('=========diff======', diff(this.__VirtualDom__, newVirtualDom));
      this.__VirtualDom__ = newVirtualDom;
      this.__DOMTree__ = newDomTree;
    }
  };
}

export const PageFactory = {
  createPage: (webviewId: number) => {
    var page = new Page(webviewId);
    AppPages.push(page);
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
  getCurrentWebviewId: () => __webviewId__,
  setCurrentWebviewId: (webviewId: number) => {
    __webviewId__ = webviewId;
  },
};

export const renderPage = (args: { data: Object; route: string }, webviewId: number) => {
  const { data, route } = args;
  const page = PageFactory.getPage(webviewId);
  if (!page) {
    throw Error(`Page not register for webviewId:${webviewId}`);
  }
  page.__route__ = route;
  if (!page.__DOMTree__) {
    page.render(data);
  } else {
    console.info('should diff dom and render it');
    page.reRender(data);
  }
};

/**
 * 专用于创建page，如果没有参数，那么就是app初始化，如果有参数，那么就是在进行路由跳转
 */
export const initPage = (route?: string) => {
  route = route ? route : location.hash.slice(2, location.hash.length);
  if (!route) {
    route = window.__wxConfig.entryPagePath;
  }
  __webviewId__++;
  PageFactory.createPage(__webviewId__);
  KipleViewJSBridge.publishHandler('registerPage', { route, query: {} }, __webviewId__);
};
