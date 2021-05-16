import { parserUrl } from '@/util';
import { diff } from '../nodeParser/diff/diff';
import { patch } from '../nodeParser/diff/patch';
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
      const lastPage = AppPages[AppPages.length - 2];
      if (lastPage && lastPage.__DOMTree__) {
        this.root.replaceChild(this.__DOMTree__, lastPage.__DOMTree__);
      } else {
        this.root.appendChild(this.__DOMTree__);
      }
    }
  };
  reRender = (data: Object) => {
    const newVirtualDom = window.app[this.__route__].render(data || {});
    if (this.__DOMTree__ && this.__VirtualDom__) {
      // 这个方案是没有进行 key 的使用的 ！！！
      const patches = diff(this.__VirtualDom__, newVirtualDom);
      patch(this.__DOMTree__, patches);
      this.__VirtualDom__ = newVirtualDom;
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
    page.reRender(data);
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
  KipleViewJSBridge.publishHandler('registerPage', parserUrl(route), __webviewId__);
};

export const onRouteChange = (e: Object) => {
  console.log(e, '==onRouteChange==');
  const currentPage = PageFactory.getCurrentPage();
  const lastPage = PageFactory.getLastPage(1);
  if (lastPage && lastPage.__DOMTree__ && currentPage?.__DOMTree__) {
    lastPage.root.replaceChild(lastPage.__DOMTree__, currentPage.__DOMTree__);
    PageFactory.removePage(currentPage.__webviewId__);
  }
};
